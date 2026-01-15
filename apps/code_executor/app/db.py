import os
from contextlib import contextmanager
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


class Base(DeclarativeBase):
    pass

DATABASE_URL = os.getenv("DATABASE_URL")
_engine = create_engine(DATABASE_URL)
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
