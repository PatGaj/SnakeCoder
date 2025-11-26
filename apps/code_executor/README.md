# CodeExecutor

## Wymagania
- Python 3.11+

## Instalacja środowiska Python
### Linux
python3 -m venv .venv
### Windows (cmd)
python -m venv .venv

## Aktywacja środowiska
### Linux
source .venv/bin/activate
### Windows (cmd)
.venv\Scripts\activate.bat

## Instalacja pakietów
pip install -r requirements.txt

## Uruchomienie aplikacji
uvicorn app.main:app --reload

## Aktualizacja listy pakietów
pip freeze > requirements.txt
