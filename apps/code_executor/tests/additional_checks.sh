#!/usr/bin/env bash

# Quick negative/validation checks for the API (colorful PASS/FAIL).

set -euo pipefail

BASE_URL=${BASE_URL:-http://127.0.0.1:8000}

if [ -t 1 ]; then
  GREEN="\033[32m"
  RED="\033[31m"
  RESET="\033[0m"
else
  GREEN=""
  RED=""
  RESET=""
fi

pass_count=0
fail_count=0

log_result() {
  local label=$1
  local ok=$2
  if [ "${ok}" = "true" ]; then
    echo -e "[${GREEN}PASS${RESET}] ${label}"
    pass_count=$((pass_count + 1))
  else
    echo -e "[${RED}FAIL${RESET}] ${label}"
    fail_count=$((fail_count + 1))
  fi
}

# 404 for unknown task
raw=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"source": "print(1)", "task_id": "unknown-task", "mode": "fullTest"}')
http_code=${raw##*$'\n'}
log_result "404 for unknown task_id" "$( [ "${http_code}" = "404" ] && echo true || echo false )"

# Schema validation - missing source should yield 422
raw=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"task_id": "test_task-1", "mode": "fullTest"}')
http_code=${raw##*$'\n'}
log_result "422 when source is missing" "$( [ "${http_code}" = "422" ] && echo true || echo false )"

# Runtime error (exception) should return passed=false
raw=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"source": "def transform(numbers):\n    raise ValueError(\"boom\")", "task_id": "test_task-1", "mode": "fullTest"}')
http_code=${raw##*$'\n'}
response=${raw%$'\n'*}
overall_pass=$(echo "${response}" | jq -r 'if has("results") then ([.results[].passed] | all) elif has("isTaskPassed") then .isTaskPassed else false end' 2>/dev/null || echo false)
log_result "Runtime error reports FAIL" "$( [[ "${http_code}" =~ ^2 ]] && [ "${overall_pass}" = "false" ] && echo true || echo false )"

# stdout should be present in results[*].stdout
raw=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"source": "def transform(numbers):\n    print(\"dua\")\n    return [n*2 for n in numbers]", "task_id": "test_task-1", "mode": "fullTest"}')
http_code=${raw##*$'\n'}
response=${raw%$'\n'*}
overall_pass=$(echo "${response}" | jq -r 'if has("results") then ([.results[].passed] | all) elif has("isTaskPassed") then .isTaskPassed else false end' 2>/dev/null || echo false)
stdout_val=$(echo "${response}" | jq -r '.results[0].stdout // ""' 2>/dev/null || echo "")
stdout_ok=false
if [[ "${http_code}" =~ ^2 ]] && [ "${overall_pass}" = "true" ] && [[ "${stdout_val}" == *"dua"* ]]; then
  stdout_ok=true
fi
log_result "stdout returned for full test" "${stdout_ok}"

# stderr should be present in results[*].stderr
raw=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"source": "import sys\n\ndef transform(numbers):\n    print(\"warn\", file=sys.stderr)\n    return [n*2 for n in numbers]", "task_id": "test_task-1", "mode": "fullTest"}')
http_code=${raw##*$'\n'}
response=${raw%$'\n'*}
overall_pass=$(echo "${response}" | jq -r 'if has("results") then ([.results[].passed] | all) elif has("isTaskPassed") then .isTaskPassed else false end' 2>/dev/null || echo false)
stderr_val=$(echo "${response}" | jq -r '.results[0].stderr // ""' 2>/dev/null || echo "")
stderr_ok=false
if [[ "${http_code}" =~ ^2 ]] && [ "${overall_pass}" = "true" ] && [[ "${stderr_val}" == *"warn"* ]]; then
  stderr_ok=true
fi
log_result "stderr returned for full test" "${stderr_ok}"

# error field should include the exception message
raw=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"source": "def transform(numbers):\n    raise RuntimeError(\"boom\")", "task_id": "test_task-1", "mode": "fullTest"}')
http_code=${raw##*$'\n'}
response=${raw%$'\n'*}
error_text=$(echo "${response}" | jq -r '.results[0].error // ""' 2>/dev/null || echo "")
case_passed=$(echo "${response}" | jq -r '.results[0].passed // false' 2>/dev/null || echo false)
error_ok=false
if [[ "${http_code}" =~ ^2 ]] && [ "${case_passed}" = "false" ] && [[ "${error_text}" == *"RuntimeError: boom"* ]]; then
  error_ok=true
fi
log_result "error field contains exception" "${error_ok}"

# runCode mode - returns result and stdout without task_id
raw=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"source": "result = 7\nprint(\"adhoc\")", "mode": "runCode"}')
http_code=${raw##*$'\n'}
response=${raw%$'\n'*}
actual_val=$(echo "${response}" | jq -r '.results[0].actual // empty' 2>/dev/null || echo "")
stdout_val=$(echo "${response}" | jq -r '.results[0].stdout // ""' 2>/dev/null || echo "")
passed_flag=$(echo "${response}" | jq -r '.results[0].passed // false' 2>/dev/null || echo false)
run_ok=false
if [[ "${http_code}" =~ ^2 ]] && [ "${passed_flag}" = "true" ] && [ "${actual_val}" = "7" ] && [[ "${stdout_val}" == *"adhoc"* ]]; then
  run_ok=true
fi
log_result "runCode returns result and stdout" "${run_ok}"

# runCode mode - no explicit result yields success message
raw=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"source": "print(\"ok\")", "mode": "runCode"}')
http_code=${raw##*$'\n'}
response=${raw%$'\n'*}
actual_val=$(echo "${response}" | jq -r '.results[0].actual // ""' 2>/dev/null || echo "")
passed_flag=$(echo "${response}" | jq -r '.results[0].passed // false' 2>/dev/null || echo false)
stdout_val=$(echo "${response}" | jq -r '.results[0].stdout // ""' 2>/dev/null || echo "")
run_msg_ok=false
if [[ "${http_code}" =~ ^2 ]] && [ "${passed_flag}" = "true" ] && [[ "${actual_val}" == "Code executed successfully" ]] && [[ "${stdout_val}" == *"ok"* ]]; then
  run_msg_ok=true
fi
log_result "runCode without return yields success message" "${run_msg_ok}"

echo "Summary: ${pass_count} PASS / ${fail_count} FAIL"
if [ "${fail_count}" -ne 0 ]; then
  exit 1
fi
