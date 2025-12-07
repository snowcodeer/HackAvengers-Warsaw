"""
═══════════════════════════════════════════════════════════════════════════════
CONVERSATION ROUTER - AI-Powered Language Learning Conversations
Multi-turn dialogues with Claude
═══════════════════════════════════════════════════════════════════════════════
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid

from services.npc_service import npc_service
from services.lesson_service import lesson_service

router = APIRouter(prefix="/api/conversation", tags=["Conversation"])


# ═══════════════════════════════════════════════════════════════════════════════
# REQUEST/RESPONSE MODELS
# ═══════════════════════════════════════════════════════════════════════════════

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


# ═══════════════════════════════════════════════════════════════════════════════
# CONVERSATION STATE (In-Memory - Use Redis/DB in production)
# ═══════════════════════════════════════════════════════════════════════════════

# Active conversations by session ID
active_sessions: Dict[str, Dict[str, Any]] = {}

# Game state for conversation tracking
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
# CONVERSATION ENDPOINT
# ═══════════════════════════════════════════════════════════════════════════════

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
