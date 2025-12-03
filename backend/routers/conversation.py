from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from services.voice_service import voice_service
from services.npc_service import npc_service

router = APIRouter(prefix="/api/conversation", tags=["conversation"])

class ConversationStartRequest(BaseModel):
    npc_id: str

class ConversationResponseRequest(BaseModel):
    npc_id: str
    text: str # For text-based testing, eventually will use audio

@router.post("/start")
async def start_conversation(request: ConversationStartRequest):
    # Logic to start conversation
    return {"message": f"Conversation started with {request.npc_id}"}

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
        # player_text = voice_service.speech_to_text(audio)
        player_text = "Audio transcription placeholder"
    
    npc_response = npc_service.get_response(npc_id, player_text, [])
    
    # audio_stream = voice_service.text_to_speech(npc_response, "voice_id_placeholder")
    
    return {
        "transcription": player_text,
        "response": npc_response,
        "audio_url": "placeholder_url"
    }

@router.post("/end")
async def end_conversation(npc_id: str):
    return {"message": f"Conversation ended with {npc_id}"}
