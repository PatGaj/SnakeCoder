# SnakeCoder monorepo
Monorepo aplikacji do nauki Pythona przygotowanej na potrzeby pracy dyplomowej. Składa się z backendu wykonującego kod użytkownika oraz frontendowego interfejsu webowego.

## Co znajduje się w repozytorium
- `apps/code_executor` – backend FastAPI, uruchamia i waliduje kod przesyłany przez użytkownika.
- `apps/snake_coder` – frontend Next.js (App Router), interfejs do interakcji z API.

## Wymagania wstępne
- Python v3.11+
- Node.js v20+ oraz `pnpm` (np. `corepack enable` lub `npm install -g pnpm`)
- Docker engine v29+

## Pierwsze uruchomienie krok po kroku
Użyj dwóch terminali: jednego dla backendu i jednego dla frontendu.

### Backend (FastAPI)
```bash
cd apps/code_executor
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload      # API na http://127.0.0.1:8000
```
Szybki test: sprawdź zdrowie serwera pod `http://127.0.0.1:8000/health`.

### Frontend (Next.js)
```bash
cd apps/snake_coder
pnpm install
pnpm dev                           # UI na http://127.0.0.1:3000
```

## Dodatkowe zadania
- Testy backendu: `cd apps/code_executor && pytest tests`
- Aktualizacja locka Pythona: `cd apps/code_executor && pip freeze > requirements.txt`
