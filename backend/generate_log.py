import os
import sys
from fastapi.testclient import TestClient
from main import app

# Add current directory to path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

client = TestClient(app)

def print_turn(role, text):
    print(f"{role}: {text}")

def run_demo():
    print("--- MÓWKA CONVERSATION LOG (REAL API + REDIRECTS) ---\n")
    
    # 0. Test Redirect: Talk to Mati (Market) while at Step 1 (should be Child)
    print("[Action] Approaching Mati (Market) [WRONG NPC]...")
    response = client.post("/api/conversation/start", json={"npc_id": "mati"})
    greeting = response.json()["greeting"]
    print_turn("Mati", greeting)
    
    print("\n--------------------------------------------------\n")
    
    # 1. Start with Child
    print("[Action] Approaching Child (Square)...")
    response = client.post("/api/conversation/start", json={"npc_id": "child"})
    greeting = response.json()["greeting"]
    print_turn("Child", greeting)
    
    # Turn 1: English
    player_text = "Hello. Why are you sad?"
    print_turn("Player", player_text)
    response = client.post("/api/conversation/respond", data={"npc_id": "child", "text": player_text})
    npc_response = response.json()["response"]
    print_turn("Child", npc_response)

    # Turn 2: Mixed
    player_text = "I can help. Is it your cat? Kot?"
    print_turn("Player", player_text)
    response = client.post("/api/conversation/respond", data={"npc_id": "child", "text": player_text})
    npc_response = response.json()["response"]
    print_turn("Child", npc_response)
    
    # Check Quest State
    q_state = client.get("/api/quest/state").json()
    print(f"\n[System] Quest Step: {q_state['current_step']} (Objective: {q_state['objective']})")
    
    print("\n--------------------------------------------------\n")
    
    # 3. Talk to Mati (Market)
    print("[Action] Approaching Mati (Market)...")
    response = client.post("/api/conversation/start", json={"npc_id": "mati"})
    greeting = response.json()["greeting"]
    print_turn("Mati", greeting)
    
    # Turn 1: Mixed
    player_text = "Dzień dobry. Szukam kota."
    print_turn("Player", player_text)
    response = client.post("/api/conversation/respond", data={"npc_id": "mati", "text": player_text})
    npc_response = response.json()["response"]
    print_turn("Mati", npc_response)

    # Turn 2: Polish attempt
    player_text = "Gdzie on jest? Where?"
    print_turn("Player", player_text)
    response = client.post("/api/conversation/respond", data={"npc_id": "mati", "text": player_text})
    npc_response = response.json()["response"]
    print_turn("Mati", npc_response)
    
    # Check Quest State
    q_state = client.get("/api/quest/state").json()
    print(f"\n[System] Quest Step: {q_state['current_step']} (Objective: {q_state['objective']})")
    
    print("\n--------------------------------------------------\n")

    # 5. Talk to Jade (Alley) - Difficulty should increase
    print("[Action] Approaching Jade (Alley)...")
    response = client.post("/api/conversation/start", json={"npc_id": "jade"})
    greeting = response.json()["greeting"]
    print_turn("Jade", greeting)
    
    # Turn 1: Polish
    player_text = "Cześć. Szukam kota."
    print_turn("Player", player_text)
    response = client.post("/api/conversation/respond", data={"npc_id": "jade", "text": player_text})
    npc_response = response.json()["response"]
    print_turn("Jade", npc_response)

    # Turn 2: Polish
    player_text = "Gdzie jest ogród?"
    print_turn("Player", player_text)
    response = client.post("/api/conversation/respond", data={"npc_id": "jade", "text": player_text})
    npc_response = response.json()["response"]
    print_turn("Jade", npc_response)
    
    # Check Quest State
    q_state = client.get("/api/quest/state").json()
    print(f"\n[System] Quest Step: {q_state['current_step']} (Objective: {q_state['objective']})")

if __name__ == "__main__":
    # Reset state first
    client.post("/api/quest/state", json={"step": 1})
    run_demo()
