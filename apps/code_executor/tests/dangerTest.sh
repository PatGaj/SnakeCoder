#!/usr/bin/env bash

# Simulate malicious user code; sandbox is expected to block it.
# Results printed as [PASS]/[FAIL] with a short note.

set -euo pipefail

BASE_URL=${BASE_URL:-http://127.0.0.1:8000}

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

log_case() {
  local label=$1
  local payload=$2

  raw=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/execute" \
    -H "Content-Type: application/json" \
    -d "${payload}" )

  http_code=${raw##*$'\n'}
  response=${raw%$'\n'*}

  overall_pass=$(echo "${response}" | jq -r '
    if has("results") then ([.results[].passed] | all)
    elif has("isTaskPassed") then .isTaskPassed
    else false end' 2>/dev/null || echo false)

  if [[ "${http_code}" =~ ^2 ]] && [ "${overall_pass}" != "true" ]; then
    echo -e "[${GREEN}PASS${RESET}] ${label} (sandbox blocked it)"
  else
    echo -e "[${RED}FAIL${RESET}] ${label} (code=${http_code}, passed=${overall_pass})"
    echo -e "  ${CYAN}Response:${RESET} ${response}"
  fi
}

log_case "Infinite loop" '{
  "source": "def transform(numbers):\n    while True:\n        pass\n    return [n*2 for n in numbers]",
  "task_id": "test_task-1",
  "mode": "fullTest"
}'

log_case "Memory bloat" '{
  "source": "def summarize(users):\n    x = ['x'*1024*1024 for _ in range(256)]\n    return sum(u['score'] for u in users) + len(x)",
  "task_id": "test_task-2",
  "mode": "completeTask"
}'

log_case "Network attempt" '{
  "source": "import socket\n\ndef summarize(users):\n    try:\n        socket.gethostbyname('example.com')\n        s = socket.socket()\n        s.settimeout(1)\n        s.connect((\"1.1.1.1\", 80))\n        return \"network-allowed\"\n    except Exception as e:\n        return f\"network-blocked: {e.__class__.__name__}\"",
  "task_id": "test_task-2",
  "mode": "fullTest"
}'

log_case "Rootfs write attempt" '{
  "source": "def transform(numbers):\n    try:\n        with open(\"/etc/should_not_write\", \"w\") as f:\n            f.write(\"hack\")\n        return \"write-success\"\n    except Exception as e:\n        return f\"write-blocked: {e.__class__.__name__}\"",
  "task_id": "test_task-1",
  "mode": "fullTest"
}'
