class TaskService:
    def __init__(self):
        self._tasks = [
            {"id": 1, "title": "Learn MVC"},
            {"id": 2, "title": "Build Docker app"},
        ]
    
    def list_tasks(self):
        return self._tasks 