from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import anthropic
import json

router = APIRouter(prefix="/api/scenario", tags=["Scenario"])

class ScenarioRequest(BaseModel):
    prompt: str
    language: str

@router.post("/generate")
async def generate_scenario(request: ScenarioRequest):
    """
    Generate a 3D scene blueprint based on a user prompt.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Anthropic API key not configured")

    client = anthropic.Anthropic(api_key=api_key)

    system_prompt = f"""
    You are an expert 3D environment designer for a language learning game.
    Your task is to generate a JSON blueprint for a 3D scene based on the user's description.
    The scene should be appropriate for learning {request.language}.

    The output must be a valid JSON object with the following structure:
    {{
        "id": "custom_generated",
        "name": "Custom Scenario",
        "emoji": "✨",
        "country": "Custom",
        "flag": "🏳️",
        "description": "A custom generated scenario.",
        "vocab": ["word1", "word2", "word3", "word4"],
                "floor": {{ "type": "wood", "color": "#8B4513" }},
                "walls": {{ "type": "plaster", "color": "#F5F5F5" }},
                "props": [
                    {{ "type": "counter", "position": {{ "x": 0, "y": 0, "z": -3 }}, "color": "#8B4513", "name": "counter" }}
                ]
            }}
        }},
        "character": {{
            "name": "Guide",
            "emoji": "👤",
            "role": "Local Guide",
            "bio": "A friendly local guide.",
            "visuals": {{
                "skinColor": "#f5c09a",
                "hairColor": "#000000",
                "hairStyle": "short",
                "outfitColor": "#3498db",
                "accessoryColor": "#ffffff",
                "style": "casual"
            }},
            "voice": {{
                "voiceId": "ThT5KcBeYPX3keUQqHPh",
                "style": "warm",
                "accent": "neutral"
            }}
        }},
        "falseFriends": [],
        "lessonPlan": {{
            "unit1": {{
                "title": "First Steps",
                "objectives": ["Greetings"],
                "scenarios": [],
                "vocabulary": []
            }}
        }}
    }}
    
    Ensure the 'layout' section includes 'floor', 'walls', and a list of 'props' with 3D positions (x, y, z).
    Keep the scene simple but representative of the description.
    """

    try:
        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=2000,
            system=system_prompt,
            messages=[
                {"role": "user", "content": f"Generate a scene for: {request.prompt}"}
            ]
        )
        
        content = message.content[0].text
        # Extract JSON if needed
        json_start = content.find('{')
        json_end = content.rfind('}') + 1
        if json_start != -1 and json_end != -1:
            json_str = content[json_start:json_end]
            return json.loads(json_str)
        else:
            raise ValueError("No JSON found in response")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
