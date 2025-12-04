"""
═══════════════════════════════════════════════════════════════════════════════
LINGUAVERSE - Enhanced Conversation Router
Full multi-turn conversation with ElevenLabs integration
═══════════════════════════════════════════════════════════════════════════════
"""

import os
import io
import uuid
import tempfile
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from services.elevenlabs_service import elevenlabs_service
from services.lesson_service import lesson_service
from services.npc_service import npc_service

router = APIRouter(prefix="/api/conversation", tags=["Conversation"])

# In-memory conversation storage (use database in production)
active_conversations: Dict[str, Dict] = {}


class ConversationStart(BaseModel):
    """Request to start a conversation"""
    character_id: str
    language: str
    user_id: Optional[str] = "default_user"
    difficulty_level: int = 1


class TextMessage(BaseModel):
    """Text-only message (for testing/fallback)"""
    conversation_id: str
    text: str


class ConversationResponse(BaseModel):
    """Response from conversation"""
    conversation_id: str
    transcription: Optional[str] = None
    response: str
    audio_url: Optional[str] = None
    character_name: str
    expression: Optional[str] = None
    pronunciation_feedback: Optional[Dict] = None
    new_words: List[Dict] = []
    xp_earned: int = 0
    teaching_moment: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════
# CONVERSATION MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════

@router.post("/start")
async def start_conversation(request: ConversationStart) -> Dict:
    """
    Start a new conversation with a character.
    
    Returns the character's greeting with audio.
    """
    conversation_id = str(uuid.uuid4())
    
    # Get character info
    character_info = elevenlabs_service.get_character_info(request.character_id)
    if not character_info:
        raise HTTPException(status_code=404, detail="Character not found")
    
    # Get greeting based on character
    greetings = {
        "amelie": "Bonjour! Welcome to my little bakery! I'm Amélie. Comment allez-vous?",
        "yuki": "こんにちは。Welcome to my tea house. I am Yuki. Please, sit down.",
        "carmen": "¡Hola! Bienvenido to Casa del Flamenco! I'm Carmen. ¿Qué tal?",
        "wolfgang": "Guten Abend. Welcome to the bunker. I'm Wolfgang. The night is young.",
        "marco": "Buongiorno! Welcome to my café! I'm Marco. Un caffè?",
        "meilin": "欢迎！Welcome to my tea house. I am Mei Lin. Please, have some tea.",
        "kasia": "Cześć! Welcome to my restaurant! I'm Kasia. Hungry? We have fresh pierogi!"
    }
    
    greeting_text = greetings.get(request.character_id, "Hello! Welcome!")
    
    # Generate audio for greeting
    try:
        audio_bytes = elevenlabs_service.text_to_speech(
            greeting_text,
            request.character_id,
            expression="warmly"
        )
        
        # Save audio to temp file
        audio_filename = f"greeting_{conversation_id}.mp3"
        audio_path = os.path.join(tempfile.gettempdir(), audio_filename)
        with open(audio_path, "wb") as f:
            f.write(audio_bytes)
        
        audio_url = f"/api/conversation/audio/{audio_filename}"
    except Exception as e:
        print(f"Audio generation error: {e}")
        audio_url = None
    
    # Store conversation state
    active_conversations[conversation_id] = {
        "id": conversation_id,
        "character_id": request.character_id,
        "character_name": character_info["name"],
        "language": request.language,
        "user_id": request.user_id,
        "difficulty_level": request.difficulty_level,
        "messages": [
            {
                "role": "assistant",
                "content": greeting_text,
                "timestamp": datetime.now().isoformat()
            }
        ],
        "words_practiced": [],
        "started_at": datetime.now().isoformat()
    }
    
    # Update user streak
    lesson_service.update_streak(request.user_id, request.language)
    
    return {
        "conversation_id": conversation_id,
        "character_name": character_info["name"],
        "greeting": greeting_text,
        "audio_url": audio_url,
        "language": request.language,
        "difficulty_level": request.difficulty_level
    }


