from app.repositories.task_repository import TaskRepository

class TaskNotFoundError(Exception):
    pass

class TaskService:
    def __init__(self, repo=TaskRepository):
        self._repo = repo

    def list_tasks(self):
        return self._repo.all()
    
    def get_task(self, task_id):
        task = self._repo.find(task_id)
        if not task:
            raise TaskNotFoundError(f"Task with id {task_id} not found!")
        return task

    def create_task(self, title):
        return self._repo.add(title)

    def delete_task(self, task_id):
        return self._repo.remove(task_id)