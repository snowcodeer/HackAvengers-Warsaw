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
    json_response = response.json()
    assert json_response["message"] == "Conversation started with child"
    assert "greeting" in json_response

def test_update_quest_state():
    response = client.post("/api/quest/state", json={"step": 2})
    assert response.status_code == 200
    assert response.json() == {"message": "Quest state updated to 2"}
    
    response = client.get("/api/quest/state")
    assert response.json()["current_step"] == 2

def test_quest_state():
    # Reset state to 1
    client.post("/api/quest/state", json={"step": 1})
    
    response = client.get("/api/quest/state")
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["current_step"] == 1
    assert json_response["objective_polish"] == "Znajdź kota"
    assert "target_location" in json_response