@router.post("/respond")
async def respond_to_conversation(
    audio: UploadFile = File(...),
    conversation_id: str = Form(None),
    npc_id: str = Form(None)
) -> ConversationResponse:
    """
    Process user's voice input and generate character response.
    
    1. Transcribe user's speech
    2. Generate character response (with teaching moments)
    3. Convert response to speech
    4. Return everything
    """
    # Get or create conversation
    if conversation_id and conversation_id in active_conversations:
        conversation = active_conversations[conversation_id]
    else:
        # Create new conversation on the fly
        conversation_id = str(uuid.uuid4())
        character_id = npc_id or "amelie"
        character_info = elevenlabs_service.get_character_info(character_id)
        
        conversation = {
            "id": conversation_id,
            "character_id": character_id,
            "character_name": character_info["name"] if character_info else "Assistant",
            "language": "french",
            "user_id": "default_user",
            "difficulty_level": 1,
            "messages": [],
            "words_practiced": [],
            "started_at": datetime.now().isoformat()
        }
        active_conversations[conversation_id] = conversation
    
    character_id = conversation.get("character_id", npc_id or "amelie")
    language = conversation.get("language", "french")
    difficulty = conversation.get("difficulty_level", 1)
    
    # Read audio file
    audio_content = await audio.read()
    
    # Transcribe user's speech
    transcription_result = elevenlabs_service.speech_to_text(
        audio_content,
        language_hint=language[:2] if language else None
    )
    
    user_text = transcription_result.get("text", "")
    if not user_text:
        user_text = "(unclear speech)"
    
    # Pronunciation assessment
    pronunciation_feedback = None
    if user_text and user_text != "(unclear speech)":
        # Simple feedback for now
        pronunciation_feedback = {
            "transcribed": user_text,
            "confidence": transcription_result.get("confidence", 1.0)
        }
    
    # Add user message to history
    conversation["messages"].append({
        "role": "user",
        "content": user_text,
        "timestamp": datetime.now().isoformat()
    })
    
    # Generate character response using NPC service
    conversation_history = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in conversation["messages"][-10:]  # Last 10 messages
    ]
    
    response_text = npc_service.get_response(
        npc_id=character_id,
        player_text=user_text,
        conversation_history=conversation_history[:-1],  # Exclude current message
        quest_state=1,
        difficulty_level=difficulty
    )
    
    # Determine expression based on response
    expression = "warmly"
    if "?" in response_text:
        expression = "curious"
    elif any(word in response_text.lower() for word in ["correct", "almost", "try"]):
        expression = "encouraging"
    elif any(word in response_text.lower() for word in ["excellent", "perfect", "great"]):
        expression = "excited"
    
    # Generate audio for response
    audio_url = None
    try:
        audio_bytes = elevenlabs_service.text_to_speech(
            response_text,
            character_id,
            expression=expression
        )
        
        audio_filename = f"response_{conversation_id}_{len(conversation['messages'])}.mp3"
        audio_path = os.path.join(tempfile.gettempdir(), audio_filename)
        with open(audio_path, "wb") as f:
            f.write(audio_bytes)
        
        audio_url = f"/api/conversation/audio/{audio_filename}"
    except Exception as e:
        print(f"Audio generation error: {e}")
    
    # Add assistant message to history
    conversation["messages"].append({
        "role": "assistant",
        "content": response_text,
        "expression": expression,
        "timestamp": datetime.now().isoformat()
    })
    
    # Check for teaching moments (new vocabulary)
    teaching_moment = None
    new_words = []
    
    # Extract any vocabulary being taught
    if difficulty <= 2:
        # At lower levels, highlight vocabulary
        for word_data in get_vocabulary_from_response(response_text, language):
            new_words.append(word_data)
            lesson_service._add_vocabulary_to_glossary(
                conversation["user_id"],
                language,
                [word_data]
            )
    
    # Calculate XP earned
    xp_earned = 5  # Base XP per turn
    if pronunciation_feedback and pronunciation_feedback.get("confidence", 0) > 0.8:
        xp_earned += 5  # Bonus for good pronunciation
    
    return ConversationResponse(
        conversation_id=conversation_id,
        transcription=user_text,
        response=response_text,
        audio_url=audio_url,
        character_name=conversation["character_name"],
        expression=expression,
        pronunciation_feedback=pronunciation_feedback,
        new_words=new_words,
        xp_earned=xp_earned,
        teaching_moment=teaching_moment
    )


