from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select

from app.database import get_db
from app.models import User
from app.schemas import Task as TaskSchema, User as UserSchema, UserCreate

router = APIRouter()

@router.get("/", response_model = list[UserSchema])
def list_users(db: Session = Depends(get_db)):
    if not db.scalars(select(User)).all():
        raise HTTPException(status_code=404, detail="No users found!")
    return list(db.scalars(select(User)))

@router.get("/{user_id}/tasks", response_model = list[TaskSchema])
def list_user_tasks(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found!")
    return user.tasks

@router.post("/", response_model = UserSchema, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.get("/with-tasks", response_model = list[UserSchema])
def users_with_tasks(db: Session = Depends(get_db)):
    stmt = select(User).options(selectinload(User.tasks))
    return list(db.scalars(stmt))