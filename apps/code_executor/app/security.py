import base64
import hashlib
import hmac
import json
import os
import time
from typing import Any, Dict

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer


"""JWT auth utilities for the executor API (HS256 only)."""

_bearer_scheme = HTTPBearer(auto_error=False)


def _b64url_decode(segment: str) -> bytes:
    """Decode a base64url JWT segment into raw bytes."""
    padding = "=" * (-len(segment) % 4)
    return base64.urlsafe_b64decode(segment + padding)


def _load_json(segment: str) -> Dict[str, Any]:
    """Parse a base64url JWT segment into JSON, raising HTTP 401 on failure."""
    try:
        decoded = _b64url_decode(segment)
        return json.loads(decoded.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token") from None


def _jwt_secret() -> str:
    """Fetch the shared JWT secret from ENV or fail fast."""
    secret = os.getenv("EXECUTOR_JWT_SECRET") or os.getenv("NEXTAUTH_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="Missing JWT secret")
    return secret


def verify_bearer_jwt(token: str) -> Dict[str, Any]:
    """Validate HS256 JWT and return its payload."""
    try:
        header_b64, payload_b64, signature_b64 = token.split(".")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token") from None

    header = _load_json(header_b64)
    if header.get("alg") != "HS256":
        raise HTTPException(status_code=401, detail="Invalid token")

    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    expected_sig = hmac.new(_jwt_secret().encode("utf-8"), signing_input, hashlib.sha256).digest()
    provided_sig = _b64url_decode(signature_b64)

    if not hmac.compare_digest(expected_sig, provided_sig):
        raise HTTPException(status_code=401, detail="Invalid token")

    payload = _load_json(payload_b64)

    issuer = payload.get("iss")
    if issuer is not None and issuer != "snakecoder":
        raise HTTPException(status_code=401, detail="Invalid token")

    subject = payload.get("sub")
    if not isinstance(subject, str) or not subject:
        raise HTTPException(status_code=401, detail="Invalid token")

    exp = payload.get("exp")
    if exp is not None:
        try:
            if time.time() >= float(exp):
                raise HTTPException(status_code=401, detail="Token expired")
        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid token") from None

    return payload


def require_app_auth(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> Dict[str, Any]:
    """FastAPI dependency that enforces Bearer auth."""
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Unauthorized")

    return verify_bearer_jwt(credentials.credentials)
