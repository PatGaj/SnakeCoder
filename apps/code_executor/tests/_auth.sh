#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${EXECUTOR_ENV_FILE:-${ROOT_DIR}/.env}"

if [ -f "${ENV_FILE}" ]; then
  set -a
  # shellcheck source=/dev/null
  . "${ENV_FILE}"
  set +a
fi

if [ -n "${AUTH_TOKEN:-}" ]; then
  export AUTH_HEADER="Authorization: Bearer ${AUTH_TOKEN}"
  return 0
fi

JWT_SECRET="${EXECUTOR_JWT_SECRET:-${NEXTAUTH_SECRET:-}}"
if [ -z "${JWT_SECRET}" ]; then
  echo "Missing EXECUTOR_JWT_SECRET (or NEXTAUTH_SECRET). Cannot call /api/execute with Bearer auth." >&2
  return 1
fi

PYTHON_BIN="${PYTHON_BIN:-}"
if [ -z "${PYTHON_BIN}" ]; then
  if command -v python3 >/dev/null 2>&1; then
    PYTHON_BIN="python3"
  elif command -v python >/dev/null 2>&1; then
    PYTHON_BIN="python"
  else
    echo "Missing python/python3 in PATH. Cannot generate JWT token." >&2
    return 1
  fi
fi

export JWT_SECRET
export JWT_SUB="${EXECUTOR_JWT_SUB:-test-user}"
export JWT_TTL_SECONDS="${EXECUTOR_JWT_TTL_SECONDS:-900}"

AUTH_TOKEN="$("${PYTHON_BIN}" - <<'PY'
import base64
import hashlib
import hmac
import json
import os
import time

secret = os.environ["JWT_SECRET"]
sub = os.environ.get("JWT_SUB", "test-user")
ttl = int(os.environ.get("JWT_TTL_SECONDS", "900"))

header = {"alg": "HS256", "typ": "JWT"}
payload = {"sub": sub, "iss": "snakecoder", "exp": int(time.time()) + ttl}


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


header_b64 = b64url(json.dumps(header, separators=(",", ":"), ensure_ascii=False).encode("utf-8"))
payload_b64 = b64url(json.dumps(payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8"))
signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
sig = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
print(f"{header_b64}.{payload_b64}.{b64url(sig)}")
PY
)"

export AUTH_TOKEN
export AUTH_HEADER="Authorization: Bearer ${AUTH_TOKEN}"
