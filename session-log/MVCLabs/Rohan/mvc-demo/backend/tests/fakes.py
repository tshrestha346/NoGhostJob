from app.models import Task, User

class FakeTaskRepository:
    def __init__(self):
        self._tasks:list[Task]=[]
        self._next_id:int=1

    def all_for_user(self,owner_id: int) -> list[Task]:
        return [t for t in self._tasks if t.owner_id==owner_id]
    def find(self, task_id:int )-> Task | None :
        return next((t for t in self._tasks if t.id==task_id), None)
    
    def add(self, title:str, owner_id:int)-> Task:
        task =Task(id= self._next_id, title=title, owner_id=owner_id)
        self._next_id += 1
        self._tasks.append(task)
        return task
    
    def remove(self, task_id:int)-> bool:
        task = self.find(task_id)
        if task:
            self._tasks.remove(task)
            return True
        return False
    
class FakeUserRepository:
    def __init__(self,users: list[User]|None = None):
        self._users = {u.id: u for u in (users or [])}

    def find(self, user_id:int)-> User | None:
        return self._users.get(user_id)