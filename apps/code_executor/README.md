# CodeExecutor

## Requirements

- Python 3.11+

## Create a virtualenv

### Linux

python3 -m venv .venv

### Windows (cmd)

python -m venv .venv

## Activate the environment

### Linux

source .venv/bin/activate

### Windows (cmd)

.venv\Scripts\activate.bat

## Install requirements

pip install -r requirements.txt

## Run the app

uvicorn app.main:app --reload
uvicorn app.main:app --reload --env-file .env
uvicorn app.main:app --host 0.0.0.0 --port 8000 --env-file .env

## Environment

- `DATABASE_URL` (optional): SnakeCoder Postgres URL used to load task test cases by `task_id` (table `"TaskTestCase"`). Works with Prisma-style `postgresql://...` URLs.
- `EXECUTOR_JWT_SECRET` (or `NEXTAUTH_SECRET`): HS256 secret for Bearer JWT required by `/api/execute`.

## Update requirements lock

pip freeze > requirements.txt

## Run tests

bash ./tests/run_all.sh

## Naming conventions

- CamelCase: class names and objects exported at module level.
- snake_case: functions, variables, parameters, enum values (e.g., `full_test`, `complete_task`).
- Uppercase only for real configuration constants, not regular variables.
