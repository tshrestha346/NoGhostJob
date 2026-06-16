# import sqlite3

# class TaskRepository:
#     def __init__(self, db_path="tasks.db"):
#         self._db = db_path
#         self._init()
    
#     def _init(self):
#         with sqlite3.connect(self._db) as c:
#             c.execute("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)")
        
#     def all(self):
#         with sqlite3.connect(self._db) as c:
#             rows = c.execute("SELECT id, title FROM tasks").fetchall()
#             return [{"id": row[0], "title": row[1]} for row in rows]
    
#     def add(self, title):
#         with sqlite3.connect(self._db) as c:
#             cursor = c.execute("INSERT INTO tasks (title) VALUES (?)", (title,))
#             return {"id": cursor.lastrowid, "title": title}

#     def remove(self, task_id):
#         with sqlite3.connect(self._db) as c:
#             cursor = c.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
#             return cursor.rowcount > 0


from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Task

class TaskRepository:
    def __init__(self, db: Session):
        self._db = db
    
    def all(self) -> list[Task]:
        return self._db.execute(select(Task)).scalars().all()

    def find(self, task_id: int) -> Task | None:
        return self._db.get(Task, task_id)
    
    def add(self, title: str) -> Task:
        task = Task(title=title)
        self._db.add(task)
        self._db.commit()
        self._db.refresh(task)
        return task

    def remove(self, task_id: int) -> bool:
        task = self._db.get(Task, task_id)
        if task:
            self._db.delete(task)
            self._db.commit()
            return True
        return False