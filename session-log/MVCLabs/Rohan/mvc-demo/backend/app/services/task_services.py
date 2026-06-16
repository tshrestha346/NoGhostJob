from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository

class TaskNotFoundError(Exception):
    pass
class UserNotFoundError(Exception): ...


class TaskService:
    def __init__(self, tasks:TaskRepository ,users:UserRepository):
        self._tasks= tasks
        self._users = users
 
    def list_tasks(self):
        return self._tasks.all()
 
    # def create_task(self, title):
    #     return self._repo.add(title)
    def create_task(self, title: str, owner_id: int):
        """
        Strip title; raise ValueError if empty. Look up the user; raise UserNotFoundError if missing.
        Delegate the insert to the repository. Hint: you'll need a way to find a User — add UserRepository or expose a method on TaskRepository. """
        if self._users.find(owner_id) is None:
            raise UserNotFoundError(owner_id)
        return self._tasks.add(title, owner_id)
    
    def delete_task(self, task_id):
        return self._tasks.remove(task_id)
    
    def get_task(self, task_id):
        task = self._tasks.find(task_id)
        if task is None:
            raise TaskNotFoundError(task_id)
        return task
    