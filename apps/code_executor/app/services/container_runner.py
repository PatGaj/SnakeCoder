"""Docker-backed sandbox runner for user code execution."""

import json
import subprocess
import threading
import time
from typing import Any, Dict, List, Optional


CONTAINER_PYTHON = r"""
import inspect
import json
import sys
import io
import contextlib


def build_env(source: str, data=None, run_as_main=False):
    if data is None:
        data = {}

    env = {
        "__builtins__": __builtins__,
        "__name__": "__main__" if run_as_main else "user_code",
    }
    env.update(data)

    compiled = compile(source, "<user_code>", "exec")
    exec(compiled, env, env)
    return env


def execute_user_code(
    source: str,
    data=None,
    entry_point=None,
    entry_args=None,
    entry_kwargs=None,
    run_as_main=False,
    env=None,
):
    if env is None:
        env = build_env(source, data=data, run_as_main=run_as_main)

    if entry_point:
        func = env.get(entry_point)
        if not callable(func):
            return f"Error: function '{entry_point}' not found"

        return func(*(entry_args or []), **(entry_kwargs or {}))

    if "result" in env:
        return env["result"]

    return None


def sanitize_output(text, limit=8192):
    if text is None:
        return ""
    lines = str(text).splitlines()
    cleaned = "\n".join(line.rstrip() for line in lines).rstrip()
    if len(cleaned) <= limit:
        return cleaned
    return cleaned[:limit] + f"... [truncated {len(cleaned) - limit} chars]"

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

def resolve_call_args(func, env, entry_args, entry_kwargs, stdin_text_for_entry):
    if entry_args is not None or entry_kwargs is not None:
        return entry_args or [], entry_kwargs or {}

    signature = inspect.signature(func)
    if stdin_text_for_entry is not None:
        return build_args_from_stdin(stdin_text_for_entry, signature)

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
                raise ValueError(f"Error: missing argument '{name}' for '{func.__name__}'")
        elif param.kind == inspect.Parameter.KEYWORD_ONLY:
            if name in env:
                kwargs_to_use[name] = env[name]
            elif param.default is not inspect.Parameter.empty:
                kwargs_to_use[name] = param.default
            else:
                raise ValueError(f"Error: missing argument '{name}' for '{func.__name__}'")
    return args_to_use, kwargs_to_use

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

    original_stdin = sys.stdin

    with contextlib.redirect_stdout(buf_out), contextlib.redirect_stderr(buf_err):
        try:
            use_entry_from_stdin = stdin_text is not None and entry_point is not None

            if stdin_text is not None and entry_point is None:
                sys.stdin = io.StringIO(str(stdin_text))

            env = build_env(source, data=data, run_as_main=stdin_text is not None and entry_point is None)
            entry_args = None
            entry_kwargs = None
            if entry_point is not None:
                entry_args, entry_kwargs = resolve_call_args(
                    func=env.get(entry_point),
                    env=env,
                    entry_args=None,
                    entry_kwargs=None,
                    stdin_text_for_entry=stdin_text if use_entry_from_stdin else None,
                )
            raw_result = execute_user_code(
                source=source,
                data=data,
                entry_point=entry_point,
                entry_args=entry_args,
                entry_kwargs=entry_kwargs,
                run_as_main=stdin_text is not None and entry_point is None,
                env=env,
            )
            error = None
        except Exception as exc:
            raw_result = f"{exc.__class__.__name__}: {exc}"
            error = f"{exc.__class__.__name__}: {exc}"
        finally:
            sys.stdin = original_stdin

    actual_output = sanitize_output(buf_out.getvalue())
    if stdin_text is not None:
        expected_norm = sanitize_output(expected)
        output_value = raw_result if entry_point is not None else actual_output
        actual = sanitize_output(output_value)
        passed = actual == expected_norm
    else:
        actual = json.loads(json.dumps(raw_result, default=str))
        passed = actual == expected

    return {
        "expected": expected,
        "actual": actual,
        "passed": passed,
        "stdout": sanitize_output(buf_out.getvalue()),
        "stderr": sanitize_output(buf_err.getvalue()),
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


_CONTAINER_PREFIX = "code_exec_"
_CONCURRENCY_GUARD = threading.BoundedSemaphore(4)


def _next_container_name() -> str:
    """Generates a unique container name with the required prefix."""
    unique = f"{threading.get_ident()}-{time.time_ns()}"
    return f"{_CONTAINER_PREFIX}{unique}"


def _release_container_name(_: str) -> None:
    """No-op for name release (kept for API symmetry)."""
    return None


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
