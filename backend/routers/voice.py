"""
═══════════════════════════════════════════════════════════════════════════════
VOICE ROUTER - Unified Voice API Endpoints
Handles TTS, STT, and Pronunciation Assessment
═══════════════════════════════════════════════════════════════════════════════
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from typing import Optional, List
import io

from services.elevenlabs_service import elevenlabs_service

router = APIRouter(prefix="/api", tags=["Voice"])


# ═══════════════════════════════════════════════════════════════════════════════
# REQUEST MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class SpeakRequest(BaseModel):
    """Request model for text-to-speech"""
    text: str
    language: Optional[str] = "french"
    voice_id: Optional[str] = None
    character_id: Optional[str] = "amelie"
    expression: Optional[str] = None
    model: Optional[str] = "eleven_v3"
    stability: Optional[float] = 0.65
    similarity_boost: Optional[float] = 0.8


class PronunciationRequest(BaseModel):
    """Request model for pronunciation assessment"""
    target_text: str
    language: str


# ═══════════════════════════════════════════════════════════════════════════════
# TEXT-TO-SPEECH ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/speak")
async def text_to_speech(request: SpeakRequest):
    """
    Convert text to speech using ElevenLabs.
    
    Returns audio as MP3 bytes for direct playback.
    """
    try:
        audio_bytes = elevenlabs_service.text_to_speech(
            text=request.text,
            character_id=request.character_id,
            expression=request.expression
        )
        
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=speech.mp3"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS Error: {str(e)}")


@router.post("/speak/stream")
async def text_to_speech_stream(request: SpeakRequest):
    """
    Stream text to speech for real-time playback.
    
    Returns chunked audio stream for low-latency playback.
    """
    try:
        def generate():
            for chunk in elevenlabs_service.text_to_speech_stream(
                text=request.text,
                character_id=request.character_id,
                expression=request.expression
            ):
                yield chunk
        
        return StreamingResponse(
            generate(),
            media_type="audio/mpeg",
            headers={
                "Cache-Control": "no-cache",
                "Transfer-Encoding": "chunked"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS Stream Error: {str(e)}")


# ═══════════════════════════════════════════════════════════════════════════════
# SPEECH-TO-TEXT ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/transcribe")
async def speech_to_text(
    audio: UploadFile = File(...),
    language: Optional[str] = Form(None)
):
    """
    Transcribe audio to text using ElevenLabs Scribe.
    
    Accepts audio file upload and returns transcription.
    """
    try:
        # Read audio content
        audio_content = await audio.read()
        
        # Transcribe
        result = elevenlabs_service.speech_to_text(
            audio_content=audio_content,
            language_hint=language
        )
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return {
            "text": result.get("text", ""),
            "transcription": result.get("text", ""),  # Alias for compatibility
            "language": result.get("language_detected"),
            "confidence": result.get("confidence", 1.0)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"STT Error: {str(e)}")


# ═══════════════════════════════════════════════════════════════════════════════
# PRONUNCIATION ASSESSMENT
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/pronunciation/assess")
async def assess_pronunciation(
    audio: UploadFile = File(...),
    target_text: str = Form(...),
    language: str = Form("french")
):
    """
    Assess user's pronunciation against target text.
    
    Returns detailed feedback with accuracy score and suggestions.
    """
    try:
        audio_content = await audio.read()
        
        feedback = elevenlabs_service.assess_pronunciation(
            audio_content=audio_content,
            target_text=target_text,
            language=language
        )
        
        return {
            "word": feedback.word,
            "target": feedback.target_pronunciation,
            "heard": feedback.user_pronunciation,
            "accuracy": feedback.accuracy_score,
            "issues": feedback.issues,
            "suggestions": feedback.suggestions,
            "passed": feedback.accuracy_score >= 70
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pronunciation Error: {str(e)}")


# ═══════════════════════════════════════════════════════════════════════════════
# SOUND EFFECTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/sound-effect")
async def generate_sound_effect(
    description: str,
    duration: float = 2.0
):
    """
    Generate a sound effect from description.
    """
    try:
        audio_bytes = elevenlabs_service.generate_sound_effect(
            description=description,
            duration_seconds=duration
        )
        
        if not audio_bytes:
            raise HTTPException(status_code=500, detail="Failed to generate sound effect")
        
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sound Effect Error: {str(e)}")


@router.get("/ambient/{scene_type}")
async def get_ambient_config(scene_type: str):
    """
    Get ambient sound configuration for a scene type.
    """
    config = elevenlabs_service.get_ambient_sounds(scene_type)
    return {
        "scene": scene_type,
        "sounds": config
    }


# ═══════════════════════════════════════════════════════════════════════════════
# VOICE MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/voices")
async def list_voices():
    """List all available ElevenLabs voices."""
    try:
        voices = elevenlabs_service.list_available_voices()
        return {"voices": voices}
    except Exception as e:
        return {"voices": [], "error": str(e)}


@router.get("/characters")
async def list_characters():
    """List all language learning characters with voice configs."""
    return {"characters": elevenlabs_service.list_characters()}


@router.get("/characters/{character_id}")
async def get_character(character_id: str):
    """Get detailed info about a specific character."""
    info = elevenlabs_service.get_character_info(character_id)
    if not info:
        raise HTTPException(status_code=404, detail="Character not found")
    return info

