import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

class NPCService:
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        
        # Base instructions for all NPCs
        self.base_instruction = (
            "You are a character in a language learning game called 'Mówka'. "
            "The player is learning Polish. "
            "Your goal is to help them practice by speaking in simple, clear Polish. "
            "If the player makes a mistake, gently correct them in your response. "
            "Keep your responses short (1-2 sentences). "
            "Stay in character at all times. "
            "VOICE INSTRUCTIONS: You can use tags to control your voice tone. Use [sadly], [excited], [whispers], [laughs], [sighs], [sarcastic], or [curious] at the start of sentences to change how you sound. "
            "Example: '[sadly] I lost my cat.' or '[excited] I found it!' "
            "IMPORTANT: If you are the correct NPC for the current quest step and you have successfully conveyed the necessary clue or information to the player (or if they have acknowledged it), append '[DONE]' to the end of your response. "
            "If you are NOT the correct NPC, politely direct the player to the correct person."
        )

        self.personas = {
            "child": (
                "You are a young child (age 6) in a Polish village. "
                "You are sad because you lost your cat, Kitty. "
                "You speak very simple Polish. "
                "You are currently in the Square."
            ),
            "mati": (
                "You are Mati, a friendly shopkeeper in the Market. "
                "You sell fruit and bread. "
                "You saw the cat run towards the Alley. "
                "You speak polite but casual Polish."
            ),
            "jade": (
                "You are Jade, a young woman standing in the Alley. "
                "You are helpful and kind. "
                "You saw the cat go into the Garden. "
                "You speak clear, standard Polish."
            ),
            "kitty": (
                "You are Kitty, the lost cat. You are actually a Babel Spirit. "
                "You mostly meow, but if the player speaks kindly, you might say a simple word like 'Tak' or 'Dom'. "
                "You are in the Garden."
            ),
            "bird": (
                "You are a magical helper bird. "
                "You speak both English and Polish. "
                "Your job is to help the player if they are stuck. "
                "You can translate things if asked."
            )
        }

        self.static_greetings = {
            "child": "Cześć! (Hello!) I am so sad... I lost my cat, Kitty. Can you help me find her?",
            "mati": "Dzień dobry! (Good morning!) Welcome to my shop. I have fresh bread and fruit.",
            "jade": "Cześć. (Hi.) It is very quiet in this alley... perfect for reading.",
            "kitty": "Meow...",
            "bird": "Tweet tweet! I can help you speak Polish. Just ask!"
        }

        self.voice_ids = {
            "child": "21m00Tcm4TlvDq8ikWAM", # Rachel
            "mati": "ErXwobaYiN019PkySvjV", # Antoni
            "jade": "EXAVITQu4vr4xnSDxMaL", # Bella
            "kitty": "TX3LPaxmHKxFdv7VOQHJ", # Liam
            "bird": "MF3mGyEYCl7XYWlgT9FX"  # Callum
        }

    def get_difficulty_instruction(self, level: int) -> str:
        levels = {
            1: "Speak mostly in English, but introduce key Polish words (e.g., 'kot', 'tak'). Translate them immediately.",
            2: "Speak in simple Polish sentences, but repeat important parts in English.",
            3: "Speak in Polish. Only use English if the player seems very confused.",
            4: "Speak only in Polish, but keep grammar simple and speak slowly.",
            5: "Speak naturally in Polish."
        }
        return levels.get(level, levels[1])

    def get_quest_instruction(self, npc_id: str, quest_state: int) -> str:
        # Quest States:
        # 1: Start (Talk to Child) -> Target: Child
        # 2: Find Mati (Market) -> Target: Mati
        # 3: Find Jade (Alley) -> Target: Jade
        # 4: Find Kitty (Garden) -> Target: Kitty
        # 5: Return to Child -> Target: Child
        
        instructions = ""
        
        if npc_id == "child":
            if quest_state == 1:
                instructions = "The player needs to find your cat. Ask them for help. Tell them to ask Mati in the Market. Once they agree or understand, append [DONE]."
            elif quest_state == 5:
                instructions = "The player has found your cat! Thank them profusely in Polish. Append [DONE]."
            elif quest_state == 2:
                instructions = "You are waiting. Tell the player: 'Zapytaj Mati w Rynku' (Ask Mati in the Market)."
            elif quest_state == 3:
                instructions = "You are waiting. Tell the player: 'Mati wie gdzie jest kot' (Mati knows where the cat is)."
            else:
                instructions = "You are waiting for the player to find your cat."
                
        elif npc_id == "mati":
            if quest_state == 2:
                instructions = "The player is looking for the cat. Tell them you saw it run towards the Alley. Suggest they ask Jade. Once they understand, append [DONE]."
            elif quest_state == 1:
                instructions = "The child in the square looks sad. Tell the player to go talk to the child first."
            elif quest_state == 3:
                instructions = "I saw the cat go to the Alley. Go ask Jade."
            else:
                instructions = "You are busy selling fruit. You haven't seen the cat recently."
                
        elif npc_id == "jade":
            if quest_state == 3:
                instructions = "The player is looking for the cat. Tell them you saw it go into the Garden. Warn them to be quiet. Once they understand, append [DONE]."
            elif quest_state < 3:
                instructions = "I haven't seen anything. Maybe ask Mati in the Market?"
            else:
                instructions = "You are enjoying the quiet alley."
                
        elif npc_id == "kitty":
            if quest_state == 4:
                instructions = "The player is trying to call you. If they say 'Kici kici' or your name, meow happily and follow them. Append [DONE]."
            else:
                instructions = "You are hiding."

        return instructions

    def get_voice_id(self, npc_id: str) -> str:
        return self.voice_ids.get(npc_id, "21m00Tcm4TlvDq8ikWAM")

    def get_initial_greeting(self, npc_id: str) -> str:
        return self.static_greetings.get(npc_id, "...")

    def get_response(self, npc_id: str, player_text: str, conversation_history: list, quest_state: int = 1, difficulty_level: int = 1):
        persona = self.personas.get(npc_id, "You are a helpful villager.")
        difficulty_instruction = self.get_difficulty_instruction(difficulty_level)
        quest_instruction = self.get_quest_instruction(npc_id, quest_state)
        
        system_prompt = (
            f"{self.base_instruction}\n\n"
            f"Character Profile:\n{persona}\n\n"
            f"Current Situation:\n{quest_instruction}\n\n"
            f"Language Level (Difficulty {difficulty_level}):\n{difficulty_instruction}"
        )
        
        # Construct messages for Claude
        messages = []
        for msg in conversation_history:
            messages.append({"role": msg["role"], "content": msg["content"]})
        
        # Add current user message
        messages.append({"role": "user", "content": player_text})

        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=150,
                system=system_prompt,
                messages=messages
            )
            return response.content[0].text
        except Exception as e:
            print(f"Error calling Anthropic API: {e}")
            return f"[{npc_id} nods silently (API Error)]"

npc_service = NPCService()
