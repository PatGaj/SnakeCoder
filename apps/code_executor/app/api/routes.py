from fastapi import APIRouter, Depends, HTTPException

from ..schemas import CodeExecutionRequest, CodeExecutionResponse, ExecutionMode
from ..security import require_app_auth
from ..services.executor import run_user_code
from ..services.task_loader import load_task_by_id
from tests.test_tasks import get_test_task_by_id

router = APIRouter()


@router.post("/execute")
def execute_code(payload: CodeExecutionRequest, _auth: dict = Depends(require_app_auth)) -> dict:
    """Executes user code for a given task (or ad-hoc) and returns test results."""

    task = None
    entry_point = None

    if payload.mode != ExecutionMode.run_code:
        if not payload.task_id:
            raise HTTPException(
                status_code=400,
                detail="task_id is required for this mode",
            )
        if payload.task_id.split("-")[0] == "test_task":
            task = get_test_task_by_id(payload.task_id)
        else:
            try:
                task = load_task_by_id(payload.task_id, payload.mode)
            except Exception as exc:
                raise HTTPException(status_code=503, detail=str(exc)) from exc
        if task is None:
            raise HTTPException(
                status_code=404,
                detail=f"Task '{payload.task_id}' not found",
            )
        entry_point = task.get("entry_point")

    execution_results = run_user_code(
        source=payload.source,
        task=task or {},
        entry_point=entry_point,
        mode=payload.mode,
    )

    mapped_results = [CodeExecutionResponse(**result) for result in execution_results]

    if payload.mode in (ExecutionMode.full_test, ExecutionMode.run_code):
        return {
            "mode": payload.mode.value,
            "results": [r.model_dump() for r in mapped_results],
        }

    passed_count = sum(1 for r in mapped_results if r.passed)
    is_passed = passed_count == len(mapped_results)

    return {
        "mode": payload.mode.value,
        "isTaskPassed": is_passed,
        "passedCount": passed_count,
    }
