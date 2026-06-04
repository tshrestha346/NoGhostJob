from fastapi import APIRouter
from app.services.task_service import TaskService

router = APIRouter()
service = TaskService()

@router.get("/")
def get_task():
    return service.list_tasks()