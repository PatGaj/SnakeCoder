import ast
from typing import Any, Dict, List, Optional

from sqlalchemy import select

from ..db import get_db_session
from ..models import Task, TaskTestCase
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


def load_task_by_id(task_id: str, mode: ExecutionMode) -> Optional[TaskDefinition]:
    """Loads task test cases from the SnakeCoder database (TaskTestCase table)."""

    public_only = mode == ExecutionMode.full_test

    with get_db_session() as session:
        task_row = session.get(Task, task_id)
        entry_point = _extract_entry_point(task_row.starter_code) if task_row else None

        stmt = select(TaskTestCase).where(TaskTestCase.task_id == task_id)
        if public_only:
            stmt = stmt.where(TaskTestCase.is_public.is_(True))
        stmt = stmt.order_by(TaskTestCase.order)
        rows = session.scalars(stmt).all()

    if not rows:
        return None

    test_cases: List[Dict[str, Any]] = [
        {"stdin": row.input, "expected": row.expected_output} for row in rows
    ]

    return {
        "description": f"DB task: {task_id}",
        "entry_point": entry_point,
        "test_cases": test_cases,
    }
