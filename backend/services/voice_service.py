import os
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

load_dotenv()

class VoiceService:
    def __init__(self):
        self.client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

    def speech_to_text(self, audio_content):
        try:
            # audio_content is bytes
            transcription = self.client.speech_to_text.convert(
                file=audio_content,
                model_id="scribe_v1"
            )
            return transcription.text
        except Exception as e:
            print(f"Error transcribing audio: {e}")
            return None

    def generate_audio_stream(self, text: str, voice_id: str):
        # We pass the text directly to ElevenLabs, including [tags] for expression.
        try:
            audio_stream = self.client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id="eleven_v3" 
            )
            return audio_stream
        except Exception as e:
            print(f"Error generating audio: {e}")
            return None

voice_service = VoiceService()
