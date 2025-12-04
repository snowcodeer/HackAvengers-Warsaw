"""
═══════════════════════════════════════════════════════════════════════════════
LINGUAVERSE - Main Backend Application
Full-featured language learning API with ElevenLabs integration
═══════════════════════════════════════════════════════════════════════════════
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os

# Import routers
from routers import conversation, quest
from services.lesson_service import lesson_service
from services.elevenlabs_service import elevenlabs_service

# Create FastAPI app
app = FastAPI(
    title="LinguaVerse API",
    description="Immersive language learning with AI-powered conversations",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(conversation.router)
app.include_router(quest.router)


# ═══════════════════════════════════════════════════════════════════════════
# ROOT & HEALTH ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/")
async def root():
    """API root - health check and info"""
    return {
        "name": "LinguaVerse API",
        "version": "2.0.0",
        "status": "running",
        "features": [
            "Multi-turn AI conversations",
            "ElevenLabs TTS/STT integration",
            "Pronunciation feedback",
            "Structured lesson plans",
            "Progress tracking",
            "Glossary management"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# ═══════════════════════════════════════════════════════════════════════════
# LESSON ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/lessons/{language}")
async def get_lesson_plan(language: str):
    """Get the full lesson plan for a language"""
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
    """Get the next available lesson for a user"""
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
    """Mark a lesson as completed"""
    result = lesson_service.complete_lesson(user_id, lesson_id, score, time_spent)
    return result


# ═══════════════════════════════════════════════════════════════════════════
# PROGRESS ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/progress/{language}")
async def get_progress(language: str, user_id: str = "default_user"):
    """Get user's progress for a language"""
    progress = lesson_service.get_user_progress(user_id, language)
    return progress


@app.get("/api/progress")
async def get_all_progress(user_id: str = "default_user"):
    """Get user's progress for all languages"""
    languages = ["french", "german", "spanish", "italian", "japanese", "mandarin", "polish"]
    progress = {}
    for lang in languages:
        progress[lang] = lesson_service.get_user_progress(user_id, lang)
    return progress


# ═══════════════════════════════════════════════════════════════════════════
# GLOSSARY ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/glossary/{language}")
async def get_glossary(language: str, user_id: str = "default_user"):
    """Get user's vocabulary glossary for a language"""
    glossary = lesson_service.get_user_glossary(user_id, language)
    return glossary


@app.post("/api/glossary/{language}/word/{word}/practice")
async def practice_word(language: str, word: str, correct: bool, user_id: str = "default_user"):
    """Update word mastery after practice"""
    result = lesson_service.update_word_mastery(user_id, language, word, correct)
    return result


# ═══════════════════════════════════════════════════════════════════════════
# PERSONALIZED PRACTICE
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/practice/{language}")
async def get_practice(language: str, user_id: str = "default_user", focus: str = None):
    """Get personalized practice based on weak areas"""
    practice = lesson_service.generate_personalized_practice(user_id, language, focus)
    return practice


# ═══════════════════════════════════════════════════════════════════════════
# CHARACTER ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/characters")
async def list_characters():
    """List all available language learning characters"""
    return elevenlabs_service.list_characters()


@app.get("/api/characters/{character_id}")
async def get_character(character_id: str):
    """Get details about a specific character"""
    character = elevenlabs_service.get_character_info(character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character


# ═══════════════════════════════════════════════════════════════════════════
# VOICE ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/voices")
async def list_voices():
    """List all available ElevenLabs voices"""
    try:
        voices = elevenlabs_service.list_available_voices()
        return {"voices": voices}
    except Exception as e:
        return {"error": str(e)}


@app.post("/api/tts")
async def text_to_speech(
    text: str,
    character_id: str = "amelie",
    expression: str = None
):
    """Generate speech from text (for testing)"""
    try:
        audio_bytes = elevenlabs_service.text_to_speech(text, character_id, expression)
        
        # Save to temp file and return URL
        import tempfile
        import uuid
        filename = f"tts_{uuid.uuid4()}.mp3"
        filepath = os.path.join(tempfile.gettempdir(), filename)
        with open(filepath, "wb") as f:
            f.write(audio_bytes)
        
        return {"audio_url": f"/api/conversation/audio/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════════════════════
# LANGUAGE INFO ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/languages")
async def get_languages():
    """Get list of available languages with metadata"""
    return {
        "languages": [
            {
                "code": "french",
                "name": "French",
                "native_name": "Français",
                "flag": "🇫🇷",
                "scene": "Paris Boulangerie",
                "character": "Amélie",
                "difficulty": "beginner-friendly"
            },
            {
                "code": "german",
                "name": "German",
                "native_name": "Deutsch",
                "flag": "🇩🇪",
                "scene": "Berlin Techno Club",
                "character": "Wolfgang",
                "difficulty": "intermediate"
            },
            {
                "code": "spanish",
                "name": "Spanish",
                "native_name": "Español",
                "flag": "🇪🇸",
                "scene": "Madrid Tapas Bar",
                "character": "Carmen",
                "difficulty": "beginner-friendly"
            },
            {
                "code": "italian",
                "name": "Italian",
                "native_name": "Italiano",
                "flag": "🇮🇹",
                "scene": "Rome Café",
                "character": "Marco",
                "difficulty": "beginner-friendly"
            },
            {
                "code": "japanese",
                "name": "Japanese",
                "native_name": "日本語",
                "flag": "🇯🇵",
                "scene": "Kyoto Tea House",
                "character": "Yuki",
                "difficulty": "challenging"
            },
            {
                "code": "mandarin",
                "name": "Mandarin Chinese",
                "native_name": "中文",
                "flag": "🇨🇳",
                "scene": "Beijing Tea House",
                "character": "Mei Lin",
                "difficulty": "challenging"
            },
            {
                "code": "polish",
                "name": "Polish",
                "native_name": "Polski",
                "flag": "🇵🇱",
                "scene": "Warsaw Milk Bar",
                "character": "Kasia",
                "difficulty": "intermediate"
            }
        ]
    }


# ═══════════════════════════════════════════════════════════════════════════
# DIFFICULTY SETTINGS
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/difficulty")
async def get_difficulty_levels():
    """Get information about difficulty levels"""
    return {
        "levels": [
            {
                "level": 1,
                "name": "Beginner",
                "description": "Mostly English with key target language words",
                "english_percent": 85,
                "target_percent": 15
            },
            {
                "level": 2,
                "name": "Elementary",
                "description": "More target language with English support",
                "english_percent": 65,
                "target_percent": 35
            },
            {
                "level": 3,
                "name": "Intermediate",
                "description": "Half and half, building confidence",
                "english_percent": 45,
                "target_percent": 55
            },
            {
                "level": 4,
                "name": "Advanced",
                "description": "Primarily target language",
                "english_percent": 20,
                "target_percent": 80
            },
            {
                "level": 5,
                "name": "Fluent",
                "description": "Natural conversation in target language",
                "english_percent": 5,
                "target_percent": 95
            }
        ]
    }


# ═══════════════════════════════════════════════════════════════════════════
# ERROR HANDLERS
# ═══════════════════════════════════════════════════════════════════════════

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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
