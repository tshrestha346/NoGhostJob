from app.repositories.user_repository import UserRepository

class UserNotFoundError(Exception):
    pass

class UserService:
    def __init__(self, repo=UserRepository):
        self._repo = repo

    def list_users(self):
        return self._repo.all()
    
    def get_user(self, user_id):
        user = self._repo.find(user_id)
        if not user:
            raise UserNotFoundError(f"User w1ith id {user_id} not found!")
        return user

    def create_user(self, name: str):
        return self._repo.add(name)
        if not task.title:
            raise ValueError("Title cannot be empty!")

        if not task.owner_id:
            raise UserNotFoundError("Owner ID is required!")
        return self._repo.add(task)

    def delete_user(self, user_id):
        return self._repo.remove(user_id)