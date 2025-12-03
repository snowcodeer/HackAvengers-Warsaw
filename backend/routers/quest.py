from fastapi import APIRouter

router = APIRouter(prefix="/api/quest", tags=["quest"])

@router.get("/state")
async def get_quest_state():
    return {
        "current_step": 1,
        "objective": "Find the lost cat",
        "location": "Square"
    }

@router.get("/vocabulary")
async def get_vocabulary():
    return {
        "learned_words": ["tak", "nie", "kot"],
        "recent_attempts": []
    }
