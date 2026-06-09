import sqlite3

class TaskRepository:
    def __init__(self, db_path="tasks.db"):
        self._db = db_path
        self._init()
    
    def _init(self):
        with sqlite3.connect(self._db) as c:
            c.execute("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)")
        
    def all(self):
        with sqlite3.connect(self._db) as c:
            rows = c.execute("SELECT id, title FROM tasks").fetchall()
            return [{"id": row[0], "title": row[1]} for row in rows]
    
    def add(self, title):
        with sqlite3.connect(self._db) as c:
            cursor = c.execute("INSERT INTO tasks (title) VALUES (?)", (title,))
            return {"id": cursor.lastrowid, "title": title}

    def remove(self, task_id):
        with sqlite3.connect(self._db) as c:
            cursor = c.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
            return cursor.rowcount > 0