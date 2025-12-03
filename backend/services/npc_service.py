import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

class NPCService:
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.personas = {
            "child": "You are a young child in a Polish village. You lost your cat, Kitty. You speak simple Polish.",
            "mati": "You are Mati, a shopkeeper in the market. You are friendly but busy.",
            "jade": "You are Jade, a young woman in the alley. You are helpful.",
            "kitty": "You are a cat. You meow and sometimes say simple words if the player is a Bridger.",
            "bird": "You are a helpful bird. You speak both English and Polish to help the player."
        }

    def get_response(self, npc_id: str, player_text: str, conversation_history: list):
        system_prompt = self.personas.get(npc_id, "You are a helpful NPC.")
        
        # Placeholder for Claude API call
        # message = self.client.messages.create(...)
        
        return f"[{npc_id} response to: {player_text}]"

npc_service = NPCService()
