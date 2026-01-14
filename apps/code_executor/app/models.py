from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class Task(Base):
    __tablename__ = "Task"

    mission_id: Mapped[str] = mapped_column("missionId", String, primary_key=True)
    starter_code: Mapped[str] = mapped_column("starterCode", Text)
    language: Mapped[str] = mapped_column(String, default="python")


class TaskTestCase(Base):
    __tablename__ = "TaskTestCase"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    task_id: Mapped[str] = mapped_column("taskId", String, index=True)
    order: Mapped[int] = mapped_column("order", Integer, quote=True)
    input: Mapped[str] = mapped_column(Text)
    expected_output: Mapped[str] = mapped_column("expectedOutput", Text)
    is_public: Mapped[bool] = mapped_column("isPublic", Boolean, default=True)
