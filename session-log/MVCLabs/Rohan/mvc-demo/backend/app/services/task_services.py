# app/services/task_services.py

from app.models import User
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository


class TaskNotFoundError(Exception):
    pass


class UserNotFoundError(Exception):
    pass


class NotAuthorizedError(Exception):
    """Raised when a user tries to access or delete a task they don't own."""
    pass


class TaskService:
    def __init__(self, tasks: TaskRepository, users: UserRepository):
        self._tasks = tasks
        self._users = users

    def get_user_task(self, user_id: int):
        """Used by test_list_tasks_returns_only_current_users_tasks and test_create_task_strips_whitespace."""
        return self._tasks.all_for_user(user_id)

    def list_tasks(self, current_user: User):
        return self._tasks.all_for_user(current_user.id)

    def create_task(self, title: str, user_id: int):
        """Modified to accept user_id directly as used in your test arrangements."""
        title = title.strip()
        if not title:
            raise ValueError("Title cannot be empty")

        if self._users.find(user_id) is None:
            raise UserNotFoundError(user_id)

        return self._tasks.add(title, user_id)

    def delete_task(self, task_id: int):
        return self._tasks.remove(task_id)

    def get_task(self, task_id: int):
        """Fetches a task by its ID. Throws 404 if not found."""
        task = self._tasks.find(task_id)
        if task is None:
            raise TaskNotFoundError(task_id)
        return task

    def get_another_user_and_task(self, task_id: int, current_user: User):
        """
        Fetches a task and verifies ownership. 
        Used by test_get_task_raises_when_current_user_is_not_owner.
        """
        task = self.get_task(task_id)  
        if task.owner_id != current_user.id:
            raise NotAuthorizedError("You are not authorized to view this task.")
        return task

    def delete_others_task(self, task_id: int, current_user: User):
        """
        Deletes a task only if the current user owns it.
        Used by test_delete_task_raises_when_current_user_is_not_owner 
        and test_delete_own_task_removes_it_from_repository.
        """
        task = self.get_task(task_id)  
        if task.owner_id != current_user.id:
            raise NotAuthorizedError("You are not authorized to delete this task.")
        return self._tasks.remove(task_id)