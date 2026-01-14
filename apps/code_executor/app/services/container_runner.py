import json
import subprocess
import threading
from typing import Any, Dict, List, Optional


CONTAINER_PYTHON = r"""
import inspect
import json
import sys
import io
import contextlib


def execute_user_code(
    source: str,
    data=None,
    entry_point=None,
    entry_args=None,
    entry_kwargs=None,
    run_as_main=False,
    stdin_text_for_entry=None,
):
    if data is None:
        data = {}

    env = {
        "__builtins__": __builtins__,
        "__name__": "__main__" if run_as_main else "user_code",
    }
    env.update(data)

    compiled = compile(source, "<user_code>", "exec")
    exec(compiled, env, env)

    if entry_point:
        func = env.get(entry_point)
        if not callable(func):
            return f"Error: function '{entry_point}' not found"

        args_to_use = entry_args
        kwargs_to_use = entry_kwargs

        if args_to_use is None and kwargs_to_use is None:
            signature = inspect.signature(func)

            if stdin_text_for_entry is not None:
                args_to_use, kwargs_to_use = build_args_from_stdin(stdin_text_for_entry, signature)
            else:
                args_to_use = []
                kwargs_to_use = {}

                for name, param in signature.parameters.items():
                    if param.kind in (
                        inspect.Parameter.POSITIONAL_ONLY,
                        inspect.Parameter.POSITIONAL_OR_KEYWORD,
                    ):
                        if name in env:
                            args_to_use.append(env[name])
                        elif param.default is not inspect.Parameter.empty:
                            args_to_use.append(param.default)
                        else:
                            return f"Error: missing argument '{name}' for '{entry_point}'"
                    elif param.kind == inspect.Parameter.KEYWORD_ONLY:
                        if name in env:
                            kwargs_to_use[name] = env[name]
                        elif param.default is not inspect.Parameter.empty:
                            kwargs_to_use[name] = param.default
                        else:
                            return f"Error: missing argument '{name}' for '{entry_point}'"

        if args_to_use is None:
            args_to_use = []
        if kwargs_to_use is None:
            kwargs_to_use = {}

        return func(*args_to_use, **kwargs_to_use)

    if "result" in env:
        return env["result"]

    return None


def safe_for_json(value):
    try:
        json.dumps(value)
        return value
    except TypeError:
        return str(value)

def normalize_output(text):
    if text is None:
        return ""
    lines = str(text).splitlines()
    return "\n".join(line.rstrip() for line in lines).rstrip()

def parse_value(text, annotation):
    if annotation is inspect._empty or annotation is None or annotation is str:
        return text

    raw = str(text).strip()

    if annotation is int:
        return int(raw) if raw else 0
    if annotation is float:
        return float(raw) if raw else 0.0
    if annotation is bool:
        lowered = raw.lower()
        if lowered in {"true", "1", "yes", "y", "t"}:
            return True
        if lowered in {"false", "0", "no", "n", "f", ""}:
            return False
        return bool(int(raw)) if raw else False

    origin = getattr(annotation, "__origin__", None)
    args = getattr(annotation, "__args__", None) or ()
    if origin in {list, tuple}:
        inner = args[0] if args else str
        tokens = raw.split() if raw else []
        values = [parse_value(tok, inner) for tok in tokens]
        return values if origin is list else tuple(values)

    return text

def build_args_from_stdin(stdin_text, signature):
    params = [
        p
        for p in signature.parameters.values()
        if p.kind in (
            inspect.Parameter.POSITIONAL_ONLY,
            inspect.Parameter.POSITIONAL_OR_KEYWORD,
        )
    ]

    if not params:
        return [], {}

    if len(params) == 1:
        return [parse_value(stdin_text, params[0].annotation)], {}

    tokens = str(stdin_text).split()
    args = []
    for idx, param in enumerate(params):
        if idx < len(tokens):
            args.append(parse_value(tokens[idx], param.annotation))
        elif param.default is not inspect._empty:
            args.append(param.default)
        else:
            args.append(parse_value("", param.annotation))
    return args, {}

def run_single_case(source, entry_point, data, expected, stdin_text=None):
    buf_out = io.StringIO()
    buf_err = io.StringIO()
    output_limit = 8192

    def _truncate(text):
        if len(text) <= output_limit:
            return text
        return text[:output_limit] + f"... [truncated {len(text) - output_limit} chars]"

    original_stdin = sys.stdin

    with contextlib.redirect_stdout(buf_out), contextlib.redirect_stderr(buf_err):
        try:
            use_entry_from_stdin = stdin_text is not None and entry_point is not None

            if stdin_text is not None and entry_point is None:
                sys.stdin = io.StringIO(str(stdin_text))
            raw_result = execute_user_code(
                source=source,
                data=data,
                entry_point=entry_point,
                entry_args=None,
                entry_kwargs=None,
                run_as_main=stdin_text is not None and entry_point is None,
                stdin_text_for_entry=stdin_text if use_entry_from_stdin else None,
            )
            error = None
        except Exception as exc:
            raw_result = f"{exc.__class__.__name__}: {exc}"
            error = f"{exc.__class__.__name__}: {exc}"
        finally:
            sys.stdin = original_stdin

    if stdin_text is not None:
        expected_norm = normalize_output(expected)

        if entry_point is not None:
            output_value = raw_result if raw_result is not None else buf_out.getvalue()
            actual = normalize_output(output_value if isinstance(output_value, str) else str(output_value))
            passed = actual == expected_norm
        else:
            actual = normalize_output(buf_out.getvalue())
            passed = actual == expected_norm
    else:
        actual = safe_for_json(raw_result)
        passed = actual == expected

    return {
        "expected": expected,
        "actual": actual,
        "passed": passed,
        "stdout": _truncate(buf_out.getvalue()),
        "stderr": _truncate(buf_err.getvalue()),
        "error": error,
    }


def main():
    payload = json.load(sys.stdin)
    source = payload.get("source") or ""
    entry_point = payload.get("entry_point")
    test_cases = payload.get("test_cases") or []

    results = []
    for case in test_cases:
        data = case.get("data") or {}
        expected = case.get("expected")
        stdin_text = case.get("stdin")
        case_result = run_single_case(source, entry_point, data, expected, stdin_text=stdin_text)
        results.append(case_result)

    json.dump({"results": results}, sys.stdout)


if __name__ == "__main__":
    main()
"""


