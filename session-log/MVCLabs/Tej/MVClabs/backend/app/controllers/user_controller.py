from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select

from app.database import get_db
from app.models import User
from app.schemas import Task as TaskSchema, User as UserSchema, UserCreate

from app.auth.dependencies import get_current_user

from app.services.task_service import TaskService
from app.dependencies.task_user_dependencies import get_task_service



router = APIRouter()

@router.get("/", response_model=list[UserSchema])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    users = db.scalars(select(User)).all()

    if not users:
        raise HTTPException(status_code=404, detail="No users found!")

    return users

@router.get("/{user_id}/tasks", response_model = list[TaskSchema])
def list_user_tasks(user_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found!")
    return user.tasks

@router.post("/", response_model = UserSchema, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_user = User(name=user.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.get("/with-tasks", response_model = list[UserSchema])
def users_with_tasks(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    stmt = select(User).options(selectinload(User.tasks))
    return list(db.scalars(stmt))

# @router.get("/user-tasks/{user_id}")
# def user_tasks_list(
#     user_id: int,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     print('user-tasksssssssss', user_id)
#     service = TaskService(db)
#     return service.get_user_task(user_id)

@router.get("/user-tasks/{user_id}", response_model=list[TaskSchema])
def user_tasks_list(
    user_id: int,
    service: TaskService = Depends(get_task_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_user_task(user_id)