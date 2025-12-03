from fastapi import APIRouter

router = APIRouter(prefix="/api/quest", tags=["quest"])

from routers.conversation import game_state
from pydantic import BaseModel

class QuestStateUpdate(BaseModel):
    step: int

@router.get("/state")
async def get_quest_state():
    step = game_state["quest_step"]
    
    # Quest Data (would be in a database/config file in production)
    quest_data = {
        1: {
            "objective": "Find the lost cat",
            "objective_polish": "Znajdź kota",
            "target_location": {"x": 15, "z": 15}, # Market (Mati)
            "location_name": "Square"
        },
        2: {
            "objective": "Ask Mati about the cat",
            "objective_polish": "Zapytaj Matiego o kota",
            "target_location": {"x": 15, "z": 15}, # Market (Mati)
            "location_name": "Market"
        },
        3: {
            "objective": "Ask Jade for directions",
            "objective_polish": "Zapytaj Jade o drogę",
            "target_location": {"x": -15, "z": -20}, # Alley (Jade)
            "location_name": "Alley"
        },
        4: {
            "objective": "Find Kitty in the Garden",
            "objective_polish": "Znajdź Kitty w ogrodzie",
            "target_location": {"x": -20, "z": 10}, # Garden (Kitty)
            "location_name": "Garden"
        },
        5: {
            "objective": "Return to the Child",
            "objective_polish": "Wróć do dziecka",
            "target_location": {"x": 0, "z": 0}, # Square (Child)
            "location_name": "Square"
        }
    }
    
    current_data = quest_data.get(step, quest_data[1])

    return {
        "current_step": step,
        "objective": current_data["objective"],
        "objective_polish": current_data["objective_polish"],
        "target_location": current_data["target_location"],
        "location": current_data["location_name"]
    }

@router.post("/state")
async def update_quest_state(update: QuestStateUpdate):
    game_state["quest_step"] = update.step
    return {"message": f"Quest state updated to {update.step}"}

@router.get("/vocabulary")
async def get_vocabulary():
    return {
        "learned_words": ["tak", "nie", "kot"],
        "recent_attempts": []
    }
