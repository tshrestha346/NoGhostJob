from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.task_controller import router as task_router
from app.controllers.user_controller import router as user_router
from sqlalchemy import create_engine, text
import os

from app.database import Base, engine
from app import models

from sqlalchemy import select
from app.database import SessionLocal
from app.models import User

app = FastAPI(title="MVC Task API")

# Base.metadata.create_all(bind=engine)

@app.get("/db-ping")
def db_ping():
    engine = create_engine(os.environ["DATABASE_URL"])
    with engine.connect() as conn:
        return {"postgres": conn.execute(text("SELECT version()")).scalar()}

#the view runs on a different origin, so CORS is required
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task_router, prefix="/tasks", tags=["tasks"])
app.include_router(user_router, prefix="/users", tags=["users"])


def seed_users():
    with SessionLocal() as session:
        if not session.execute(select(User)).first():
            session.add_all([User(name="Alice"), User(name="Bob")])
            session.commit()

seed_users()