#!/usr/bin/env bash

# Short queue simulation: sends several parallel requests and shows PASS/FAIL.

set -euo pipefail

BASE_URL=${BASE_URL:-http://127.0.0.1:8000}
TASK_ID=${TASK_ID:-test_task-1}
REQUESTS=${REQUESTS:-5}

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

payload_template=$(cat <<'EOF'
{
  "source": "def transform(numbers):\n    import time; time.sleep(1); return [n*2 for n in numbers]",
  "task_id": "__TASK_ID__"
}
EOF
)

echo "Queue simulation: ${REQUESTS} parallel requests to ${BASE_URL}/api/execute (task_id=${TASK_ID})"

pass_count=0
fail_count=0

send_request() {
  local idx=$1
  local body=${payload_template/__TASK_ID__/${TASK_ID}}
  raw=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/execute" -H "${AUTH_HEADER}" -H "Content-Type: application/json" -d "${body}")
  http_code=${raw##*$'\n'}
  response=${raw%$'\n'*}

  overall_pass=$(echo "${response}" | jq -r '
    if has("results") then ([.results[].passed] | all)
    elif has("isTaskPassed") then .isTaskPassed
    else false end' 2>/dev/null || echo false)

  if [[ "${http_code}" =~ ^2 ]] && [ "${overall_pass}" = "true" ]; then
    echo -e "[${GREEN}PASS${RESET}] req ${idx}"
    pass_count=$((pass_count + 1))
  else
    echo -e "[${RED}FAIL${RESET}] req ${idx} (code=${http_code})"
    echo -e "  ${CYAN}Response:${RESET} ${response}"
    fail_count=$((fail_count + 1))
  fi
}

for i in $(seq 1 "${REQUESTS}"); do
  send_request "${i}" &
done

wait

echo "Summary: ${pass_count} PASS / ${fail_count} FAIL"
