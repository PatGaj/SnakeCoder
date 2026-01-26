import ast
from typing import Any, Dict, List, Optional

from ..db import get_db_session
from ..models import Task
from ..schemas import ExecutionMode


TaskDefinition = Dict[str, Any]


def _extract_entry_point(starter_code: str) -> Optional[str]:
    try:
        module = ast.parse(starter_code)
    except SyntaxError:
        return None

    for node in module.body:
        if isinstance(node, ast.FunctionDef):
            return node.name
    return None


def _normalize_stdin(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        return " ".join(str(item) for item in value)
    return str(value)


def load_task_by_id(task_id: str, mode: ExecutionMode) -> Optional[TaskDefinition]:
    """Loads task test cases from the SnakeCoder database (Task.tests JSON)."""

    with get_db_session() as session:
        task_row = session.get(Task, task_id)
        entry_point = _extract_entry_point(task_row.starter_code) if task_row else None
        tests = task_row.tests if task_row else None

    if not tests or not isinstance(tests, list):
        return None

    visible_tests = tests[:3] if mode == ExecutionMode.full_test else tests
    test_cases: List[Dict[str, Any]] = []
    for test in visible_tests:
        if not isinstance(test, dict):
            continue
        stdin_value = test.get("input")
        expected = test.get("expectedOutput", test.get("output", test.get("expected")))
        test_cases.append(
            {
                "stdin": _normalize_stdin(stdin_value),
                "expected": expected,
            }
        )

    if not test_cases:
        return None

    return {
        "description": f"DB task: {task_id}",
        "entry_point": entry_point,
        "test_cases": test_cases,
    }
