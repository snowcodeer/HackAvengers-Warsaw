"""
═══════════════════════════════════════════════════════════════════════════════
LINGUAVERSE - Main Backend Application
Unified API for immersive language learning

Endpoints:
- /api/speak, /api/transcribe - Voice (ElevenLabs)
- /api/transcribe/realtime - Real-time WebSocket transcription
- /api/conversation/respond - Multi-turn AI conversations
- /api/scenario/generate - Dynamic scenario generation
═══════════════════════════════════════════════════════════════════════════════
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import routers
from routers import conversation, voice, scenario, progress

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

# Voice API - TTS, STT
app.include_router(voice.router)

# Conversation API - Multi-turn dialogue
app.include_router(conversation.router)

# Scenario API - Dynamic generation
app.include_router(scenario.router)

# Progress API - Save/Load user data
app.include_router(progress.router)


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
            "voice": "/api/speak, /api/transcribe",
            "realtime_transcription": "ws://host/api/transcribe/realtime",
            "conversation": "/api/conversation/respond",
            "scenario": "/api/scenario/generate",
            "docs": "/docs"
        },
        "features": [
            "ElevenLabs TTS with character voices",
            "ElevenLabs STT for speech recognition",
            "Real-time word-by-word transcription via WebSocket",
            "Multi-turn AI conversations (Claude)",
            "Dynamic scenario generation"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "linguaverse"}


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
    print("   Realtime STT: ws://localhost:8000/api/transcribe/realtime")
    print("   Conversation: /api/conversation/respond")
    print("   Scenario:     /api/scenario/generate")
    print("   Docs:         /docs")
    print("═" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
