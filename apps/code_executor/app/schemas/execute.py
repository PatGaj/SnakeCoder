from enum import Enum
from typing import Any, List, Optional

from pydantic import BaseModel, Field


class ExecutionMode(str, Enum):
    """Supported execution modes for user code."""

    full_test = "fullTest"
    complete_task = "completeTask"
    run_code = "runCode"


class CodeExecutionRequest(BaseModel):
    """Input payload for a single API request to run user code."""

    source: str = Field(..., description="User-provided Python source code")
    task_id: Optional[str] = Field(
        None,
        description="Identifier for task data to preload (optional for runCode mode)",
    )
    mode: ExecutionMode = Field(
        default=ExecutionMode.complete_task,
        description="Execution mode: fullTest (first 3 cases), completeTask (all cases) or runCode",
    )


class CodeExecutionResponse(BaseModel):
    """Single test result with expected/actual values and captured output."""

    expected: Any
    actual: Any
    passed: bool
    stdout: str = ""
    stderr: str = ""
    error: Optional[str] = None


class CodeExecutionBatchResponse(BaseModel):
    """Aggregated result for a task including stats."""

    mode: ExecutionMode
    results: Optional[List[CodeExecutionResponse]] = None
    is_task_passed: Optional[bool] = Field(None, alias="isTaskPassed")
    passed_count: Optional[int] = Field(None, alias="passedCount")

    class Config:
        allow_population_by_field_name = True
