from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import anthropic
import json

router = APIRouter(prefix="/api/scenario", tags=["Scenario"])

class ScenarioRequest(BaseModel):
    prompt: str
    language: str
    vibe: str = "neutral"

@router.post("/generate")
async def generate_scenario(request: ScenarioRequest):
    """
    Generate a 3D scene blueprint based on a user prompt.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Anthropic API key not configured")

    client = anthropic.Anthropic(api_key=api_key)

    system_prompt = f"""You are an expert 3D environment designer and character stylist for a high-end language learning game.
    Your task is to generate a JSON blueprint for a 3D scene based on the user's description and desired "vibe".
    
    CONTEXT:
    - Language: {request.language}
    - Vibe: {request.vibe} (This is CRITICAL. The scene MUST feel like this.)
    - User Prompt: {request.prompt}

    OBJECTIVE:
    Create a highly immersive, detailed, and "cool" 3D scene. Avoid generic "box" props. 
    Use specific, evocative names and colors that match the vibe.
    
    JSON STRUCTURE:
    {{
        "id": "custom_generated",
        "name": "Custom Scenario",
        "emoji": "✨",
        "country": "Custom",
        "flag": "🏳️",
        "description": "A custom generated scenario.",
        "scene": {{
            "layout": {{
                "floor": {{ "type": "wood", "color": "#8B4513" }}, 
                "walls": {{ "type": "plaster", "color": "#F5F5F5" }},
                "props": [
                    {{ "type": "counter", "position": {{ "x": 0, "y": 0, "z": -3 }}, "color": "#8B4513", "name": "rustic_oak_counter", "rotation": 0 }}
                ]
            }},
            "lighting": {{
                "primary": {{ "color": "#FFFFFF", "intensity": 0.8 }},
                "secondary": {{ "color": "#FFF8DC", "intensity": 0.4 }},
                "accent": [
                    {{ "color": "#FFAA44", "intensity": 0.5, "position": {{ "x": 0, "y": 3, "z": -2 }} }}
                ]
            }},
            "atmosphere": {{
                "fog": {{ "color": "#FFFFFF", "near": 10, "far": 50 }},
                "background": "#87CEEB"
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
    
    CREATIVE GUIDELINES:

    1. PROPS & DECOR (Be specific!):
       - Don't just say "table". Say "neon_glass_table" (for cyberpunk) or "antique_oak_table" (for cozy).
       - Use 'type' keywords that map to our assets:
         * Furniture: 'counter', 'bar', 'table', 'chair', 'bench', 'shelf', 'cabinet', 'sofa', 'stool'
         * Decor: 'plant', 'flower_vase', 'poster', 'painting', 'mirror', 'clock', 'rug', 'curtains', 'bamboo', 'lantern'
         * Lighting: 'pendant_light', 'lamp', 'neon_sign', 'candle', 'street_light'
         * Food/Drink: 'croissant_display', 'bread_basket', 'coffee_machine', 'tea_set', 'wine_rack', 'beer_stein', 'fruit_bowl', 'sushi_plate', 'ramen_bowl'
         * Special: 'cash_register', 'chalkboard', 'piano', 'guitar', 'fountain', 'statue', 'arcade_machine', 'hologram'
         * Structures: 'window', 'door', 'pillar', 'archway', 'fireplace', 'torii_gate'

    2. VIBE MAPPING:
       - COZY: Warm lights (#FFA500), wood textures, plants, rugs, fireplaces, bakery items.
       - MODERN: Cool lights (#E0FFFF), glass/metal textures, sleek furniture, abstract art.
       - CYBERPUNK: Neon lights (#FF00FF, #00FFFF), dark walls, holograms, arcade machines, rain-slicked floors.
       - HISTORICAL: Sepia/Gold lights, antique furniture, paintings, candle light, stone/wood.
       - SPOOKY: Dim/Green lights (#32CD32), fog, cobwebs (use 'curtains'), old statues, flickering candles.
       - NATURE: Sunlight, flowers, bamboo, wooden structures, fountains.

    3. CHARACTER VISUALS:
       - 'hairStyle': 'short', 'long', 'bun', 'bald', 'spiky' (cyberpunk), 'wavy'.
       - 'style': 'casual', 'formal', 'traditional' (kimono/dirndl), 'futuristic' (cyberpunk), 'gothic' (spooky).
       - 'outfitColor': Match the vibe! (e.g., Neon Green for cyberpunk, Tweed Brown for historical).

    4. LAYOUT:
       - Place the main interaction point (counter/table) at (0, 0, -3).
       - Place decorative props around it to frame the scene.
       - Use 'rotation' (in radians) to orient props naturally.
    
    RESPOND WITH ONLY THE JSON OBJECT, NO EXTRA TEXT."""

    try:
        print(f"🎨 Generating scenario for: {request.prompt} (Vibe: {request.vibe})")
        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=2000,
            system=system_prompt,
            messages=[
                {"role": "user", "content": f"Generate a scene for: {request.prompt}"}
            ]
        )
        
        print("✅ Generation complete, parsing response...")
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
