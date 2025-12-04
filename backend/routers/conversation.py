"""
═══════════════════════════════════════════════════════════════════════════════
CONVERSATION ROUTER - AI-Powered Language Learning Conversations
Multi-turn dialogues with Claude + ElevenLabs integration
═══════════════════════════════════════════════════════════════════════════════
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
import os

from services.npc_service import npc_service
from services.elevenlabs_service import elevenlabs_service
from services.lesson_service import lesson_service

router = APIRouter(prefix="/api/conversation", tags=["Conversation"])


# ═══════════════════════════════════════════════════════════════════════════════
# REQUEST/RESPONSE MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class ConversationMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    translation: Optional[str] = None


class StartConversationRequest(BaseModel):
    """Start a new conversation session"""
    language: str
    language_name: Optional[str] = None
    character_id: str
    scenario_id: Optional[str] = None
    difficulty_level: int = 1
    user_id: Optional[str] = "default_user"


class RespondRequest(BaseModel):
    """Send a message in a conversation"""
    language: str
    language_name: Optional[str] = None
    user_input: str
    conversation_history: List[Dict[str, str]] = []
    character: Optional[Dict[str, Any]] = None
    scenario: Optional[Dict[str, Any]] = None
    difficulty: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None
    user_id: Optional[str] = "default_user"


class VoiceRespondRequest(BaseModel):
    """Voice-based conversation request"""
    language: str
    character_id: str
    session_id: Optional[str] = None
    difficulty_level: int = 1


# ═══════════════════════════════════════════════════════════════════════════════
# CONVERSATION STATE (In-Memory - Use Redis/DB in production)
# ═══════════════════════════════════════════════════════════════════════════════

# Active conversations by session ID
active_sessions: Dict[str, Dict[str, Any]] = {}

# Game state for quest tracking (shared with quest router)
game_state = {
    "quest_step": 1,
    "difficulty_level": 1,
    "conversation_count": 0
}


def get_or_create_session(session_id: Optional[str] = None) -> tuple[str, Dict]:
    """Get existing session or create new one."""
    if session_id and session_id in active_sessions:
        return session_id, active_sessions[session_id]
    
    new_id = session_id or str(uuid.uuid4())
    active_sessions[new_id] = {
        "history": [],
        "turn_count": 0,
        "vocabulary_learned": [],
        "corrections_given": [],
        "difficulty_level": 1
    }
    return new_id, active_sessions[new_id]


# ═══════════════════════════════════════════════════════════════════════════════
# CONVERSATION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/start")
async def start_conversation(request: StartConversationRequest):
    """
    Start a new conversation session with an NPC.
    
    Returns session ID, initial greeting, and greeting audio.
    """
    session_id, session = get_or_create_session()
    
    # Update session with request params
    session["language"] = request.language
    session["character_id"] = request.character_id
    session["difficulty_level"] = request.difficulty_level
    session["user_id"] = request.user_id
    
    # Get character greeting
    try:
        greeting_response = npc_service.get_npc_response(
            player_input="[CONVERSATION_START]",
            npc_name=request.character_id,
            conversation_history=[],
            quest_state={"step": 1, "scenario": request.scenario_id},
            difficulty=request.difficulty_level
        )
        
        greeting_text = greeting_response.get("response", f"Welcome! Let's practice {request.language_name or request.language} together!")
        
        # Add to history
        session["history"].append({
            "role": "assistant",
            "content": greeting_text
        })
        
        return {
            "session_id": session_id,
            "greeting": greeting_text,
            "translation": greeting_response.get("translation"),
            "character": request.character_id,
            "difficulty": request.difficulty_level
        }
        
    except Exception as e:
        return {
            "session_id": session_id,
            "greeting": f"Welcome! Let's practice {request.language_name or request.language} together!",
            "error": str(e)
        }


@router.post("/respond")
async def respond_to_message(request: RespondRequest):
    """
    Process user message and generate NPC response.
    
    This is the main conversation endpoint that:
    1. Takes user input (text)
    2. Generates NPC response via Claude
    3. Returns response with teaching elements
    """
    session_id, session = get_or_create_session(request.session_id)
    
    # Build conversation history
    history = request.conversation_history or session.get("history", [])
    
    # Determine character name
    character_name = "Amélie"
    if request.character:
        character_name = request.character.get("name", "Amélie")
    
    # Determine difficulty
    difficulty_level = 1
    if request.difficulty:
        difficulty_level = request.difficulty.get("level", 1)
    
    try:
        # Get NPC response from Claude
        npc_response = npc_service.get_npc_response(
            player_input=request.user_input,
            npc_name=character_name.lower(),
            conversation_history=history[-10:],  # Last 10 messages
            quest_state={
                "step": game_state.get("quest_step", 1),
                "scenario": request.scenario.get("id") if request.scenario else None
            },
            difficulty=difficulty_level
        )
        
        response_text = npc_response.get("response", "I understand. Please continue.")
        
        # Update session history
        session["history"].append({"role": "user", "content": request.user_input})
        session["history"].append({"role": "assistant", "content": response_text})
        session["turn_count"] += 1
        
        # Track vocabulary if mentioned
        if npc_response.get("vocabulary"):
            session["vocabulary_learned"].extend(npc_response["vocabulary"])
            # Update user glossary
            for word in npc_response["vocabulary"]:
                lesson_service.add_vocabulary_word(
                    request.user_id,
                    request.language,
                    word
                )
        
        # Update game state
        game_state["conversation_count"] += 1
        
        return {
            "session_id": session_id,
            "response": response_text,
            "text": response_text,  # Alias for compatibility
            "translation": npc_response.get("translation"),
            "correction": npc_response.get("correction"),
            "encouragement": npc_response.get("encouragement"),
            "new_vocabulary": npc_response.get("vocabulary", []),
            "newVocabulary": npc_response.get("vocabulary", []),  # Alias
            "turn_count": session["turn_count"],
            "difficulty_level": difficulty_level
        }
        
    except Exception as e:
        # Fallback response
        return {
            "session_id": session_id,
            "response": "That's great! Keep practicing.",
            "text": "That's great! Keep practicing.",
            "error": str(e)
        }


@router.post("/voice/respond")
async def voice_respond(
    audio: UploadFile = File(...),
    language: str = Form("french"),
    character_id: str = Form("amelie"),
    session_id: Optional[str] = Form(None),
    difficulty_level: int = Form(1)
):
    """
    Full voice conversation flow:
    1. Transcribe user audio
    2. Generate NPC response
    3. Return response audio
    
    This is the complete voice-to-voice endpoint.
    """
    session_id_out, session = get_or_create_session(session_id)
    
    try:
        # Step 1: Transcribe user audio
        audio_content = await audio.read()
        transcription_result = elevenlabs_service.speech_to_text(
            audio_content=audio_content,
            language_hint=language
        )
        
        user_text = transcription_result.get("text", "")
        if not user_text:
            raise HTTPException(status_code=400, detail="Could not transcribe audio")
        
        # Step 2: Get NPC response
        npc_response = npc_service.get_npc_response(
            player_input=user_text,
            npc_name=character_id,
            conversation_history=session.get("history", [])[-10:],
            quest_state={"step": game_state.get("quest_step", 1)},
            difficulty=difficulty_level
        )
        
        response_text = npc_response.get("response", "Please continue.")
        
        # Update session
        session["history"].append({"role": "user", "content": user_text})
        session["history"].append({"role": "assistant", "content": response_text})
        session["turn_count"] += 1
        
        # Step 3: Generate response audio
        audio_bytes = elevenlabs_service.text_to_speech(
            text=response_text,
            character_id=character_id,
            expression=npc_response.get("expression", "warm")
        )
        
        # Return as streaming response with metadata in headers
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "X-Session-Id": session_id_out,
                "X-Transcription": user_text[:100],  # First 100 chars
                "X-Response-Text": response_text[:100],
                "X-Turn-Count": str(session["turn_count"])
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice conversation error: {str(e)}")


@router.post("/voice/respond/full")
async def voice_respond_full(
    audio: UploadFile = File(...),
    language: str = Form("french"),
    character_id: str = Form("amelie"),
    session_id: Optional[str] = Form(None),
    difficulty_level: int = Form(1)
):
    """
    Full voice conversation with JSON response containing both text and audio URL.
    """
    session_id_out, session = get_or_create_session(session_id)
    
    try:
        # Step 1: Transcribe
        audio_content = await audio.read()
        transcription_result = elevenlabs_service.speech_to_text(
            audio_content=audio_content,
            language_hint=language
        )
        
        user_text = transcription_result.get("text", "")
        if not user_text:
            return {
                "error": "Could not transcribe audio",
                "session_id": session_id_out
            }
        
        # Step 2: Get response
        npc_response = npc_service.get_npc_response(
            player_input=user_text,
            npc_name=character_id,
            conversation_history=session.get("history", [])[-10:],
            quest_state={"step": game_state.get("quest_step", 1)},
            difficulty=difficulty_level
        )
        
        response_text = npc_response.get("response", "Please continue.")
        
        # Update session
        session["history"].append({"role": "user", "content": user_text})
        session["history"].append({"role": "assistant", "content": response_text})
        session["turn_count"] += 1
        
        # Step 3: Generate audio and save to temp
        audio_bytes = elevenlabs_service.text_to_speech(
            text=response_text,
            character_id=character_id,
            expression=npc_response.get("expression", "warm")
        )
        
        # Save to temp file
        import tempfile
        audio_filename = f"response_{session_id_out}_{session['turn_count']}.mp3"
        audio_path = os.path.join(tempfile.gettempdir(), audio_filename)
        with open(audio_path, "wb") as f:
            f.write(audio_bytes)
        
        return {
            "session_id": session_id_out,
            "transcription": user_text,
            "response": response_text,
            "translation": npc_response.get("translation"),
            "correction": npc_response.get("correction"),
            "new_vocabulary": npc_response.get("vocabulary", []),
            "audio_url": f"/api/conversation/audio/{audio_filename}",
            "turn_count": session["turn_count"]
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "session_id": session_id_out
        }


# ═══════════════════════════════════════════════════════════════════════════════
# SESSION MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get current session state."""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    return {
        "session_id": session_id,
        "turn_count": session.get("turn_count", 0),
        "vocabulary_learned": session.get("vocabulary_learned", []),
        "history_length": len(session.get("history", [])),
        "difficulty_level": session.get("difficulty_level", 1)
    }


