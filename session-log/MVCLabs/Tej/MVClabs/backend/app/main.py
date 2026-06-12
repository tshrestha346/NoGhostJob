from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.task_controller import router as task_router
from sqlalchemy import create_engine, text
import os

from app.database import Base, engine
from app import models

app = FastAPI(title="MVC Task API")

Base.metadata.create_all(bind=engine)

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