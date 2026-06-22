from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.schemas import Task, TaskCreate
from app.services.task_services import TaskService
 
router = APIRouter()
 
def get_task_repo(db_session: Session = Depends(get_db)) -> TaskRepository:
    return TaskRepository(db_session)

def get_user_repo(db_session: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db_session)

def get_task_service(repo: TaskRepository = Depends(get_task_repo), user_repo: UserRepository = Depends(get_user_repo)) -> TaskService:
    return TaskService(repo, user_repo)
 
@router.get("/", response_model=list[Task])
def get_task(service: TaskService = Depends(get_task_service)) -> list[dict]:
    return service.list_tasks()
 
@router.get("/{task_id}", response_model=Task)
def get_task(task_id: int, service: TaskService = Depends(get_task_service)):
    task = service.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found!")
    return task
 
@router.post("/", response_model=Task, status_code=201)
def create_task(payload: TaskCreate, service: TaskService = Depends(get_task_service)):

    return service.create_task(payload.title, payload.owner_id)
 
@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, service: TaskService = Depends(get_task_service)):
    if not service.delete_task(task_id):
        raise HTTPException(status_code=404, detail="Task not found!")