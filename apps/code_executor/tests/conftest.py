import base64
import hmac
import json
import os
import time
from typing import Any, Dict, Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import pytest


def _load_env_file() -> None:
    env_path = os.environ.get("EXECUTOR_ENV_FILE")
    if not env_path:
        env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    env_path = os.path.abspath(env_path)
    if not os.path.exists(env_path):
        return

    with open(env_path, "r", encoding="utf-8") as env_file:
        for line in env_file:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _build_jwt(secret: str, sub: str, ttl_seconds: int) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {"sub": sub, "iss": "snakecoder", "exp": int(time.time()) + ttl_seconds}
    header_b64 = _b64url(json.dumps(header, separators=(",", ":"), ensure_ascii=False).encode("utf-8"))
    payload_b64 = _b64url(json.dumps(payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(secret.encode("utf-8"), signing_input, "sha256").digest()
    return f"{header_b64}.{payload_b64}.{_b64url(signature)}"


def _resolve_auth_token() -> str:
    _load_env_file()
    token = os.environ.get("AUTH_TOKEN")
    if token:
        return token

    secret = os.environ.get("EXECUTOR_JWT_SECRET") or os.environ.get("NEXTAUTH_SECRET")
    if not secret:
        raise RuntimeError(
            "Missing AUTH_TOKEN or EXECUTOR_JWT_SECRET/NEXTAUTH_SECRET for /api/execute auth."
        )
    sub = os.environ.get("EXECUTOR_JWT_SUB", "test-user")
    ttl = int(os.environ.get("EXECUTOR_JWT_TTL_SECONDS", "900"))
    return _build_jwt(secret, sub, ttl)


def request_json(
    method: str,
    url: str,
    payload: Optional[Dict[str, Any]] = None,
    headers: Optional[Dict[str, str]] = None,
    timeout: Optional[float] = None,
) -> Tuple[int, Dict[str, Any]]:
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    request_headers = {"Accept": "application/json"}
    if headers:
        request_headers.update(headers)
    if data is not None:
        request_headers["Content-Type"] = "application/json"

    req = Request(url, data=data, headers=request_headers, method=method)
    effective_timeout = timeout
    if effective_timeout is None:
        try:
            effective_timeout = float(os.environ.get("REQUEST_TIMEOUT", "15"))
        except ValueError:
            effective_timeout = 15
    try:
        with urlopen(req, timeout=effective_timeout) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body) if body else {}
    except HTTPError as exc:
        body = exc.read().decode("utf-8")
        return exc.code, json.loads(body) if body else {}
    except URLError as exc:
        raise RuntimeError(f"Failed to reach {url}: {exc}") from exc


@pytest.fixture(scope="session")
def base_url() -> str:
    return os.environ.get("BASE_URL", "http://127.0.0.1:8000").rstrip("/")


@pytest.fixture(scope="session")
def auth_headers() -> Dict[str, str]:
    token = _resolve_auth_token()
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session", autouse=True)
def ensure_server(base_url: str) -> None:
    try:
        status, payload = request_json("GET", f"{base_url}/health")
    except RuntimeError as exc:
        pytest.skip(str(exc))
    if status != 200 or payload.get("status") != "ok":
        pytest.skip(f"Server unhealthy at {base_url}/health (status={status}).")
