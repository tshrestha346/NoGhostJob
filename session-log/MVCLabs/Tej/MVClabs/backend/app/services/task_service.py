from app.models import Task
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository

class TaskNotFoundError(Exception):
    pass

class UserNotFoundError(Exception):
    pass

class TaskService:
    def __init__(self, taskRepo=TaskRepository, userRepo=UserRepository):
        self._taskRepo = taskRepo
        self._userRepo = userRepo

    def list_tasks(self):
        return self._taskRepo.all()
    
    def get_task(self, task_id):
        task = self._taskRepo.find(task_id)
        if not task:
            raise TaskNotFoundError(f"Task with id {task_id} not found!")
        return task

    def create_task(self, title: str, owner_id: int):
        print("Task",Task)
        task = Task(title=title, owner_id=owner_id)
        if not task.title:
            raise ValueError("Title cannot be empty!")

        if not task.owner_id:
            raise UserNotFoundError("Owner ID is required!")
        return self._taskRepo.add(task.title, owner_id)

    def delete_task(self, task_id):
        return self._taskRepo.remove(task_id)