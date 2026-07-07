from app.models import Task

def _seed_task(db, title: str, owner_id: int) -> Task:
    t = Task(title=title, owner_id=owner_id)
    db.add(t)
    db.commit()
    db.refresh(t)
    return t

def test_list_tasks_does_not_leak_other_users_tasks(client, db_session, alice, bob):
    """
    Given: Alice has 1 task; Bob has 2 tasks (seeded directly via db_session).
    When: GET /tasks/ (client is Alice).
    Then: response contains only Alice's task: neither of Bob's is present.
    """
    # Seed tasks directly via db_session (not via the API)
    _seed_task(db_session, "Alice's task", alice.id)
    _seed_task(db_session, "Bob's first task", bob.id)
    _seed_task(db_session, "Bob's second task", bob.id)

    # Act: Alice calls GET /tasks/one-user-tasks
    response = client.get("/tasks/one-user-tasks", headers={"X-User-Id": str(alice.id)})

    # Assert: response contains only Alice's task
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Alice's task"