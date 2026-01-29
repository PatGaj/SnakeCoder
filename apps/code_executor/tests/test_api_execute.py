from typing import Any, Dict

from .conftest import request_json


def _overall_passed(payload: Dict[str, Any]) -> bool:
    if "results" in payload:
        return all(case.get("passed") for case in payload["results"])
    if "isTaskPassed" in payload:
        return bool(payload.get("isTaskPassed"))
    return False


def test_healthcheck(base_url: str) -> None:
    status, payload = request_json("GET", f"{base_url}/health")
    assert status == 200
    assert payload.get("status") == "ok"


def test_full_test_task_1(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "def transform(numbers):\n    return [n*2 for n in numbers]",
        "task_id": "test_task-1",
        "mode": "fullTest",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert response.get("mode") == "fullTest"
    assert _overall_passed(response) is True


def test_complete_task_2(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "def summarize(users):\n    return sum(u['score'] for u in users)",
        "task_id": "test_task-2",
        "mode": "completeTask",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert response.get("mode") == "completeTask"
    assert response.get("isTaskPassed") is True


def test_default_mode_is_complete_task(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "def cart_total(cart):\n    return sum(item['qty']*item['price'] for item in cart)",
        "task_id": "test_task-3",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert response.get("mode") == "completeTask"
    assert response.get("isTaskPassed") is True


def test_task_4_join_words(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "def join_words(words):\n    return ' '.join(words)",
        "task_id": "test_task-4",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert response.get("isTaskPassed") is True


def test_run_code_returns_result_and_stdout(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {"source": 'result = 7\nprint("adhoc")', "mode": "runCode"}
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert response.get("mode") == "runCode"
    assert response["results"][0]["actual"] == 7
    assert "adhoc" in response["results"][0]["stdout"]
    assert response["results"][0]["passed"] is True


def test_run_code_without_result_yields_message(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {"source": 'print("ok")', "mode": "runCode"}
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert response["results"][0]["actual"] == "Code executed successfully"
    assert "ok" in response["results"][0]["stdout"]
    assert response["results"][0]["passed"] is True
