"""
═══════════════════════════════════════════════════════════════════════════════
LINGUAVERSE - Comprehensive ElevenLabs Integration
Full SDK usage: TTS, STT, Voice Cloning, Pronunciation, Sound Effects, Music
═══════════════════════════════════════════════════════════════════════════════
"""

import os
import io
import json
import asyncio
import base64
from typing import Optional, List, Dict, Any, Generator, Callable, Awaitable
from dataclasses import dataclass
from enum import Enum
import websockets
from elevenlabs.client import ElevenLabs
from elevenlabs import Voice, VoiceSettings, play, stream, save
from dotenv import load_dotenv

load_dotenv()


class VoiceStyle(Enum):
    """Voice expression styles for different moods"""
    WARM = "warm"
    EXCITED = "excited"
    PATIENT = "patient"
    ENCOURAGING = "encouraging"
    CORRECTING = "correcting"
    PHILOSOPHICAL = "philosophical"
    PASSIONATE = "passionate"


@dataclass
class PronunciationFeedback:
    """Feedback on user's pronunciation"""
    word: str
    target_pronunciation: str
    user_pronunciation: str
    accuracy_score: float  # 0-100
    issues: List[str]
    suggestions: List[str]


@dataclass
class VoiceCharacter:
    """Character voice configuration"""
    voice_id: str
    name: str
    language: str
    accent: str
    style: str
    speed: float
    pitch: float
    stability: float
    similarity_boost: float
    style_intensity: float


