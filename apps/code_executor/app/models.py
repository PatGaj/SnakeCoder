from sqlalchemy import JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class Task(Base):
    __tablename__ = "Task"

    mission_id: Mapped[str] = mapped_column("missionId", String, primary_key=True)
    starter_code: Mapped[str] = mapped_column("starterCode", Text)
    language: Mapped[str] = mapped_column(String, default="python")
    tests: Mapped[list | None] = mapped_column(JSON, nullable=True)
