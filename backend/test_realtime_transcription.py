"""
Test script for real-time transcription WebSocket.

This script demonstrates how to connect to the real-time transcription endpoint
and stream audio for word-by-word transcription.

Usage:
    python test_realtime_transcription.py

Requirements:
    - pyaudio (for microphone access): pip install pyaudio
    - websockets: pip install websockets
"""

import asyncio
import json
import base64
import sys

try:
    import pyaudio
    HAS_PYAUDIO = True
except ImportError:
    HAS_PYAUDIO = False
    print("⚠️  PyAudio not installed. Install with: pip install pyaudio")
    print("   Will use simulated audio instead.\n")

import websockets

# WebSocket endpoint
WS_URL = "ws://localhost:8000/api/transcribe/realtime"

# Audio configuration
SAMPLE_RATE = 16000
CHUNK_SIZE = 1024  # frames per chunk
CHANNELS = 1
FORMAT = pyaudio.paInt16 if HAS_PYAUDIO else None


async def test_with_microphone():
    """Test real-time transcription using microphone input."""
    print("🎤 Real-Time Transcription Test")
    print("=" * 50)
    print(f"Connecting to: {WS_URL}")
    print("Speak into your microphone. Press Ctrl+C to stop.\n")
    
    # Initialize PyAudio
    audio = pyaudio.PyAudio()
    stream = audio.open(
        format=FORMAT,
        channels=CHANNELS,
        rate=SAMPLE_RATE,
        input=True,
        frames_per_buffer=CHUNK_SIZE
    )
    
    try:
        async with websockets.connect(WS_URL) as ws:
            print("✅ Connected to transcription service\n")
            
            # Send initial configuration
            config = {
                "type": "config",
                "language": "en",  # Change to desired language code
                "sample_rate": SAMPLE_RATE
            }
            await ws.send(json.dumps(config))
            
            # Wait for connection confirmation
            response = await ws.recv()
            data = json.loads(response)
            print(f"📡 Server: {data.get('message', data)}\n")
            
            # Task to receive transcripts
            async def receive_transcripts():
                try:
                    async for message in ws:
                        data = json.loads(message)
                        msg_type = data.get("type", "")
                        
                        if msg_type == "partial":
                            # Clear line and print partial transcript
                            text = data.get("text", "")
                            sys.stdout.write(f"\r🔄 {text}          ")
                            sys.stdout.flush()
                        
                        elif msg_type == "final":
                            # Print final transcript on new line
                            text = data.get("text", "")
                            print(f"\r✅ {text}          ")
                            
                            # Print word-level details if available
                            words = data.get("words", [])
                            if words:
                                print(f"   Words: {[w.get('word', w) for w in words[:5]]}...")
                        
                        elif msg_type == "utterance_end":
                            print("\n--- Utterance ended ---\n")
                        
                        elif msg_type == "error":
                            print(f"\n❌ Error: {data.get('message', 'Unknown')}")
                            break
                            
                except websockets.exceptions.ConnectionClosed:
                    pass
            
            # Start receiving in background
            receive_task = asyncio.create_task(receive_transcripts())
            
            # Stream audio from microphone
            print("🎙️  Listening... (Ctrl+C to stop)\n")
            try:
                while True:
                    # Read audio chunk
                    audio_data = stream.read(CHUNK_SIZE, exception_on_overflow=False)
                    
                    # Send to server
                    message = {
                        "type": "audio",
                        "data": base64.b64encode(audio_data).decode('utf-8')
                    }
                    await ws.send(json.dumps(message))
                    
                    # Small delay to prevent overwhelming
                    await asyncio.sleep(0.01)
                    
            except KeyboardInterrupt:
                print("\n\n🛑 Stopping...")
                
                # Send end of stream
                await ws.send(json.dumps({"type": "eos"}))
                await asyncio.sleep(0.5)
                
                receive_task.cancel()
                
    finally:
        stream.stop_stream()
        stream.close()
        audio.terminate()
        print("✅ Cleanup complete")


async def test_without_microphone():
    """Test WebSocket connection without microphone."""
    print("🔌 WebSocket Connection Test (no microphone)")
    print("=" * 50)
    print(f"Connecting to: {WS_URL}\n")
    
    try:
        async with websockets.connect(WS_URL) as ws:
            print("✅ Connected successfully!\n")
            
            # Wait for connection confirmation
            response = await ws.recv()
            data = json.loads(response)
            print(f"📡 Server response: {json.dumps(data, indent=2)}\n")
            
            # Send config
            config = {
                "type": "config",
                "language": "en",
                "sample_rate": 16000
            }
            await ws.send(json.dumps(config))
            print("📤 Sent config")
            
            # Receive config confirmation
            response = await ws.recv()
            data = json.loads(response)
            print(f"📡 Config response: {json.dumps(data, indent=2)}\n")
            
            # Send some silent audio (zeros)
            print("📤 Sending silent audio frames...")
            for i in range(10):
                silent_audio = bytes(1024)  # 1KB of silence
                message = {
                    "type": "audio",
                    "data": base64.b64encode(silent_audio).decode('utf-8')
                }
                await ws.send(json.dumps(message))
                await asyncio.sleep(0.05)
            
            # End stream
            await ws.send(json.dumps({"type": "eos"}))
            print("📤 Sent end-of-stream")
            
            # Wait for final responses
            await asyncio.sleep(1)
            
            print("\n✅ Test completed successfully!")
            print("\nTo test with real audio, install PyAudio:")
            print("   pip install pyaudio")
            
    except websockets.exceptions.ConnectionRefused:
        print("❌ Connection refused. Is the server running?")
        print("   Start with: cd backend && python main.py")
    except Exception as e:
        print(f"❌ Error: {e}")


async def main():
    if HAS_PYAUDIO:
        await test_with_microphone()
    else:
        await test_without_microphone()


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("   REAL-TIME TRANSCRIPTION TEST")
    print("=" * 60 + "\n")
    
    asyncio.run(main())