class ElevenLabsService:
    """
    Comprehensive ElevenLabs service for immersive language learning.
    
    Features:
    - Text-to-Speech with multiple voices and styles
    - Speech-to-Text for player input
    - Pronunciation assessment
    - Voice cloning for celebrity/custom voices
    - Sound effects generation
    - Background music integration
    """
    
    def __init__(self):
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY environment variable not set")
        
        self.client = ElevenLabs(api_key=self.api_key)
        
        # Voice configurations for different characters and languages
        self.voice_characters = self._initialize_voice_characters()
        
        # Expression tags for natural speech
        self.expression_tags = {
            "warmly": "[warmly]",
            "excited": "[excitedly]",
            "patient": "[patiently]",
            "encouraging": "[encouragingly]",
            "correcting": "[gently correcting]",
            "philosophical": "[thoughtfully]",
            "passionate": "[passionately]",
            "whisper": "[whispering]",
            "laughing": "[laughing]",
            "sad": "[sadly]",
            "curious": "[curiously]",
            "sarcastic": "[sarcastically]"
        }
        
        # Sound effect IDs (from ElevenLabs sound library)
        self.sound_effects = {
            "door_bell": "cafe_door_bell",
            "coffee_machine": "espresso_hiss",
            "ambient_cafe": "cafe_chatter",
            "success": "achievement_chime",
            "error": "gentle_error",
            "typing": "keyboard_soft"
        }

    def _initialize_voice_characters(self) -> Dict[str, VoiceCharacter]:
        """Initialize voice configurations for all characters"""
        return {
            # French - Amélie (Paris Boulangerie)
            "amelie": VoiceCharacter(
                voice_id="ThT5KcBeYPX3keUQqHPh",  # Charlotte - French accent
                name="Amélie Dubois",
                language="french",
                accent="Parisian",
                style="warm_and_melodic",
                speed=0.95,
                pitch=1.05,
                stability=0.65,
                similarity_boost=0.8,
                style_intensity=0.5
            ),
            
            # Japanese - Yuki (Kyoto Tea House)
            "yuki": VoiceCharacter(
                voice_id="pNInz6obpgDQGcFmaJgB",  # Adam - can be adjusted
                name="Yuki Tanaka",
                language="japanese",
                accent="Kyoto",
                style="gentle_and_measured",
                speed=0.85,
                pitch=1.1,
                stability=0.75,
                similarity_boost=0.75,
                style_intensity=0.4
            ),
            
            # Spanish - Carmen (Madrid Tapas Bar)
            "carmen": VoiceCharacter(
                voice_id="XB0fDUnXU5powFXDhCwa",  # Charlotte variant
                name="Carmen Reyes",
                language="spanish",
                accent="Castilian",
                style="expressive_and_warm",
                speed=1.05,
                pitch=1.0,
                stability=0.55,
                similarity_boost=0.85,
                style_intensity=0.7
            ),
            
            # German - Wolfgang (Berlin Club)
            "wolfgang": VoiceCharacter(
                voice_id="VR6AewLTigWG4xSOukaG",  # Arnold - deep male
                name="Wolfgang Müller",
                language="german",
                accent="Berlin",
                style="measured_and_deep",
                speed=0.9,
                pitch=0.9,
                stability=0.7,
                similarity_boost=0.8,
                style_intensity=0.3
            ),
            
            # Italian - Marco (Rome Café)
            "marco": VoiceCharacter(
                voice_id="IKne3meq5aSn9XLyUdCD",  # Italian optimized
                name="Marco Benedetti",
                language="italian",
                accent="Roman",
                style="animated_and_warm",
                speed=1.1,
                pitch=1.0,
                stability=0.5,
                similarity_boost=0.85,
                style_intensity=0.65
            ),
            
            # Mandarin - Mei Lin (Beijing Tea House)
            "meilin": VoiceCharacter(
                voice_id="jsCqWAovK2LkecY7zXl4",  # Chinese optimized
                name="Mei Lin Wang",
                language="mandarin",
                accent="Beijing",
                style="gentle_and_wise",
                speed=0.9,
                pitch=1.05,
                stability=0.7,
                similarity_boost=0.8,
                style_intensity=0.4
            ),
            
            # Polish - Kasia (Warsaw Milk Bar)
            "kasia": VoiceCharacter(
                voice_id="onwK4e9ZLuTAKqWW03F9",  # Polish optimized
                name="Kasia Kowalska",
                language="polish",
                accent="Warsaw",
                style="warm_and_nurturing",
                speed=0.95,
                pitch=1.0,
                stability=0.65,
                similarity_boost=0.8,
                style_intensity=0.5
            ),
            
            # English (British) - Victoria (London Pub)
            "victoria": VoiceCharacter(
                voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel - British
                name="Victoria",
                language="english",
                accent="British",
                style="witty_and_warm",
                speed=1.0,
                pitch=1.0,
                stability=0.6,
                similarity_boost=0.8,
                style_intensity=0.5
            )
        }

    # ═══════════════════════════════════════════════════════════════════════════
    # TEXT-TO-SPEECH
    # ═══════════════════════════════════════════════════════════════════════════
    
    def text_to_speech(
        self,
        text: str,
        character_id: str,
        expression: Optional[str] = None,
        stream_audio: bool = False
    ) -> bytes:
        """
        Convert text to speech with character voice and expression.
        
        Args:
            text: The text to convert
            character_id: ID of the character (e.g., "amelie", "wolfgang")
            expression: Expression tag (e.g., "warmly", "excited")
            stream_audio: Whether to return streaming audio
            
        Returns:
            Audio bytes (MP3 format)
        """
        character = self.voice_characters.get(character_id)
        if not character:
            character = self.voice_characters["amelie"]  # Default
        
        # Add expression tag if provided
        if expression and expression in self.expression_tags:
            text = f"{self.expression_tags[expression]} {text}"
        
        try:
            # Generate audio with ElevenLabs
            # Note: eleven_v3 model requires stability (TTD stability) to be 0.0, 0.5, or 1.0
            # Map both stability and style to nearest valid values
            valid_ttd_values = [0.0, 0.5, 1.0]
            stability_value = min(valid_ttd_values, key=lambda x: abs(x - character.stability))
            style_value = min(valid_ttd_values, key=lambda x: abs(x - character.style_intensity))
            
            audio = self.client.text_to_speech.convert(
                text=text,
                voice_id=character.voice_id,
                model_id="eleven_v3",
                voice_settings=VoiceSettings(
                    stability=stability_value,
                    similarity_boost=character.similarity_boost,
                    style=style_value,
                    use_speaker_boost=True
                )
            )
            
            # Collect all chunks into bytes
            audio_bytes = b""
            for chunk in audio:
                audio_bytes += chunk
            
            return audio_bytes
            
        except Exception as e:
            print(f"TTS Error: {e}")
            raise

    def text_to_speech_stream(
        self,
        text: str,
        character_id: str,
        expression: Optional[str] = None
    ) -> Generator[bytes, None, None]:
        """
        Stream text to speech for real-time playback.
        
        Yields audio chunks as they're generated.
        """
        character = self.voice_characters.get(character_id, self.voice_characters["amelie"])
        
        if expression and expression in self.expression_tags:
            text = f"{self.expression_tags[expression]} {text}"
        
        try:
            # Map stability and style to valid TTD values for eleven_v3
            valid_ttd_values = [0.0, 0.5, 1.0]
            stability_value = min(valid_ttd_values, key=lambda x: abs(x - character.stability))
            style_value = min(valid_ttd_values, key=lambda x: abs(x - character.style_intensity))
            
            audio_stream = self.client.text_to_speech.convert_as_stream(
                text=text,
                voice_id=character.voice_id,
                model_id="eleven_v3",
                voice_settings=VoiceSettings(
                    stability=stability_value,
                    similarity_boost=character.similarity_boost,
                    style=style_value,
                    use_speaker_boost=True
                )
            )
            
            for chunk in audio_stream:
                yield chunk
                
        except Exception as e:
            print(f"TTS Stream Error: {e}")
            raise

    # ═══════════════════════════════════════════════════════════════════════════
    # SPEECH-TO-TEXT
    # ═══════════════════════════════════════════════════════════════════════════
    
    def speech_to_text(
        self,
        audio_content: bytes,
        language_hint: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Convert speech to text with optional language hint.
        
        Args:
            audio_content: Audio bytes
            language_hint: Expected language code (e.g., "fr", "de", "ja")
            
        Returns:
            Dict with transcription and metadata
        """
        try:
            result = self.client.speech_to_text.convert(
                file=audio_content,
                model_id="scribe_v1"
            )
            
            return {
                "text": result.text,
                "language_detected": getattr(result, 'language', language_hint),
                "confidence": getattr(result, 'confidence', 1.0)
            }
            
        except Exception as e:
            print(f"STT Error: {e}")
            return {
                "text": "",
                "error": str(e)
            }

    # ═══════════════════════════════════════════════════════════════════════════
    # REAL-TIME SPEECH-TO-TEXT (WebSocket Streaming)
    # ═══════════════════════════════════════════════════════════════════════════
    
    async def speech_to_text_realtime(
        self,
        audio_callback: Callable[[bytes], Awaitable[bytes | None]],
        transcript_callback: Callable[[Dict[str, Any]], Awaitable[None]],
        language_hint: Optional[str] = None,
        sample_rate: int = 16000
    ):
        """
        Real-time speech-to-text streaming via WebSocket.
        
        Connects to ElevenLabs Scribe v2 Realtime and streams audio for
        live word-by-word transcription.
        
        Args:
            audio_callback: Async function that returns audio chunks (bytes) or None to stop
            transcript_callback: Async function called with transcription updates
            language_hint: Expected language code (e.g., "fr", "de", "ja")
            sample_rate: Audio sample rate (default 16000 Hz)
        """
        # WebSocket URL with query params
        ws_url = f"wss://api.elevenlabs.io/v1/speech-to-text/realtime?model_id=scribe_v1_experimental"
        
        headers = {
            "xi-api-key": self.api_key
        }
        
        try:
            async with websockets.connect(ws_url, extra_headers=headers) as ws:
                # Send initial configuration
                config = {
                    "type": "config",
                    "transcription_config": {
                        "language": language_hint,
                        "sample_rate": sample_rate,
                        "encoding": "pcm_s16le"
                    }
                }
                await ws.send(json.dumps(config))
                
                # Create tasks for sending audio and receiving transcripts
                async def send_audio():
                    try:
                        while True:
                            audio_chunk = await audio_callback()
                            if audio_chunk is None:
                                # Send end of stream
                                await ws.send(json.dumps({"type": "eos"}))
                                break
                            
                            # Send audio as base64 encoded
                            message = {
                                "type": "audio",
                                "audio": base64.b64encode(audio_chunk).decode('utf-8')
                            }
                            await ws.send(json.dumps(message))
                    except Exception as e:
                        print(f"Send audio error: {e}")
                
                async def receive_transcripts():
                    try:
                        async for message in ws:
                            data = json.loads(message)
                            await transcript_callback(data)
                            
                            # Check for final transcript or error
                            if data.get("type") == "final" or data.get("type") == "error":
                                break
                    except websockets.exceptions.ConnectionClosed:
                        pass
                    except Exception as e:
                        print(f"Receive transcript error: {e}")
                
                # Run both tasks concurrently
                await asyncio.gather(send_audio(), receive_transcripts())
                
        except Exception as e:
            print(f"Realtime STT Error: {e}")
            raise

    async def create_realtime_transcription_session(
        self,
        language_hint: Optional[str] = None,
        sample_rate: int = 16000
    ):
        """
        Create a real-time transcription session that can be managed externally.
        
        Returns a RealtimeTranscriptionSession object for manual control.
        """
        return RealtimeTranscriptionSession(
            api_key=self.api_key,
            language_hint=language_hint,
            sample_rate=sample_rate
        )

    # ═══════════════════════════════════════════════════════════════════════════
    # PRONUNCIATION ASSESSMENT
    # ═══════════════════════════════════════════════════════════════════════════
    
    def assess_pronunciation(
        self,
        audio_content: bytes,
        target_text: str,
        language: str
    ) -> PronunciationFeedback:
        """
        Assess user's pronunciation against target text.
        
        This uses STT to transcribe what the user said, then compares
        it against what they should have said.
        """
        # Transcribe user's speech
        transcription = self.speech_to_text(audio_content, language)
        user_text = transcription.get("text", "").lower().strip()
        target_clean = target_text.lower().strip()
        
        # Simple comparison (can be enhanced with phonetic analysis)
        issues = []
        suggestions = []
        
        # Calculate similarity score
        from difflib import SequenceMatcher
        similarity = SequenceMatcher(None, user_text, target_clean).ratio()
        accuracy_score = similarity * 100
        
        # Identify specific issues
        if user_text != target_clean:
            if len(user_text) < len(target_clean) * 0.5:
                issues.append("Speech was too short or unclear")
                suggestions.append("Speak more slowly and clearly")
            
            # Check for common pronunciation issues by language
            if language == "french":
                if "r" in target_clean and user_text.replace("r", "") == target_clean.replace("r", ""):
                    issues.append("French 'r' sound needs work")
                    suggestions.append("Practice the guttural French 'r' from the back of throat")
                    
            elif language == "german":
                if "ch" in target_clean:
                    issues.append("German 'ch' sound may need practice")
                    suggestions.append("The German 'ch' varies - 'ich' is softer than 'ach'")
                    
            elif language == "japanese":
                if accuracy_score < 70:
                    issues.append("Pitch accent may need adjustment")
                    suggestions.append("Japanese uses pitch patterns - listen carefully to native speakers")
        
        return PronunciationFeedback(
            word=target_text,
            target_pronunciation=target_text,
            user_pronunciation=user_text,
            accuracy_score=round(accuracy_score, 1),
            issues=issues if issues else ["Good pronunciation!"],
            suggestions=suggestions if suggestions else ["Keep practicing!"]
        )

    # ═══════════════════════════════════════════════════════════════════════════
    # VOICE CLONING (For Celebrity/Custom Voices)
    # ═══════════════════════════════════════════════════════════════════════════
    
    def clone_voice(
        self,
        name: str,
        description: str,
        audio_files: List[bytes],
        labels: Optional[Dict[str, str]] = None
    ) -> str:
        """
        Clone a voice from audio samples.
        
        Args:
            name: Name for the cloned voice
            description: Description of the voice
            audio_files: List of audio sample bytes
            labels: Optional labels (accent, age, gender, etc.)
            
        Returns:
            Voice ID of the cloned voice
        """
        try:
            # Create voice clone
            voice = self.client.clone(
                name=name,
                description=description,
                files=audio_files,
                labels=labels or {}
            )
            
            return voice.voice_id
            
        except Exception as e:
            print(f"Voice Clone Error: {e}")
            raise

    def list_available_voices(self) -> List[Dict[str, Any]]:
        """List all available voices including custom clones."""
        try:
            voices = self.client.voices.get_all()
            return [
                {
                    "voice_id": v.voice_id,
                    "name": v.name,
                    "category": getattr(v, 'category', 'unknown'),
                    "labels": getattr(v, 'labels', {})
                }
                for v in voices.voices
            ]
        except Exception as e:
            print(f"List Voices Error: {e}")
            return []

    # ═══════════════════════════════════════════════════════════════════════════
    # SOUND EFFECTS & MUSIC
    # ═══════════════════════════════════════════════════════════════════════════
    
    def generate_sound_effect(
        self,
        description: str,
        duration_seconds: float = 2.0
    ) -> bytes:
        """
        Generate a sound effect from description.
        
        Args:
            description: Description of the sound (e.g., "door bell chime")
            duration_seconds: Desired duration
            
        Returns:
            Audio bytes
        """
        try:
            # Use ElevenLabs sound generation
            audio = self.client.text_to_sound_effects.convert(
                text=description,
                duration_seconds=duration_seconds
            )
            
            audio_bytes = b""
            for chunk in audio:
                audio_bytes += chunk
            
            return audio_bytes
            
        except Exception as e:
            print(f"Sound Effect Error: {e}")
            return b""

    def get_ambient_sounds(self, scene_type: str) -> Dict[str, str]:
        """
        Get ambient sound configurations for a scene.
        
        Args:
            scene_type: Type of scene (bakery, teahouse, club, etc.)
            
        Returns:
            Dict of sound names to descriptions for generation
        """
        ambient_configs = {
            "bakery": {
                "background": "Gentle French café ambience with soft conversation",
                "coffee": "Espresso machine steaming and hissing",
                "door": "Classic shop door bell chiming",
                "music": "Soft French accordion music playing distantly"
            },
            "teahouse": {
                "background": "Peaceful Japanese garden with birds and wind",
                "water": "Bamboo water fountain clicking rhythmically",
                "music": "Gentle koto and shamisen traditional music"
            },
            "tapas_bar": {
                "background": "Lively Spanish bar with conversation and laughter",
                "sizzle": "Tapas sizzling on hot plates",
                "music": "Passionate flamenco guitar playing"
            },
            "club": {
                "background": "Deep techno bass rumbling",
                "crowd": "Underground club crowd ambient",
                "music": "Minimal techno beat at 130 BPM"
            },
            "cafe": {
                "background": "Italian piazza sounds with Vespas passing",
                "espresso": "Italian espresso machine brewing",
                "music": "Classic Italian romantic music"
            },
            "milk_bar": {
                "background": "Cozy Polish restaurant ambience",
                "kitchen": "Home cooking sounds, pots and pans",
                "music": "Modern Polish folk music"
            }
        }
        
        return ambient_configs.get(scene_type, ambient_configs["bakery"])

    # ═══════════════════════════════════════════════════════════════════════════
    # CONVERSATIONAL AI INTEGRATION
    # ═══════════════════════════════════════════════════════════════════════════
    
    def generate_character_response(
        self,
        character_id: str,
        user_input: str,
        conversation_history: List[Dict[str, str]],
        difficulty_level: int = 1,
        target_language: str = "french"
    ) -> Dict[str, Any]:
        """
        Generate a character response with appropriate language mix.
        
        This wraps the NPC service but adds voice-specific enhancements.
        
        Args:
            character_id: Character identifier
            user_input: What the user said
            conversation_history: Previous conversation turns
            difficulty_level: 1-5, controls target language percentage
            target_language: The language being learned
            
        Returns:
            Dict with response text, audio, and metadata
        """
        character = self.voice_characters.get(character_id)
        if not character:
            character = list(self.voice_characters.values())[0]
        
        # Determine expression based on context
        expression = self._determine_expression(user_input, conversation_history)
        
        # The actual response generation would be handled by NPC service
        # Here we just prepare the voice response
        return {
            "character": character.name,
            "expression": expression,
            "voice_id": character.voice_id,
            "language": target_language
        }

    def _determine_expression(
        self,
        user_input: str,
        history: List[Dict[str, str]]
    ) -> str:
        """Determine appropriate expression based on context."""
        user_lower = user_input.lower()
        
        # Check for greetings
        greetings = ["hello", "hi", "bonjour", "hola", "ciao", "guten tag", "cześć"]
        if any(g in user_lower for g in greetings):
            return "warmly"
        
        # Check for questions
        if "?" in user_input:
            return "curious"
        
        # Check for thanks
        thanks = ["thank", "merci", "gracias", "danke", "grazie", "dziękuję"]
        if any(t in user_lower for t in thanks):
            return "encouraging"
        
        # Check for mistakes/corrections in history
        if len(history) > 0 and "correct" in str(history[-1]).lower():
            return "patient"
        
        return "warm"

    # ═══════════════════════════════════════════════════════════════════════════
    # UTILITY METHODS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_character_info(self, character_id: str) -> Optional[Dict[str, Any]]:
        """Get information about a character's voice settings."""
        character = self.voice_characters.get(character_id)
        if not character:
            return None
        
        return {
            "name": character.name,
            "language": character.language,
            "accent": character.accent,
            "style": character.style,
            "voice_id": character.voice_id
        }

    def list_characters(self) -> List[Dict[str, str]]:
        """List all available characters."""
        return [
            {
                "id": char_id,
                "name": char.name,
                "language": char.language,
                "accent": char.accent
            }
            for char_id, char in self.voice_characters.items()
        ]

    async def generate_audio_async(
        self,
        text: str,
        character_id: str,
        expression: Optional[str] = None
    ) -> bytes:
        """Async wrapper for TTS generation."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            lambda: self.text_to_speech(text, character_id, expression)
        )


class RealtimeTranscriptionSession:
    """
    Manages a real-time transcription WebSocket session.
    
    Provides fine-grained control over the streaming session lifecycle.
    """
    
    def __init__(
        self,
        api_key: str,
        language_hint: Optional[str] = None,
        sample_rate: int = 16000
    ):
        self.api_key = api_key
        self.language_hint = language_hint
        self.sample_rate = sample_rate
        self.ws = None
        self.is_connected = False
        self._receive_task = None
        
    async def connect(self) -> bool:
        """Establish WebSocket connection to ElevenLabs."""
        try:
            ws_url = "wss://api.elevenlabs.io/v1/speech-to-text/realtime?model_id=scribe_v1_experimental"
            headers = {"xi-api-key": self.api_key}
            
            self.ws = await websockets.connect(ws_url, extra_headers=headers)
            self.is_connected = True
            
            # Send configuration
            config = {
                "type": "config",
                "transcription_config": {
                    "language": self.language_hint,
                    "sample_rate": self.sample_rate,
                    "encoding": "pcm_s16le"
                }
            }
            await self.ws.send(json.dumps(config))
            
            return True
        except Exception as e:
            print(f"Connect error: {e}")
            self.is_connected = False
            return False
    
    async def send_audio(self, audio_chunk: bytes):
        """Send an audio chunk to the transcription service."""
        if not self.is_connected or not self.ws:
            return
        
        try:
            message = {
                "type": "audio",
                "audio": base64.b64encode(audio_chunk).decode('utf-8')
            }
            await self.ws.send(json.dumps(message))
        except Exception as e:
            print(f"Send audio error: {e}")
    
    async def receive_transcript(self) -> Optional[Dict[str, Any]]:
        """Receive the next transcript message."""
        if not self.is_connected or not self.ws:
            return None
        
        try:
            message = await self.ws.recv()
            return json.loads(message)
        except websockets.exceptions.ConnectionClosed:
            self.is_connected = False
            return None
        except Exception as e:
            print(f"Receive error: {e}")
            return None
    
    async def end_stream(self):
        """Signal end of audio stream."""
        if self.ws and self.is_connected:
            try:
                await self.ws.send(json.dumps({"type": "eos"}))
            except Exception as e:
                print(f"End stream error: {e}")
    
    async def close(self):
        """Close the WebSocket connection."""
        if self.ws:
            try:
                await self.ws.close()
            except:
                pass
        self.is_connected = False
        self.ws = None


# Singleton instance
elevenlabs_service = ElevenLabsService()

