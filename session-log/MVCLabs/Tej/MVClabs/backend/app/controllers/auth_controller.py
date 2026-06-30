from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from app.auth.hashing import hash_password, verify_password
from app.auth.tokens import create_access_token
from app.repositories.user_repository import UserRepository
from app.schemas import User as UserSchema
from app.controllers.task_controller import get_user_repo  #reuse the factory

router = APIRouter()

class TokenResponse(BaseModel):
    access_token: str 
    token_type: str = "bearer"

class RegisterRequest(BaseModel):
    name: str
    password: str

@router.post("/register", response_model=UserSchema, status_code=201)
def register(payload: RegisterRequest, repo: UserRepository = Depends(get_user_repo)):
    if repo.find_by_name(payload.name) is not None:
        raise HTTPException(409, "Name taken")
    
    user = repo.add(payload.name, hash_password(payload.password))
    return user

@router.post("/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends(), repo: UserRepository = Depends(get_user_repo)):
    user = repo.find_by_name(form.username)
    if user is None or not verify_password(form.password, user.password_hash):
        raise HTTPException(401, "Incorrect credentials")
    
    return TokenResponse(access_token=create_access_token(user.id))