from fastapi import Depends
from app.database import get_db
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.services.task_service import TaskService


def get_task_service(db=Depends(get_db)):
    return TaskService(
        TaskRepository(db),
        UserRepository(db)
    )