class ContainerExecutionError(RuntimeError):
    """Raised when code execution inside the container fails."""
    pass


_CONCURRENCY_GUARD = threading.BoundedSemaphore(4)
_AVAILABLE_IDS = {1, 2, 3, 4}
_AVAILABLE_IDS_LOCK = threading.Lock()


def _next_container_name(prefix: str = "code_exec") -> str:
    """Allocates the next container name from a small bounded pool."""
    with _AVAILABLE_IDS_LOCK:
        num = min(_AVAILABLE_IDS)
        _AVAILABLE_IDS.remove(num)
    return f"{prefix}_{num}"


def _release_container_name(name: str) -> None:
    """Returns a container identifier to the pool after use."""
    if not name.startswith("code_exec_"):
        return
    try:
        num = int(name.split("_")[-1])
    except ValueError:
        return
    with _AVAILABLE_IDS_LOCK:
        _AVAILABLE_IDS.add(num)
        # keep pool bounded to 4 in case of mis-parse
        _AVAILABLE_IDS.intersection_update({1, 2, 3, 4})


def _force_remove_container(name: Optional[str]) -> None:
    """Removes a container if it was left behind or hung."""
    if not name:
        return
    subprocess.run(
        ["docker", "rm", "-f", name],
        capture_output=True,
        text=True,
        check=False,
    )


def run_code_in_container(
    source: str,
    test_cases: List[Dict[str, Any]],
    entry_point: Optional[str],
    timeout: int = 10,
) -> List[Dict[str, Any]]:
    """Executes user code in a fresh container and returns test results."""
    payload = {
        "source": source,
        "entry_point": entry_point,
        "test_cases": test_cases,
    }

    command = [
        "docker",
        "run",
        "--rm",
        "-i",
        "--user",
        "65534:65534",
        "--network",
        "none",
        "--memory",
        "256m",
        "--memory-swap",
        "256m",
        "--cpus",
        "1",
        "--pids-limit",
        "128",
        "--read-only",
        "--tmpfs",
        "/tmp:rw,noexec,nosuid,size=64m",
        "--ipc",
        "none",
        "--cap-drop",
        "ALL",
        "--security-opt",
        "no-new-privileges",
        "--ulimit",
        "nofile=256:256",
    ]

    container_name = None
    proc = None

    try:
        with _CONCURRENCY_GUARD:
            container_name = _next_container_name()
            full_command = command + [
                "--name",
                container_name,
                "python:3.11-slim",
                "python",
                "-c",
                CONTAINER_PYTHON,
            ]
            proc = subprocess.run(
                full_command,
                input=json.dumps(payload),
                capture_output=True,
                text=True,
                timeout=timeout,
                check=False,
            )
    except FileNotFoundError as exc:
        raise ContainerExecutionError("Docker not found. Ensure it is installed and on PATH.") from exc
    except subprocess.TimeoutExpired as exc:
        _force_remove_container(container_name)
        raise ContainerExecutionError(f"Container execution exceeded timeout ({timeout}s).") from exc
    finally:
        if container_name:
            _release_container_name(container_name)

    if container_name and (proc is None or proc.returncode is None):
        _force_remove_container(container_name)

    if proc.returncode != 0:
        stderr = proc.stderr.strip()
        raise ContainerExecutionError(
            f"Container exited with code {proc.returncode}: {stderr or 'no stderr'}"
        )

    try:
        parsed = json.loads(proc.stdout)
    except json.JSONDecodeError as exc:
        raise ContainerExecutionError(f"Invalid JSON from container: {exc}") from exc

    results = parsed.get("results")
    if not isinstance(results, list):
        raise ContainerExecutionError("Container returned unexpected payload")

    return results
