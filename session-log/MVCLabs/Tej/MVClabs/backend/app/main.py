from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.Controllers.task_Controller import router as task_router

app = FastAPI(title="MVC Task API")

#the view runs on a different origin, so CORS is required
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task_router, prefix="/tasks", tags=["tasks"])