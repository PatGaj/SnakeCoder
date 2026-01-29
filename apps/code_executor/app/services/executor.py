"""Execution orchestration for user code within sandboxed containers."""

from typing import Any, Dict, List, Optional

from ..schemas import ExecutionMode
from ..services.container_runner import ContainerExecutionError, run_code_in_container
from tests.test_tasks import TaskDefinition


def run_user_code(
    source: str,
    task: TaskDefinition,
    entry_point: Optional[str],
    mode: ExecutionMode,
    meta: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """Run user code against task test cases or ad-hoc in runCode mode."""

    if mode == ExecutionMode.run_code:
        test_cases: List[Dict[str, Any]] = [{"data": {}, "expected": None}]
        entry_point_to_use = None
    else:
        test_cases = task.get("test_cases", [])
        entry_point_to_use = entry_point

    try:
        results = run_code_in_container(
            source=source, test_cases=test_cases, entry_point=entry_point_to_use, meta=meta
        )
    except (ContainerExecutionError, Exception) as exc:
        results = [
            {
                "expected": None,
                "actual": f"Execution error: {exc}",
                "passed": False,
            }
        ]

    if mode == ExecutionMode.run_code and results:
        first = results[0]
        if first.get("error"):
            first["passed"] = False
        else:
            first["passed"] = True
            if first.get("actual") is None:
                first["actual"] = "Code executed successfully"

    return results
