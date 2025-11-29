from typing import Any, Dict, Optional

TaskTestCase = Dict[str, Any]


class TaskDefinition(Dict[str, Any]):
    """Simple mapping that holds sample tasks and their test cases."""


TESTS_TASKS: Dict[str, TaskDefinition] = {
    "test_task-1": {
        "description": "Double numbers in list",
        "entry_point": "transform",
        "test_cases": [
            {"data": {"numbers": [1, 2, 3]}, "expected": [2, 4, 6]},
            {"data": {"numbers": [0]}, "expected": [0]},
            {"data": {"numbers": [-1, -2]}, "expected": [-2, -4]},
            {"data": {"numbers": [10, 5]}, "expected": [20, 10]},
            {"data": {"numbers": []}, "expected": []},
            {"data": {"numbers": [1.5, 2.5]}, "expected": [3.0, 5.0]},
            {"data": {"numbers": [100]}, "expected": [200]},
            {"data": {"numbers": [7, 8, 9]}, "expected": [14, 16, 18]},
        ],
    },
    "test_task-2": {
        "description": "Summarize user scores",
        "entry_point": "summarize",
        "test_cases": [
            {
                "data": {"users": [{"name": "A", "score": 1}, {"name": "B", "score": 2}]},
                "expected": 3,
            },
            {"data": {"users": []}, "expected": 0},
            {"data": {"users": [{"name": "C", "score": 10}]}, "expected": 10},
            {
                "data": {"users": [{"name": "D", "score": -2}, {"name": "E", "score": 5}]},
                "expected": 3,
            },
            {
                "data": {"users": [{"name": "F", "score": 1.5}, {"name": "G", "score": 2.5}]},
                "expected": 4.0,
            },
            {
                "data": {"users": [{"name": "H", "score": 100}, {"name": "I", "score": 200}]},
                "expected": 300,
            },
            {
                "data": {"users": [{"name": "J", "score": 0}, {"name": "K", "score": 0}]},
                "expected": 0,
            },
            {
                "data": {"users": [{"name": "L", "score": 3}, {"name": "M", "score": 7}, {"name": "N", "score": 10}]},
                "expected": 20,
            },
        ],
    },
    "test_task-3": {
        "description": "Calculate cart total with qty*price",
        "entry_point": "cart_total",
        "test_cases": [
            {
                "data": {"cart": [{"sku": "A", "qty": 2, "price": 5.0}]},
                "expected": 10.0,
            },
            {
                "data": {"cart": [{"sku": "A", "qty": 1, "price": 1.5}, {"sku": "B", "qty": 2, "price": 2.0}]},
                "expected": 5.5,
            },
            {"data": {"cart": []}, "expected": 0.0},
            {
                "data": {"cart": [{"sku": "C", "qty": 3, "price": 10.0}]},
                "expected": 30.0,
            },
            {
                "data": {"cart": [{"sku": "D", "qty": 1, "price": 9.99}, {"sku": "E", "qty": 1, "price": 0.01}]},
                "expected": 10.0,
            },
            {
                "data": {"cart": [{"sku": "F", "qty": 2, "price": 2.5}, {"sku": "G", "qty": 4, "price": 1.0}]},
                "expected": 9.0,
            },
            {
                "data": {"cart": [{"sku": "H", "qty": 10, "price": 0.2}]},
                "expected": 2.0,
            },
            {
                "data": {"cart": [{"sku": "I", "qty": 2, "price": 3.3}, {"sku": "J", "qty": 3, "price": 1.1}]},
                "expected": 9.9,
            },
        ],
    },
    "test_task-4": {
        "description": "Join words with spaces",
        "entry_point": "join_words",
        "test_cases": [
            {"data": {"words": ["hello", "world"]}, "expected": "hello world"},
            {"data": {"words": []}, "expected": ""},
            {"data": {"words": ["OpenAI"]}, "expected": "OpenAI"},
            {"data": {"words": ["one", "two", "three"]}, "expected": "one two three"},
            {"data": {"words": ["leading", "and", "trailing"]}, "expected": "leading and trailing"},
            {"data": {"words": ["UPPER", "lower"]}, "expected": "UPPER lower"},
            {"data": {"words": ["mix", "case", "Ok"]}, "expected": "mix case Ok"},
            {"data": {"words": ["fail", "case"]}, "expected": "fail case"},
        ],
    },
}


def get_test_task_by_id(task_id: str) -> Optional[TaskDefinition]:
    """Return task definition by identifier or None if missing."""
    return TESTS_TASKS.get(task_id)
