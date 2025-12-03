from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Mówka Backend is running"}

def test_start_conversation():
    response = client.post("/api/conversation/start", json={"npc_id": "child"})
    assert response.status_code == 200
    assert response.json() == {"message": "Conversation started with child"}

def test_quest_state():
    response = client.get("/api/quest/state")
    assert response.status_code == 200
    assert response.json()["current_step"] == 1
