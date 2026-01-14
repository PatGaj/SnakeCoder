#!/usr/bin/env bash

# Aggregated runner for test helper scripts in the tests directory.
# Checks Docker and FastAPI /health, then runs curls.sh, dangerTest.sh, simulate_queue.sh and additional_checks.sh.

set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_URL=${BASE_URL:-http://127.0.0.1:8000}

if [ -t 1 ]; then
  GREEN="\033[32m"
  RED="\033[31m"
  CYAN="\033[36m"
  YELLOW="\033[33m"
  BOLD="\033[1m"
  RESET="\033[0m"
else
  GREEN=""
  RED=""
  CYAN=""
  YELLOW=""
  BOLD=""
  RESET=""
fi

passed=0
failed=0

log_step() { printf "\n${CYAN}== %s ==${RESET}\n" "$1"; }
log_ok() { echo -e "[${GREEN}OK${RESET}] $1"; }
log_fail() { echo -e "[${RED}FAIL${RESET}] $1"; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log_fail "Missing command '$1' in PATH."
    exit 1
  fi
}

require_python() {
  if command -v python3 >/dev/null 2>&1; then
    return 0
  fi
  if command -v python >/dev/null 2>&1; then
    return 0
  fi
  log_fail "Missing python/python3 in PATH."
  exit 1
}

check_docker() {
  log_step "Checking Docker daemon"
  if docker info >/dev/null 2>&1; then
    log_ok "Docker is running"
    passed=$((passed + 1))
  else
    log_fail "Docker unavailable or insufficient permissions"
    failed=$((failed + 1))
  fi
}

check_fastapi() {
  log_step "Checking FastAPI /health (${BASE_URL})"
  if response=$(curl -fsS "${BASE_URL}/health"); then
    log_ok "FastAPI responds: ${response}"
    passed=$((passed + 1))
  else
    log_fail "FastAPI not responding at ${BASE_URL}/health"
    failed=$((failed + 1))
  fi
}

run_script() {
  local description=$1
  local script_path=$2
  log_step "${description} (${script_path})"
  if BASE_URL="${BASE_URL}" bash "${script_path}"; then
    log_ok "${description} finished"
    passed=$((passed + 1))
  else
    log_fail "${description} failed"
    failed=$((failed + 1))
  fi
}

main() {
  require_cmd docker
  require_cmd curl
  require_cmd bash
  require_cmd jq
  require_python

  check_docker
  check_fastapi

  run_script "Basic API checks" "${ROOT_DIR}/curls.sh"
  run_script "Container safety checks" "${ROOT_DIR}/dangerTest.sh"
  run_script "Queue simulation (parallel requests)" "${ROOT_DIR}/simulate_queue.sh"
  run_script "Additional API validations" "${ROOT_DIR}/additional_checks.sh"

  printf "\n${BOLD}Summary:${RESET} ${GREEN}%d OK${RESET} / ${RED}%d FAIL${RESET}\n" "${passed}" "${failed}"
  if [ "${failed}" -ne 0 ]; then
    exit 1
  fi
}

main "$@"
