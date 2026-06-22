from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_task():
    response = client.post(
        "/tasks",
        json={
            "title": "Test Task",
            "owner_id": 1
        }
    )

    assert response.status_code == 200

def test_create_and_get_task(client):
    # create task
    response = client.post(
        "/tasks",
        json={
            "title": "Test Task",
            "owner_id": 1
        }
    )

    assert response.status_code == 200

    # get tasks
    response = client.get("/tasks")

    assert response.status_code == 200
    assert len(response.json()) > 0