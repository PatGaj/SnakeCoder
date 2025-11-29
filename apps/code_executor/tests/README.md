### Testing the correct operation of the API and code executor

Run all helper test scripts with one command:

```bash
bash tests/run_all.sh
```

The runner checks whether Docker is up, whether FastAPI answers `/health`, and then calls `curls.sh`, `dangerTest.sh`, and `simulate_queue.sh`, reporting successes/failures. Default base URL is `http://127.0.0.1:8000` (override with `BASE_URL`).
