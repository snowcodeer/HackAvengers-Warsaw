"""
═══════════════════════════════════════════════════════════════════════════════
LINGUAVERSE - Main Backend Application
Unified API for immersive language learning

Endpoints:
- /api/speak, /api/transcribe - Voice (ElevenLabs)
- /api/conversation/* - Multi-turn AI conversations
- /api/lessons/*, /api/progress/* - Learning content
- /api/glossary/* - Vocabulary tracking
═══════════════════════════════════════════════════════════════════════════════
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

# Import routers
from routers import conversation, quest, voice, scenario
from services.lesson_service import lesson_service
from services.elevenlabs_service import elevenlabs_service

# ═══════════════════════════════════════════════════════════════════════════════
# APP INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="LinguaVerse API",
    description="Immersive language learning with AI conversations and ElevenLabs voice",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Session-Id", "X-Transcription", "X-Response-Text", "X-Turn-Count"]
)


# ═══════════════════════════════════════════════════════════════════════════════
# INCLUDE ROUTERS
# ═══════════════════════════════════════════════════════════════════════════════

# Voice API - TTS, STT, Pronunciation
app.include_router(voice.router)

# Conversation API - Multi-turn dialogue
app.include_router(conversation.router)

# Quest API - Game progression
app.include_router(quest.router)

# Scenario API - Dynamic generation
app.include_router(scenario.router)


# ═══════════════════════════════════════════════════════════════════════════════
# ROOT & HEALTH ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/")
async def root():
    """API root - health check and feature list"""
    return {
        "name": "LinguaVerse API",
        "version": "2.0.0",
        "status": "running",
        "endpoints": {
            "voice": "/api/speak, /api/transcribe, /api/pronunciation/assess",
            "conversation": "/api/conversation/start, /api/conversation/respond",
            "lessons": "/api/lessons/{language}",
            "progress": "/api/progress/{language}",
            "glossary": "/api/glossary/{language}",
            "docs": "/docs"
        },
        "features": [
            "ElevenLabs TTS with character voices",
            "ElevenLabs STT for speech recognition", 
            "Pronunciation assessment",
            "Multi-turn AI conversations (Claude)",
            "Structured lesson plans",
            "Progress tracking",
            "Vocabulary glossary"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "linguaverse"}


# ═══════════════════════════════════════════════════════════════════════════════
# LESSON ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/lessons/{language}")
async def get_lesson_plan(language: str):
    """Get full lesson plan for a language"""
    lessons = lesson_service.get_lesson_plan(language)
    if not lessons:
        raise HTTPException(status_code=404, detail=f"No lessons found for {language}")
    return {"language": language, "lessons": lessons}


@app.get("/api/lessons/{language}/{lesson_id}")
async def get_lesson(language: str, lesson_id: str):
    """Get a specific lesson"""
    lesson = lesson_service.get_lesson(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


@app.get("/api/lessons/{language}/next")
async def get_next_lesson(language: str, user_id: str = "default_user"):
    """Get next available lesson for user"""
    lesson = lesson_service.get_next_lesson(user_id, language)
    if not lesson:
        return {"message": "All lessons completed!", "completed": True}
    return lesson


@app.post("/api/lessons/{lesson_id}/complete")
async def complete_lesson(
    lesson_id: str,
    user_id: str = "default_user",
    score: float = 100.0,
    time_spent: int = 600
):
    """Mark lesson as completed"""
    result = lesson_service.complete_lesson(user_id, lesson_id, score, time_spent)
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# PROGRESS ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/progress/{language}")
async def get_progress(language: str, user_id: str = "default_user"):
    """Get user's progress for a language"""
    return lesson_service.get_user_progress(user_id, language)


@app.get("/api/progress")
async def get_all_progress(user_id: str = "default_user"):
    """Get user's progress for all languages"""
    languages = ["french", "german", "spanish", "italian", "japanese", "mandarin", "polish"]
    return {lang: lesson_service.get_user_progress(user_id, lang) for lang in languages}


# ═══════════════════════════════════════════════════════════════════════════════
# GLOSSARY ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/glossary/{language}")
async def get_glossary(language: str, user_id: str = "default_user"):
    """Get user's vocabulary glossary"""
    return lesson_service.get_user_glossary(user_id, language)


