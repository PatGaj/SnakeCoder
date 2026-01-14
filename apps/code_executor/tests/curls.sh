#!/usr/bin/env bash

BASE_URL=${BASE_URL:-http://127.0.0.1:8000}

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
. "${SCRIPT_DIR}/_auth.sh"

if [ -t 1 ]; then
  GREEN="\033[32m"
  RED="\033[31m"
  CYAN="\033[36m"
  RESET="\033[0m"
else
  GREEN=""
  RED=""
  CYAN=""
  RESET=""
fi

print_result() {
  local label=$1
  local response=$2
  local status

  status=$(echo "${response}" | jq -r '
    if has("results") then
      (if ([.results[].passed] | all) then "PASS" else "FAIL" end)
    elif has("isTaskPassed") then
      (if .isTaskPassed then "PASS" else "FAIL" end)
    else
      "UNKNOWN"
    end
  ')

  if [ "${status}" = "PASS" ]; then
    echo -e "[${GREEN}PASS${RESET}] ${label}"
  else
    echo -e "[${RED}FAIL${RESET}] ${label}"
    echo -e "  ${CYAN}Response:${RESET} ${response}"
  fi
}

echo "Health check"
health=$(curl -fsS "${BASE_URL}/health" || true)
if [ -n "${health:-}" ]; then
  echo -e "[${GREEN}PASS${RESET}] /health -> ${health}"
else
  echo -e "[${RED}FAIL${RESET}] /health"
fi

echo
echo "Task results:"

resp1=$(curl -s -X POST "${BASE_URL}/api/execute" \
  -H "${AUTH_HEADER}" \
  -H "Content-Type: application/json" \
  -d @- <<'EOF'
{
  "source": "def transform(numbers):\n    return [n*2 for n in numbers]",
  "task_id": "test_task-1",
  "mode": "fullTest"
}
EOF
)
print_result "Task 1 (double numbers)" "${resp1}"

resp2=$(curl -s -X POST "${BASE_URL}/api/execute" \
  -H "${AUTH_HEADER}" \
  -H "Content-Type: application/json" \
  -d @- <<'EOF'
{
  "source": "def summarize(users):\n    return sum(u['score'] for u in users)",
  "task_id": "test_task-2",
  "mode": "completeTask"
}
EOF
)
print_result "Task 2 (summarize scores)" "${resp2}"

resp3=$(curl -s -X POST "${BASE_URL}/api/execute" \
  -H "${AUTH_HEADER}" \
  -H "Content-Type: application/json" \
  -d @- <<'EOF'
{
  "source": "def cart_total(cart):\n    return sum(item['qty']*item['price'] for item in cart)",
  "task_id": "test_task-3"
}
EOF
)
print_result "Task 3 (cart total)" "${resp3}"

resp4=$(curl -s -X POST "${BASE_URL}/api/execute" \
  -H "${AUTH_HEADER}" \
  -H "Content-Type: application/json" \
  -d @- <<'EOF'
{
  "source": "def join_words(words):\n    return ' '.join(words)",
  "task_id": "test_task-4"
}
EOF
)
print_result "Task 4 (join words, one used to fail)" "${resp4}"
