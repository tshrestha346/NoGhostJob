from sqlalchemy import select
from sqlalchemy.orm import Session
 
from app.models import Task, User

class UserRepository:
    def __init__(self, db: Session):
        self._db = db
   
    def all(self) -> list[User]:
        return self._db.execute(select(User)).scalars().all()
 
    def find(self, user_id: int) -> User | None:
        return self._db.get(User, user_id)
   
    # def add(self, username: str) -> User:
    #     user = User(username=username)
    #     self._db.add(user)
    #     self._db.commit()
    #     self._db.refresh(user)
    #     return user
 
    # def remove(self, user_id: int) -> bool:
    #     user = self._db.get(User, user_id)
    #     if user:
    #         self._db.delete(user)
    #         self._db.commit()
    #         return True
    #     return False