@app.post("/api/glossary/{language}/word/{word}/practice")
async def practice_word(language: str, word: str, correct: bool, user_id: str = "default_user"):
    """Update word mastery after practice"""
    return lesson_service.update_word_mastery(user_id, language, word, correct)


# ═══════════════════════════════════════════════════════════════════════════════
# LANGUAGE & CHARACTER INFO
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/languages")
async def get_languages():
    """Get available languages with metadata"""
    return {
        "languages": [
            {
                "code": "french", "name": "French", "native_name": "Français",
                "flag": "🇫🇷", "scene": "Paris Boulangerie", "character": "Amélie",
                "character_id": "amelie", "difficulty": "beginner-friendly"
            },
            {
                "code": "german", "name": "German", "native_name": "Deutsch",
                "flag": "🇩🇪", "scene": "Berlin Techno Club", "character": "Wolfgang",
                "character_id": "wolfgang", "difficulty": "intermediate"
            },
            {
                "code": "spanish", "name": "Spanish", "native_name": "Español",
                "flag": "🇪🇸", "scene": "Madrid Tapas Bar", "character": "Carmen",
                "character_id": "carmen", "difficulty": "beginner-friendly"
            },
            {
                "code": "italian", "name": "Italian", "native_name": "Italiano",
                "flag": "🇮🇹", "scene": "Rome Café", "character": "Marco",
                "character_id": "marco", "difficulty": "beginner-friendly"
            },
            {
                "code": "japanese", "name": "Japanese", "native_name": "日本語",
                "flag": "🇯🇵", "scene": "Kyoto Tea House", "character": "Yuki",
                "character_id": "yuki", "difficulty": "challenging"
            },
            {
                "code": "mandarin", "name": "Mandarin Chinese", "native_name": "中文",
                "flag": "🇨🇳", "scene": "Beijing Tea House", "character": "Mei Lin",
                "character_id": "meilin", "difficulty": "challenging"
            },
            {
                "code": "polish", "name": "Polish", "native_name": "Polski",
                "flag": "🇵🇱", "scene": "Warsaw Milk Bar", "character": "Kasia",
                "character_id": "kasia", "difficulty": "intermediate"
            },
            {
                "code": "english", "name": "English", "native_name": "English",
                "flag": "🇬🇧", "scene": "London Pub", "character": "Victoria",
                "character_id": "victoria", "difficulty": "beginner-friendly"
            }
        ]
    }


@app.get("/api/difficulty")
async def get_difficulty_levels():
    """Get difficulty level configurations"""
    return {
        "levels": [
            {"level": 1, "name": "Beginner", "description": "Mostly English with key target words", "english_percent": 85, "target_percent": 15},
            {"level": 2, "name": "Elementary", "description": "More target language with English support", "english_percent": 65, "target_percent": 35},
            {"level": 3, "name": "Intermediate", "description": "Half and half, building confidence", "english_percent": 45, "target_percent": 55},
            {"level": 4, "name": "Advanced", "description": "Primarily target language", "english_percent": 20, "target_percent": 80},
            {"level": 5, "name": "Fluent", "description": "Natural conversation in target language", "english_percent": 5, "target_percent": 95}
        ]
    }


# ═══════════════════════════════════════════════════════════════════════════════
# PERSONALIZED PRACTICE
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/practice/{language}")
async def get_practice(language: str, user_id: str = "default_user", focus: str = None):
    """Get personalized practice based on weak areas"""
    return lesson_service.generate_personalized_practice(user_id, language, focus)


# ═══════════════════════════════════════════════════════════════════════════════
# ERROR HANDLERS
# ═══════════════════════════════════════════════════════════════════════════════

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Not found", "detail": str(exc.detail) if hasattr(exc, 'detail') else "Resource not found"}
    )


@app.exception_handler(500)
async def server_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )


# ═══════════════════════════════════════════════════════════════════════════════
# STARTUP
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    print("═" * 60)
    print("🌍 LINGUAVERSE API - Starting...")
    print("═" * 60)
    print("📚 Endpoints:")
    print("   Voice:        /api/speak, /api/transcribe")
    print("   Conversation: /api/conversation/*")
    print("   Lessons:      /api/lessons/{language}")
    print("   Progress:     /api/progress/{language}")
    print("   Glossary:     /api/glossary/{language}")
    print("   Docs:         /docs")
    print("═" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
