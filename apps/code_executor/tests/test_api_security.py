from typing import Any, Dict

from .conftest import request_json


def _overall_passed(payload: Dict[str, Any]) -> bool:
    if "results" in payload:
        return all(case.get("passed") for case in payload["results"])
    if "isTaskPassed" in payload:
        return bool(payload.get("isTaskPassed"))
    return False


def test_infinite_loop_is_blocked(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "def transform(numbers):\n    while True:\n        pass\n    return [n*2 for n in numbers]",
        "task_id": "test_task-1",
        "mode": "fullTest",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers, timeout=20)
    assert status == 200
    assert _overall_passed(response) is False


def test_memory_bloat_is_blocked(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "def summarize(users):\n    x = ['x'*1024*1024 for _ in range(256)]\n    return sum(u['score'] for u in users) + len(x)",
        "task_id": "test_task-2",
        "mode": "completeTask",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert _overall_passed(response) is False


def test_network_access_is_blocked(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "import socket\n\ndef summarize(users):\n    try:\n        socket.gethostbyname('example.com')\n        s = socket.socket()\n        s.settimeout(1)\n        s.connect(('1.1.1.1', 80))\n        return 'network-allowed'\n    except Exception as e:\n        return f'network-blocked: {e.__class__.__name__}'",
        "task_id": "test_task-2",
        "mode": "fullTest",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert _overall_passed(response) is False


def test_rootfs_write_is_blocked(base_url: str, auth_headers: Dict[str, str]) -> None:
    payload = {
        "source": "def transform(numbers):\n    try:\n        with open('/etc/should_not_write', 'w') as f:\n            f.write('hack')\n        return 'write-success'\n    except Exception as e:\n        return f'write-blocked: {e.__class__.__name__}'",
        "task_id": "test_task-1",
        "mode": "fullTest",
    }
    status, response = request_json("POST", f"{base_url}/api/execute", payload, auth_headers)
    assert status == 200
    assert _overall_passed(response) is False
