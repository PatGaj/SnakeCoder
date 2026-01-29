### Testing the correct operation of the API and code executor

### Pytest functional tests
The pytest suite calls the live FastAPI service and exercises `/health` and `/api/execute`.

Requirements:
- API server running (default `http://127.0.0.1:8000`, override with `BASE_URL`)
- Auth token configured via `AUTH_TOKEN` or `EXECUTOR_JWT_SECRET` / `NEXTAUTH_SECRET`

Run all tests:
```bash
pytest tests
```

Run only the queue test (marked slow):
```bash
pytest tests -m slow
```

```bash
bash tests/run_all.sh
```

The runner checks whether Docker is up, whether FastAPI answers `/health`, and then calls `curls.sh`, `dangerTest.sh`, and `simulate_queue.sh`, reporting successes/failures. Default base URL is `http://127.0.0.1:8000` (override with `BASE_URL`).

### Auth
`/api/execute` requires `Authorization: Bearer <jwt>` now.

To run the scripts you need one of:
- `AUTH_TOKEN` (pre-generated JWT), or
- `EXECUTOR_JWT_SECRET` (or `NEXTAUTH_SECRET`) so the scripts can generate a short-lived HS256 token.

Example:
```bash
export EXECUTOR_JWT_SECRET="dev-secret"
bash tests/run_all.sh
```
