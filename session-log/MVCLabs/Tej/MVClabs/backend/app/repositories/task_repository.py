from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
import json
from app.models import Task
from app.models import User

class TaskRepository:
    def __init__(self, db: Session):
        self._db = db

    def all(self) -> list[Task]:

        stmt = (
            select(Task)
            .options(joinedload(Task.owner))
        )

        tasks = self._db.execute(stmt).scalars().all()

        return [
            {
                "id": task.id,
                "title": task.title,
                "owner_id": task.owner_id,
                "owner_name": task.owner.name
            }
            for task in tasks
        ]

    def find(self, task_id: int) -> Task | None:
        return self._db.get(Task, task_id)
    
    def add(self, title: str, owner_id: int) -> Task:
        task = Task(title=title, owner_id=owner_id)
        self._db.add(task)
        self._db.commit()
        self._db.refresh(task)
        return task

    # only the logged in user can delete the task
    # def remove(self, task_id: int, owner_id: int) -> bool:
    #     task = self._db.get(Task, task_id)
    #     if task and task.owner_id == owner_id:
    #         self._db.delete(task)
    #         self._db.commit()
    #         return True
    #     return False
    
    def remove(self, task_id: int) -> bool:
        task = self._db.get(Task, task_id)
        if task:
            self._db.delete(task)
            self._db.commit()
            return True
        return False
    
    # def user_task(self, owner_id: int):
    #     stmt = select(Task).where(Task.owner_id == owner_id)
    #     return self._db.execute(stmt).scalars().all()

    def user_task(self, owner_id: int):
        stmt = select(Task).where(Task.owner_id == owner_id)
        return self._db.scalars(stmt).all()