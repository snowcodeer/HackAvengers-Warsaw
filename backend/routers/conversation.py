from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.voice_service import voice_service
from services.npc_service import npc_service
import uuid

router = APIRouter(prefix="/api/conversation", tags=["conversation"])

class ConversationStartRequest(BaseModel):
    npc_id: str

class ConversationResponseRequest(BaseModel):
    npc_id: str
    text: str # For text-based testing, eventually will use audio

# Global Game State (MVP)
game_state = {
    "quest_step": 1,
    "difficulty": 1,
    "conversation_history": {}
}

# Simple in-memory cache for audio generation parameters
# Format: {uuid: (text, voice_id)}
audio_cache = {}

@router.get("/audio/{audio_id}")
async def stream_audio(audio_id: str):
    if audio_id not in audio_cache:
        raise HTTPException(status_code=404, detail="Audio not found or expired")
    
    text, voice_id = audio_cache.pop(audio_id)
    
    def iterfile():
        stream = voice_service.generate_audio_stream(text, voice_id)
        if stream:
            yield from stream
            
    return StreamingResponse(iterfile(), media_type="audio/mpeg")

@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    content = await audio.read()
    text = voice_service.speech_to_text(content)
    if not text:
        raise HTTPException(status_code=400, detail="Failed to transcribe audio (too short or corrupted)")
    return {"text": text}

@router.post("/start")
async def start_conversation(request: ConversationStartRequest):
    # Reset history for this NPC
    game_state["conversation_history"][request.npc_id] = []
    
    # Get initial greeting from NPC (Dynamic but goal-oriented)
    initial_prompt = "The player has just approached you. Greet them warmly and hint at the current objective immediately."
    greeting = npc_service.get_response(
        request.npc_id, 
        initial_prompt, 
        [], 
        game_state["quest_step"], 
        game_state["difficulty"]
    )
    
    # Store greeting
    game_state["conversation_history"][request.npc_id].append({"role": "assistant", "content": greeting})
    
    # Prepare Audio (Lazy Generation)
    voice_id = npc_service.get_voice_id(request.npc_id)
    audio_id = str(uuid.uuid4())
    audio_cache[audio_id] = (greeting, voice_id)
    audio_url = f"/api/conversation/audio/{audio_id}"
    
    return {
        "message": f"Conversation started with {request.npc_id}",
        "greeting": greeting,
        "audio_url": audio_url
    }

@router.post("/respond")
async def respond_to_conversation(
    npc_id: str = Form(...),
    audio: UploadFile = File(None),
    text: str = Form(None)
):
    if not audio and not text:
        raise HTTPException(status_code=400, detail="Either audio or text is required")
    
    player_text = text
    if audio:
        content = await audio.read()
        player_text = voice_service.speech_to_text(content)
        if not player_text:
             # Fallback or error? Let's return a helpful error
             raise HTTPException(status_code=400, detail="Could not understand audio. Please try again.")
    
    # Retrieve history
    history = game_state["conversation_history"].get(npc_id, [])
    
    # Get NPC response
    npc_response = npc_service.get_response(
        npc_id, 
        player_text, 
        history,
        game_state["quest_step"],
        game_state["difficulty"]
    )
    
    # Check for Quest Completion Tag
    quest_advanced = False
    
    # Clean bracketed expressions (e.g., [happy], [sad])
    import re
    clean_response = re.sub(r'\[.*?\]', '', npc_response).strip()
    
    # Check for [DONE] specifically in the original response if logic depends on it
    if "[DONE]" in npc_response:
        # Advance Quest State if valid transition
        if npc_id == "child" and game_state["quest_step"] == 1:
            game_state["quest_step"] = 2
            quest_advanced = True
        elif npc_id == "mati" and game_state["quest_step"] == 2:
            game_state["quest_step"] = 3
            quest_advanced = True
        elif npc_id == "jade" and game_state["quest_step"] == 3:
            game_state["quest_step"] = 4
            quest_advanced = True
        elif npc_id == "kitty" and game_state["quest_step"] == 4:
            game_state["quest_step"] = 5
            quest_advanced = True
        elif npc_id == "child" and game_state["quest_step"] == 5:
            # Quest Complete
            pass
            
    npc_response = clean_response
    
    # Update history
    history.append({"role": "user", "content": player_text})
    history.append({"role": "assistant", "content": npc_response})
    game_state["conversation_history"][npc_id] = history
        
    # Difficulty Scaling (Simple)
    # Increase difficulty every 2 turns (DEMO MODE: fast progression)
    if len(history) % 2 == 0 and game_state["difficulty"] < 5:
        game_state["difficulty"] += 1
    
    # Prepare Audio (Lazy Generation)
    voice_id = npc_service.get_voice_id(npc_id)
    audio_id = str(uuid.uuid4())
    audio_cache[audio_id] = (npc_response, voice_id)
    audio_url = f"/api/conversation/audio/{audio_id}"
    
    return {
        "transcription": player_text,
        "response": npc_response,
        "audio_url": audio_url,
        "quest_state": game_state["quest_step"],
        "difficulty": game_state["difficulty"],
        "quest_advanced": quest_advanced
    }

@router.post("/end")
async def end_conversation(npc_id: str):
    return {"message": f"Conversation ended with {npc_id}"}
