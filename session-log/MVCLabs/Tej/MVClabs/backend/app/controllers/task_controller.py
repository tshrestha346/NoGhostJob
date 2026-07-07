from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.schemas import Task, TaskCreate, TaskOut
from app.services.task_service import TaskNotFoundError, TaskService

from app.auth.dependencies import get_current_user, get_current_user_for_testing
from app.models import User

router = APIRouter()

def get_task_repo(db_session: Session = Depends(get_db)) -> TaskRepository:
    return TaskRepository(db_session) 

def get_user_repo(db_session: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db_session)

def get_task_service(tasks: TaskRepository = Depends(get_task_repo), users: UserRepository = Depends(get_user_repo)) -> TaskService:
    return TaskService(tasks, users)

@router.get("/", response_model=list[TaskOut])
def get_task(service: TaskService = Depends(get_task_service), user: User = Depends(get_current_user)) -> list[dict]:
    return service.list_tasks()

@router.get("/one-user-tasks", response_model=list[TaskOut])
def get_tasks(
    service: TaskService = Depends(get_task_service),
    user: User = Depends(get_current_user_for_testing)
):
    return service.get_user_task(user.id)

@router.get("/{task_id}", response_model=Task)
def get_task(task_id: int, service: TaskService = Depends(get_task_service), user: User = Depends(get_current_user)):
    try:
        return service.get_task(task_id)
    except TaskNotFoundError:
        raise HTTPException(status_code=404, detail="Task not found!")

@router.post("/", response_model=Task, status_code=201)
def create_task(payload: TaskCreate, service: TaskService = Depends(get_task_service), user: User = Depends(get_current_user)):
    return service.create_task(payload.title, payload.owner_id)

@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, service: TaskService = Depends(get_task_service), user: User = Depends(get_current_user)):
    if not service.delete_task(task_id):
        raise HTTPException(status_code=404, detail="Task not found!")

