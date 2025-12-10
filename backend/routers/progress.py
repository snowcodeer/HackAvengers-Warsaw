from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import database

router = APIRouter(prefix="/api/progress", tags=["Progress"])

class ProgressData(BaseModel):
    xp: int
    level: int
    totalXP: int
    conversations: list
    achievements: list
    streaks: Dict[str, Any]

class SaveProgressRequest(BaseModel):
    user_id: str
    data: ProgressData

@router.post("/save")
async def save_user_progress(request: SaveProgressRequest):
    try:
        database.save_progress(request.user_id, request.data.dict())
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/load/{user_id}")
async def load_user_progress(user_id: str):
    data = database.load_progress(user_id)
    if data:
        return data
    return {"status": "no_data"}
