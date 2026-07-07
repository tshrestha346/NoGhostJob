def test_client_fixture_wires_alice_as_current_user(client, alice):
    """The client fixture should wire Alice as the current user."""
    r = client.get("/tasks/")
    assert r.status_code == 200
    assert r.json() == []
