import os
from anthropic import Anthropic
from dotenv import load_dotenv
import json

load_dotenv()

class LessonService:
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    def generate_lesson(self, language: str, difficulty: str) -> dict:
        system_prompt = (
            "You are an expert language curriculum designer for a game called 'Mówka'. "
            "Create a short, immersive lesson plan for a player."
        )
        
        user_prompt = (
            f"Generate a lesson plan for learning {language} at {difficulty} level. "
            "Return ONLY a JSON object with the following structure: "
            "{"
            "  'title': 'Lesson Title',"
            "  'objective': 'Main goal',"
            "  'vocabulary': [{'word': 'foreign_word', 'translation': 'english_word', 'pronunciation': 'phonetic'}],"
            "  'cultural_note': 'Interesting fact'"
            "}"
        )

        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=1000,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}]
            )
            
            content = response.content[0].text
            # Extract JSON if there's extra text (though prompt says ONLY JSON)
            start = content.find('{')
            end = content.rfind('}') + 1
            if start != -1 and end != -1:
                json_str = content[start:end]
                return json.loads(json_str)
            return {"error": "Failed to parse JSON"}
            
        except Exception as e:
            print(f"Error generating lesson: {e}")
            return {
                "title": "Emergency Lesson",
                "objective": "Survival",
                "vocabulary": [{"word": "Pomocy", "translation": "Help", "pronunciation": "Po-mo-tsy"}],
                "cultural_note": "Something went wrong with the AI."
            }

lesson_service = LessonService()
