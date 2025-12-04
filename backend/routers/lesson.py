from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.lesson_service import lesson_service

router = APIRouter(prefix="/api/lesson", tags=["lesson"])

class LessonRequest(BaseModel):
    language: str
    difficulty: str

@router.post("/generate")
async def generate_lesson(request: LessonRequest):
    lesson = lesson_service.generate_lesson(request.language, request.difficulty)
    if "error" in lesson:
        raise HTTPException(status_code=500, detail=lesson["error"])
    return lesson
