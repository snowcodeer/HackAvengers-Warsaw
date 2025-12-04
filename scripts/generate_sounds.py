"""
Generate sound effects and background music using ElevenLabs Sound Effects API

Usage:
    python generate_sounds.py          # Skip existing files
    python generate_sounds.py --force  # Regenerate all files
    python generate_sounds.py --music  # Generate only music files
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

# ═══════════════════════════════════════════════════════════════════════════════
# SOUND EFFECTS
# ═══════════════════════════════════════════════════════════════════════════════

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

# ═══════════════════════════════════════════════════════════════════════════════
# COUNTRY BACKGROUND MUSIC - Wholesome & Loopable
# ═══════════════════════════════════════════════════════════════════════════════

BACKGROUND_MUSIC = [
    # 🇫🇷 FRENCH - Paris Boulangerie (French radio playing in the shop)
    {
        "filename": "music_french.mp3",
        "prompt": "French radio music playing in a bakery, upbeat chanson française pop song, catchy French vocals with accordion and guitar, cheerful Parisian radio hit, warm lo-fi radio quality, nostalgic and joyful, like France Inter playing in the background",
        "duration": 30
    },
    # 🇩🇪 GERMAN - Berlin Club
    {
        "filename": "music_german.mp3",
        "prompt": "German indie pop radio song, catchy Berlin alternative rock melody with synths, upbeat modern German pop music, energetic and fun, radio quality warm sound, like playing on Radio Fritz",
        "duration": 30
    },
    # 🇪🇸 SPANISH - Madrid Tapas Bar
    {
        "filename": "music_spanish.mp3",
        "prompt": "Spanish pop radio hit playing in tapas bar, catchy modern Spanish pop reggaeton fusion, upbeat flamenco-pop melody, warm radio quality, cheerful and danceable, like playing on Los 40 radio",
        "duration": 30
    },
    # 🇮🇹 ITALIAN - Rome Café
    {
        "filename": "music_italian.mp3",
        "prompt": "Italian pop song playing on café radio, romantic modern Italian pop ballad with piano and strings, catchy Sanremo-style melody, warm and passionate vocals, nostalgic Italian radio atmosphere",
        "duration": 30
    },
    # 🇯🇵 JAPANESE - Tokyo convenience store / J-pop
    {
        "filename": "music_japanese.mp3",
        "prompt": "Japanese pop music, catchy J-pop song with bright synths and cheerful melody, upbeat kawaii idol pop style, energetic and fun, like music playing in Tokyo convenience store or café",
        "duration": 30
    },
    # 🇨🇳 MANDARIN - Chinese pop / C-pop
    {
        "filename": "music_mandarin.mp3",
        "prompt": "Chinese pop song, catchy modern C-pop with romantic Mandarin vocals, upbeat contemporary Chinese pop ballad, beautiful melody with piano and electronic beats, like popular Chinese radio hit, warm and emotional",
        "duration": 30
    },
    # 🇵🇱 POLISH - Warsaw Milk Bar / Disco polo vibes
    {
        "filename": "music_polish.mp3",
        "prompt": "Polish pop radio song, catchy modern Polish pop melody with synthesizers, upbeat and cheerful Eastern European pop, warm nostalgic sound, like playing on Polish Radio RMF FM, fun and danceable",
        "duration": 30
    },
    # 🇬🇧 ENGLISH - London Pub / British Indie
    {
        "filename": "music_english.mp3",
        "prompt": "British indie rock song playing in pub, catchy UK alternative rock with guitars, upbeat modern British pop rock melody, warm and cool, like playing on BBC Radio 1, energetic and fun",
        "duration": 30
    },
]

# ═══════════════════════════════════════════════════════════════════════════════
# AMBIENT SOUNDS PER COUNTRY
# ═══════════════════════════════════════════════════════════════════════════════

AMBIENT_SOUNDS = [
    # French bakery ambience - morning boulangerie
    {
        "filename": "ambient_french.mp3",
        "prompt": "French bakery morning ambience, coffee machine brewing, paper bags rustling, door chime ringing, French people chatting softly, coins on counter, warm croissant smell atmosphere, cozy Parisian boulangerie sounds",
        "duration": 30
    },
    # German café/bar ambience
    {
        "filename": "ambient_german.mp3",
        "prompt": "Berlin café ambience, espresso machine hissing, soft German conversation, plates and cups clinking, modern urban coffee shop sounds, relaxed cosmopolitan atmosphere",
        "duration": 30
    },
    # Spanish tapas bar
    {
        "filename": "ambient_spanish.mp3",
        "prompt": "Madrid tapas bar ambience, lively Spanish conversation, glasses clinking, sizzling cooking sounds, cheerful busy restaurant atmosphere, warm Mediterranean evening",
        "duration": 30
    },
    # Italian café
    {
        "filename": "ambient_italian.mp3",
        "prompt": "Rome café ambience, espresso machine loud hiss, animated Italian conversation, ceramic cups on saucers, bustling Italian coffee bar atmosphere, warm and lively",
        "duration": 30
    },
    # Japanese café/convenience store
    {
        "filename": "ambient_japanese.mp3",
        "prompt": "Tokyo café ambience, gentle Japanese conversation, tea pouring sounds, soft electronic beeps, convenience store door chime, peaceful modern Japan urban atmosphere",
        "duration": 30
    },
    # Chinese restaurant/tea house
    {
        "filename": "ambient_mandarin.mp3",
        "prompt": "Chinese restaurant ambience, tea pouring, soft Mandarin conversation, chopsticks on bowls, sizzling wok in background, warm bustling dim sum atmosphere",
        "duration": 30
    },
    # Polish milk bar
    {
        "filename": "ambient_polish.mp3",
        "prompt": "Polish milk bar ambience, plates and cutlery sounds, soft Polish conversation, cash register ding, warm nostalgic canteen atmosphere, home cooking sounds",
        "duration": 30
    },
    # British pub
    {
        "filename": "ambient_english.mp3",
        "prompt": "British pub ambience, pint glasses clinking, soft British conversation, fireplace crackling, darts hitting board, cozy traditional pub atmosphere, warm and inviting",
        "duration": 30
    },
]


def generate_sounds(force=False, music_only=False):
    client = ElevenLabs(api_key=API_KEY)
    
    generated = 0
    skipped = 0
    errors = 0
    
    # Determine which sounds to generate
    if music_only:
        all_sounds = BACKGROUND_MUSIC + AMBIENT_SOUNDS
        print("🎵 Generating MUSIC and AMBIENT sounds only")
    else:
        all_sounds = SOUNDS + BACKGROUND_MUSIC + AMBIENT_SOUNDS
        print("🔊 Generating ALL sounds")
    
    print()
    
    for sound in all_sounds:
        output_path = OUTPUT_DIR / sound["filename"]
        
        # Skip if file exists (unless force)
        if output_path.exists() and not force:
            print(f"⏭  Skipping: {sound['filename']} (already exists)")
            skipped += 1
            continue
        
        print(f"🎧 Generating: {sound['filename']}...")
        print(f"   Duration: {sound['duration']}s")
        
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
            
            print(f"   ✓ Saved to {output_path.name}")
            generated += 1
            
        except Exception as e:
            print(f"   ✗ Error: {e}")
            errors += 1
    
    return generated, skipped, errors


if __name__ == "__main__":
    force = "--force" in sys.argv
    music_only = "--music" in sys.argv
    
    print("═" * 50)
    print("🎵 ElevenLabs Sound & Music Generator")
    print("═" * 50)
    print(f"📁 Output directory: {OUTPUT_DIR}")
    
    if force:
        print("⚡ Mode: FORCE (regenerating all)")
    elif music_only:
        print("🎶 Mode: Music & Ambient only")
    else:
        print("⏭  Mode: Skip existing (use --force to regenerate)")
    
    print("═" * 50)
    print()
    
    generated, skipped, errors = generate_sounds(force=force, music_only=music_only)
    
    print()
    print("═" * 50)
    print(f"✅ Generated: {generated}")
    print(f"⏭  Skipped: {skipped}")
    if errors:
        print(f"❌ Errors: {errors}")
    print("═" * 50)
