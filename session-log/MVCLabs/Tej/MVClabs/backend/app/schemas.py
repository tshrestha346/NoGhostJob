from pydantic import BaseModel, ConfigDict, Field

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    owner_id: int = Field(..., gt=0)

class Task(TaskCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)

class User(UserCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

class TaskOut(BaseModel):
    id: int
    title: str
    owner_id: int
    owner_name: str