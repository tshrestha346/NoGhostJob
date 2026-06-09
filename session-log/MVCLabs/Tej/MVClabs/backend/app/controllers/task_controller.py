from fastapi import APIRouter, HTTPException
from app.schemas import Task, TaskCreate
from app.services.task_service import TaskService

router = APIRouter()
service = TaskService()

@router.get("/")
def get_task():
    return service.list_tasks()

@router.post("/", response_model=Task, status_code=201)
def create_task(payload: TaskCreate):
    return service.create_task(payload.title)

@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int):
    if not service.delete_task(task_id):
        raise HTTPException(status_code=404, detail="Task not found!")

#servic login
class TaskService:
    def create_task(self, title: str) -> dict:
        task = {
            "id": self.next_id,
            "title": title,
        }
        print(f"Creating task: {task}")
        self.tasks.append(task)
        self.next_id += 1

        return task

    def delete_task(self, task_id: int) -> bool:
        for task in self.tasks:
            if task["id"] == task_id:
                self.tasks.remove(task)
                return True

        return False