@router.post("/text")
async def respond_text(message: TextMessage) -> ConversationResponse:
    """
    Handle text-only message (for testing or typing mode).
    """
    conversation = active_conversations.get(message.conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    character_id = conversation["character_id"]
    language = conversation["language"]
    difficulty = conversation["difficulty_level"]
    
    # Add user message
    conversation["messages"].append({
        "role": "user",
        "content": message.text,
        "timestamp": datetime.now().isoformat()
    })
    
    # Generate response
    conversation_history = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in conversation["messages"][-10:]
    ]
    
    response_text = npc_service.get_response(
        npc_id=character_id,
        player_text=message.text,
        conversation_history=conversation_history[:-1],
        quest_state=1,
        difficulty_level=difficulty
    )
    
    # Generate audio
    audio_url = None
    try:
        audio_bytes = elevenlabs_service.text_to_speech(
            response_text,
            character_id,
            expression="warmly"
        )
        
        audio_filename = f"response_{message.conversation_id}_{len(conversation['messages'])}.mp3"
        audio_path = os.path.join(tempfile.gettempdir(), audio_filename)
        with open(audio_path, "wb") as f:
            f.write(audio_bytes)
        
        audio_url = f"/api/conversation/audio/{audio_filename}"
    except Exception as e:
        print(f"Audio generation error: {e}")
    
    # Add assistant message
    conversation["messages"].append({
        "role": "assistant",
        "content": response_text,
        "timestamp": datetime.now().isoformat()
    })
    
    return ConversationResponse(
        conversation_id=message.conversation_id,
        transcription=message.text,
        response=response_text,
        audio_url=audio_url,
        character_name=conversation["character_name"],
        xp_earned=5
    )


@router.get("/audio/{filename}")
async def get_audio(filename: str):
    """Serve generated audio files."""
    audio_path = os.path.join(tempfile.gettempdir(), filename)
    
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio not found")
    
    return FileResponse(
        audio_path,
        media_type="audio/mpeg",
        filename=filename
    )


@router.get("/{conversation_id}")
async def get_conversation(conversation_id: str) -> Dict:
    """Get conversation history."""
    conversation = active_conversations.get(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return {
        "id": conversation_id,
        "character_name": conversation["character_name"],
        "language": conversation["language"],
        "messages": conversation["messages"],
        "started_at": conversation["started_at"]
    }


@router.post("/{conversation_id}/end")
async def end_conversation(conversation_id: str) -> Dict:
    """End a conversation and calculate final stats."""
    conversation = active_conversations.get(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Calculate stats
    total_turns = len([m for m in conversation["messages"] if m["role"] == "user"])
    total_xp = total_turns * 5
    
    # Update user progress
    lesson_service.update_streak(conversation["user_id"], conversation["language"])
    
    # Clean up
    ended_at = datetime.now().isoformat()
    conversation["ended_at"] = ended_at
    
    return {
        "conversation_id": conversation_id,
        "total_turns": total_turns,
        "xp_earned": total_xp,
        "words_practiced": len(conversation.get("words_practiced", [])),
        "ended_at": ended_at
    }


# ═══════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

def get_vocabulary_from_response(response: str, language: str) -> List[Dict]:
    """Extract vocabulary words being taught in a response."""
    # This would be enhanced with NLP in production
    # For now, return empty list
    return []


@router.get("/characters/list")
async def list_characters() -> List[Dict]:
    """List all available characters."""
    return elevenlabs_service.list_characters()