@router.delete("/session/{session_id}")
async def end_session(session_id: str):
    """End a conversation session."""
    if session_id in active_sessions:
        session = active_sessions.pop(session_id)
        return {
            "message": "Session ended",
            "final_turn_count": session.get("turn_count", 0),
            "vocabulary_learned": len(session.get("vocabulary_learned", []))
        }
    return {"message": "Session not found"}


@router.get("/sessions")
async def list_sessions():
    """List all active sessions (admin endpoint)."""
    return {
        "count": len(active_sessions),
        "sessions": [
            {
                "id": sid,
                "turns": s.get("turn_count", 0),
                "language": s.get("language", "unknown")
            }
            for sid, s in active_sessions.items()
        ]
    }


# ═══════════════════════════════════════════════════════════════════════════════
# AUDIO SERVING
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/audio/{filename}")
async def serve_audio(filename: str):
    """Serve generated audio files."""
    import tempfile
    
    filepath = os.path.join(tempfile.gettempdir(), filename)
    
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    with open(filepath, "rb") as f:
        audio_bytes = f.read()
    
    return Response(
        content=audio_bytes,
        media_type="audio/mpeg"
    )


# ═══════════════════════════════════════════════════════════════════════════════
# HINTS & HELP
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/hint/{session_id}")
async def get_hint(session_id: str, language: str = "french"):
    """Get a hint for the current conversation."""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    
    # Generate contextual hint based on conversation state
    hints = {
        "french": [
            {"phrase": "Bonjour", "translation": "Hello", "tip": "A warm greeting to start"},
            {"phrase": "S'il vous plaît", "translation": "Please", "tip": "Always polite!"},
            {"phrase": "Merci beaucoup", "translation": "Thank you very much", "tip": "Show appreciation"},
        ],
        "spanish": [
            {"phrase": "Hola", "translation": "Hello", "tip": "Friendly greeting"},
            {"phrase": "Por favor", "translation": "Please", "tip": "Be polite"},
            {"phrase": "Gracias", "translation": "Thank you", "tip": "Express gratitude"},
        ],
        "german": [
            {"phrase": "Guten Tag", "translation": "Good day", "tip": "Formal greeting"},
            {"phrase": "Bitte", "translation": "Please", "tip": "Politeness matters"},
            {"phrase": "Danke", "translation": "Thank you", "tip": "Show thanks"},
        ]
    }
    
    available_hints = hints.get(language, hints["french"])
    hint_index = session.get("turn_count", 0) % len(available_hints)
    
    return {
        "hint": available_hints[hint_index],
        "turn": session.get("turn_count", 0)
    }
