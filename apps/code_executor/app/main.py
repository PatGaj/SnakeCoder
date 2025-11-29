from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.api import router as api_router

app = FastAPI(title="User Code Executor", version="0.1.0")
MAX_BODY_BYTES = 128 * 1024  # 128 KiB


@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    """Protect the backend from oversized payloads (API-level limit)."""
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > MAX_BODY_BYTES:
                return JSONResponse(
                    status_code=413,
                    content={"detail": "Request body too large"},
                )
        except ValueError:
            pass

    body = await request.body()
    if len(body) > MAX_BODY_BYTES:
        return JSONResponse(
            status_code=413,
            content={"detail": "Request body too large"},
        )

    async def receive():
        return {"type": "http.request", "body": body, "more_body": False}

    request = Request(request.scope, receive=receive)
    return await call_next(request)


@app.get("/health")
def health() -> dict:
    """Simple endpoint to confirm the server is alive."""
    return {"status": "ok"}


app.include_router(api_router, prefix="/api")
