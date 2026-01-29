from concurrent.futures import ThreadPoolExecutor
from typing import Any, Dict, Tuple

import pytest

from .conftest import request_json


def _send_request(base_url: str, auth_headers: Dict[str, str], index: int) -> Tuple[int, Dict[str, Any]]:
    payload = {
        "source": "def transform(numbers):\n    import time; time.sleep(1); return [n*2 for n in numbers]",
        "task_id": "test_task-1",
    }
    return request_json("POST", f"{base_url}/api/execute", payload, auth_headers, timeout=20)


@pytest.mark.slow
def test_parallel_queue_requests(base_url: str, auth_headers: Dict[str, str]) -> None:
    requests_count = 5
    with ThreadPoolExecutor(max_workers=requests_count) as executor:
        results = list(executor.map(lambda i: _send_request(base_url, auth_headers, i), range(requests_count)))

    for status, response in results:
        assert status == 200
        assert response.get("isTaskPassed") is True
