"""
═══════════════════════════════════════════════════════════════════════════════
VOICE ROUTER - Unified Voice API Endpoints
Handles TTS, STT, Real-time Transcription, and Pronunciation Assessment
═══════════════════════════════════════════════════════════════════════════════
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from typing import Optional, List
import io
import json
import asyncio
import base64

from services.elevenlabs_service import elevenlabs_service, RealtimeTranscriptionSession

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


# ═══════════════════════════════════════════════════════════════════════════════
# REAL-TIME TRANSCRIPTION (WebSocket)
# ═══════════════════════════════════════════════════════════════════════════════

@router.websocket("/transcribe/realtime")
async def realtime_transcription(websocket: WebSocket):
    """
    WebSocket endpoint for real-time speech-to-text transcription.
    
    Protocol:
    1. Client connects and optionally sends config: {"type": "config", "language": "fr", "sample_rate": 16000}
    2. Client sends audio chunks: {"type": "audio", "data": "<base64_encoded_pcm_audio>"}
    3. Server responds with transcription updates:
       - Partial: {"type": "partial", "text": "hello wor", "words": [...]}
       - Final: {"type": "final", "text": "hello world", "words": [...], "is_final": true}
    4. Client sends end of stream: {"type": "eos"}
    5. Connection closes gracefully
    
    Audio Format:
    - PCM 16-bit signed little-endian (pcm_s16le)
    - Default sample rate: 16000 Hz
    - Mono channel
    """
    await websocket.accept()
    
    session = None
    receive_task = None
    
    try:
        # Default config
        language = None
        sample_rate = 16000
        
        # Create transcription session
        session = await elevenlabs_service.create_realtime_transcription_session(
            language_hint=language,
            sample_rate=sample_rate
        )
        
        connected = await session.connect()
        if not connected:
            await websocket.send_json({
                "type": "error",
                "message": "Failed to connect to transcription service"
            })
            await websocket.close()
            return
        
        # Notify client of successful connection
        await websocket.send_json({
            "type": "connected",
            "message": "Real-time transcription ready"
        })
        
        # Task to receive transcripts from ElevenLabs and forward to client
        async def forward_transcripts():
            try:
                while session.is_connected:
                    transcript = await session.receive_transcript()
                    if transcript is None:
                        break
                    
                    # Parse and forward transcript
                    msg_type = transcript.get("type", "unknown")
                    
                    if msg_type == "transcript":
                        # Word-level transcription update
                        await websocket.send_json({
                            "type": "partial" if not transcript.get("is_final") else "final",
                            "text": transcript.get("text", ""),
                            "words": transcript.get("words", []),
                            "language": transcript.get("language"),
                            "is_final": transcript.get("is_final", False)
                        })
                    elif msg_type == "utterance_end":
                        # End of an utterance
                        await websocket.send_json({
                            "type": "utterance_end"
                        })
                    elif msg_type == "error":
                        await websocket.send_json({
                            "type": "error",
                            "message": transcript.get("message", "Unknown error")
                        })
                        break
            except Exception as e:
                print(f"Forward transcripts error: {e}")
        
        # Start forwarding task
        receive_task = asyncio.create_task(forward_transcripts())
        
        # Main loop: receive audio from client and send to ElevenLabs
        while True:
            try:
                message = await websocket.receive_text()
                data = json.loads(message)
                msg_type = data.get("type", "")
                
                if msg_type == "config":
                    # Reconfigure (only at start, before audio)
                    new_language = data.get("language")
                    new_sample_rate = data.get("sample_rate", 16000)
                    
                    # If config changed, reconnect
                    if new_language != language or new_sample_rate != sample_rate:
                        language = new_language
                        sample_rate = new_sample_rate
                        
                        # Close old session and create new one
                        await session.close()
                        if receive_task:
                            receive_task.cancel()
                        
                        session = await elevenlabs_service.create_realtime_transcription_session(
                            language_hint=language,
                            sample_rate=sample_rate
                        )
                        await session.connect()
                        receive_task = asyncio.create_task(forward_transcripts())
                        
                        await websocket.send_json({
                            "type": "config_updated",
                            "language": language,
                            "sample_rate": sample_rate
                        })
                
                elif msg_type == "audio":
                    # Decode and forward audio
                    audio_data = data.get("data", "")
                    if audio_data:
                        audio_bytes = base64.b64decode(audio_data)
                        await session.send_audio(audio_bytes)
                
                elif msg_type == "eos":
                    # End of stream
                    await session.end_stream()
                    await websocket.send_json({
                        "type": "eos_received"
                    })
                    # Wait briefly for final transcripts
                    await asyncio.sleep(0.5)
                    break
                    
            except WebSocketDisconnect:
                break
            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid JSON format"
                })
            except Exception as e:
                await websocket.send_json({
                    "type": "error", 
                    "message": str(e)
                })
                break
    
    except WebSocketDisconnect:
        print("Client disconnected from realtime transcription")
    except Exception as e:
        print(f"Realtime transcription error: {e}")
        try:
            await websocket.send_json({
                "type": "error",
                "message": str(e)
            })
        except:
            pass
    finally:
        # Cleanup
        if receive_task:
            receive_task.cancel()
            try:
                await receive_task
            except asyncio.CancelledError:
                pass
        if session:
            await session.close()
        try:
            await websocket.close()
        except:
            pass


# Active connections for broadcast (optional feature)
class ConnectionManager:
    """Manages active WebSocket connections for transcription."""
    
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}
    
    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[session_id] = websocket
    
    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
    
    async def send_transcript(self, session_id: str, data: dict):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_json(data)


transcription_manager = ConnectionManager()

