"""
Generate sound effects using ElevenLabs Sound Effects API

Usage:
    python generate_sounds.py          # Skip existing files
    python generate_sounds.py --force  # Regenerate all files
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Install: pip install elevenlabs python-dotenv
from elevenlabs import ElevenLabs

# Load .env from project root
load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / "frontend" / "sounds"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Sound effects to generate
SOUNDS = [
    # Footsteps
    {
        "filename": "footstep_snow_1.mp3",
        "prompt": "Single footstep crunching through fresh snow, soft and muffled",
        "duration": 0.5
    },
    {
        "filename": "footstep_snow_2.mp3",
        "prompt": "Single footstep on packed snow, crisp crunch sound",
        "duration": 0.5
    },
    {
        "filename": "footstep_snow_3.mp3",
        "prompt": "Single footstep in deep snow, soft squeak and crunch",
        "duration": 0.5
    },
    {
        "filename": "footstep_snow_4.mp3",
        "prompt": "Single quiet footstep on icy snow surface",
        "duration": 0.5
    },
    # Ambient
    {
        "filename": "ambient_wind.mp3",
        "prompt": "Gentle winter wind blowing through a snowy village, soft howling breeze, peaceful and cold atmosphere, loopable ambient",
        "duration": 15
    },
    # UI/Dialogue sounds
    {
        "filename": "dialogue_open.mp3",
        "prompt": "Soft wooden creak and paper rustle, like opening an old book or scroll, gentle and warm",
        "duration": 0.8
    },
    {
        "filename": "dialogue_advance.mp3",
        "prompt": "Soft page turn sound, paper flipping, gentle and subtle",
        "duration": 0.5
    },
    {
        "filename": "interact_prompt.mp3",
        "prompt": "Soft magical shimmer notification sound, gentle sparkle chime, subtle and pleasant",
        "duration": 0.5
    },
    # Character sounds
    {
        "filename": "cat_meow.mp3",
        "prompt": "Cute cat meowing softly, friendly and adorable kitten sound",
        "duration": 1.0
    },
    {
        "filename": "bird_chirp.mp3",
        "prompt": "Small bird chirping happily, cheerful songbird tweet, friendly and welcoming",
        "duration": 1.2
    },
    # Quest sounds
    {
        "filename": "quest_complete.mp3",
        "prompt": "Cheerful fantasy success jingle, magical achievement chime, warm and rewarding fanfare",
        "duration": 2.0
    },
]

def generate_sounds(force=False):
    client = ElevenLabs(api_key=API_KEY)
    
    generated = 0
    skipped = 0
    
    for sound in SOUNDS:
        output_path = OUTPUT_DIR / sound["filename"]
        
        # Skip if file exists (unless force)
        if output_path.exists() and not force:
            print(f"⏭ Skipping: {sound['filename']} (already exists)")
            skipped += 1
            continue
        
        print(f"Generating: {sound['filename']}...")
        
        try:
            # Generate the sound effect
            audio = client.text_to_sound_effects.convert(
                text=sound["prompt"],
                duration_seconds=sound["duration"]
            )
            
            # Save to file
            with open(output_path, "wb") as f:
                for chunk in audio:
                    f.write(chunk)
            
            print(f"  ✓ Saved to {output_path}")
            generated += 1
            
        except Exception as e:
            print(f"  ✗ Error: {e}")
    
    return generated, skipped

if __name__ == "__main__":
    force = "--force" in sys.argv
    
    print("ElevenLabs Sound Effects Generator")
    print("=" * 40)
    print(f"Output directory: {OUTPUT_DIR}")
    if force:
        print("Mode: FORCE (regenerating all)")
    else:
        print("Mode: Skip existing (use --force to regenerate)")
    print()
    
    generated, skipped = generate_sounds(force=force)
    
    print()
    print(f"Done! Generated: {generated}, Skipped: {skipped}")

