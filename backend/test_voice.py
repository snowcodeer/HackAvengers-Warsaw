import os
import sys
import base64
from fastapi.testclient import TestClient
from main import app

# Add current directory to path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

client = TestClient(app)

def test_voice_generation():
    print("--- TESTING VOICE GENERATION ---\n")
    
    # Start conversation with Child
    print("[Action] Starting conversation with Child...")
    response = client.post("/api/conversation/start", json={"npc_id": "child"})
    
    if response.status_code == 200:
        data = response.json()
        greeting = data["greeting"]
        audio_url = data.get("audio_url")
        
        print(f"Greeting: {greeting}")
        print(f"Audio URL: {audio_url}")
        
        if audio_url:
            print("Fetching audio stream...")
            # Fetch the stream
            audio_response = client.get(audio_url)
            
            if audio_response.status_code == 200:
                print("Stream received! Saving to file...")
                with open("test_stream_output.mp3", "wb") as f:
                    for chunk in audio_response.iter_bytes():
                        f.write(chunk)
                print("Saved audio to 'test_stream_output.mp3'")
                
                print("Playing audio...")
                import subprocess
                subprocess.run(["afplay", "test_stream_output.mp3"])
                print("Finished playing.")
            else:
                print(f"Error fetching stream: {audio_response.status_code}")
        else:
            print("No audio URL received.")
    else:
        print(f"Error: {response.status_code} - {response.text}")

def test_expressive_voice():
    print("\n--- TESTING EXPRESSIVE VOICE ---\n")
    from services.voice_service import voice_service
    
    text = "[sadly] I am so sad... [excited] But now I am happy!"
    print(f"Generating audio for: {text}")
    
    stream = voice_service.generate_audio_stream(text, "21m00Tcm4TlvDq8ikWAM") # Rachel
    
    if stream:
        with open("test_expressive.mp3", "wb") as f:
            f.write(b"".join(stream))
        print("Saved to test_expressive.mp3")
        
        print("Playing...")
        import subprocess
        subprocess.run(["afplay", "test_expressive.mp3"])
    else:
        print("Failed to generate audio.")

if __name__ == "__main__":
    # test_voice_generation()
    test_expressive_voice()
