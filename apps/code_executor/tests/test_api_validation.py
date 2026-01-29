from typing import Any, Dict

from .conftest import request_json


def _overall_passed(payload: Dict[str, Any]) -> bool:
    if "results" in payload:
        return all(case.get("passed") for case in payload["results"])
    if "isTaskPassed" in payload:
        return bool(payload.get("isTaskPassed"))
    return False


def test_unknown_task_returns_404(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {"source": "print(1)", "task_id": "test_task-404", "mode": "fullTest"}
    status, _ = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 404


def test_missing_source_returns_422(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {"task_id": "test_task-1", "mode": "fullTest"}
    status, _ = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 422


def test_runtime_error_reports_fail(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "def transform(numbers):\n    raise ValueError('boom')",
        "task_id": "test_task-1",
        "mode": "fullTest",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert _overall_passed(response) is False


def test_stdout_is_returned(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "def transform(numbers):\n    print('dua')\n    return [n*2 for n in numbers]",
        "task_id": "test_task-1",
        "mode": "fullTest",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert "dua" in response["results"][0]["stdout"]


def test_stderr_is_returned(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "import sys\n\ndef transform(numbers):\n    print('warn', file=sys.stderr)\n    return [n*2 for n in numbers]",
        "task_id": "test_task-1",
        "mode": "fullTest",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert "warn" in response["results"][0]["stderr"]


def test_error_field_contains_exception(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "def transform(numbers):\n    raise RuntimeError('boom')",
        "task_id": "test_task-1",
        "mode": "fullTest",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert response["results"][0]["passed"] is False
    assert "RuntimeError: boom" in (response["results"][0].get("error") or "")
