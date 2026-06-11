from app.repositories.task_repository import TaskRepository
class TaskService:
    def __init__(self, repo=None):
        self._repo = repo or TaskRepository()
 
    def list_tasks(self):
        return self._repo.all()
 
    def create_task(self, title):
        return self._repo.add(title)
 
    def delete_task(self, task_id):
        return self._repo.remove(task_id)
    
    def get_task(self, task_id):
        return self._repo.find(task_id)
        if task is None:
            return TaskNotFoundError(task_id)
        return task
    