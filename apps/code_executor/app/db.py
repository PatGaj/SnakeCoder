import os
from contextlib import contextmanager
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


class Base(DeclarativeBase):
    pass


def _normalize_database_url(url: str) -> str:
    url = url.strip()
    if len(url) >= 2 and url[0] == url[-1] and url[0] in {"'", '"'}:
        url = url[1:-1]

    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://") :]

    if url.startswith("postgresql+"):
        return url
    if url.startswith("postgresql://"):
        return "postgresql+psycopg://" + url[len("postgresql://") :]
    return url


database_url_raw = os.getenv("DATABASE_URL")
database_url = _normalize_database_url(database_url_raw) if database_url_raw else None
_engine = create_engine(database_url, pool_pre_ping=True) if database_url else None
_session_local = sessionmaker(bind=_engine, autoflush=False) if _engine else None


@contextmanager
def get_db_session() -> Iterator[Session]:
    if _session_local is None:
        raise RuntimeError("DATABASE_URL is not configured")
    session = _session_local()
    try:
        yield session
    finally:
        session.close()
