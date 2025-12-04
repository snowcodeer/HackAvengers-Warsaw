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
    # 🇫🇷 FRENCH - Paris Boulangerie
    {
        "filename": "music_french.mp3",
        "prompt": "Soft French café accordion music, gentle romantic Parisian melody, warm and cozy bakery atmosphere, peaceful musette waltz, loopable background music, quiet and nostalgic",
        "duration": 30
    },
    # 🇩🇪 GERMAN - Berlin Club (chill version)
    {
        "filename": "music_german.mp3",
        "prompt": "Soft ambient electronic music, gentle Berlin lounge beats, minimal and relaxing, warm synth pads, chill downtempo, loopable background, peaceful and modern",
        "duration": 30
    },
    # 🇪🇸 SPANISH - Madrid Tapas Bar
    {
        "filename": "music_spanish.mp3",
        "prompt": "Soft Spanish guitar melody, gentle flamenco-inspired acoustic, warm and romantic, peaceful tapas bar atmosphere, relaxing classical guitar, loopable background music",
        "duration": 30
    },
    # 🇮🇹 ITALIAN - Rome Café
    {
        "filename": "music_italian.mp3",
        "prompt": "Soft Italian mandolin and accordion, gentle Neapolitan melody, warm romantic Rome atmosphere, peaceful café music, nostalgic and cozy, loopable background",
        "duration": 30
    },
    # 🇯🇵 JAPANESE - Kyoto Tea House
    {
        "filename": "music_japanese.mp3",
        "prompt": "Soft Japanese koto and bamboo flute music, gentle zen garden melody, peaceful and meditative, warm traditional atmosphere, relaxing shamisen, loopable background",
        "duration": 30
    },
    # 🇨🇳 MANDARIN - Beijing Tea House
    {
        "filename": "music_mandarin.mp3",
        "prompt": "Soft Chinese guzheng and erhu music, gentle traditional melody, peaceful tea ceremony atmosphere, warm and contemplative, relaxing oriental, loopable background",
        "duration": 30
    },
    # 🇵🇱 POLISH - Warsaw Milk Bar
    {
        "filename": "music_polish.mp3",
        "prompt": "Soft Polish folk-inspired piano melody, gentle nostalgic Eastern European atmosphere, warm and cozy, peaceful accordion accompaniment, heartwarming and homey, loopable background",
        "duration": 30
    },
    # 🇬🇧 ENGLISH - London Pub
    {
        "filename": "music_english.mp3",
        "prompt": "Soft British pub acoustic guitar, gentle Celtic-inspired melody, warm and cozy fireplace atmosphere, peaceful folk, relaxing and nostalgic, loopable background music",
        "duration": 30
    },
]

# ═══════════════════════════════════════════════════════════════════════════════
# AMBIENT SOUNDS PER COUNTRY
# ═══════════════════════════════════════════════════════════════════════════════

AMBIENT_SOUNDS = [
    # French bakery ambience
    {
        "filename": "ambient_french.mp3",
        "prompt": "Gentle French café ambience, soft coffee machine sounds, quiet conversation murmur, peaceful Parisian morning, birds outside, warm and cozy",
        "duration": 20
    },
    # German club (chill ambience)
    {
        "filename": "ambient_german.mp3",
        "prompt": "Soft Berlin lounge ambience, gentle electronic hum, distant city sounds, modern and peaceful, subtle bass vibration, relaxing urban night",
        "duration": 20
    },
    # Spanish tapas bar
    {
        "filename": "ambient_spanish.mp3",
        "prompt": "Warm Spanish tapas bar ambience, soft conversation, gentle clinking glasses, peaceful Madrid evening, distant guitar strumming",
        "duration": 20
    },
    # Italian café
    {
        "filename": "ambient_italian.mp3",
        "prompt": "Peaceful Italian café ambience, espresso machine hissing, soft Roman piazza sounds, gentle conversation, warm afternoon sun",
        "duration": 20
    },
    # Japanese tea house
    {
        "filename": "ambient_japanese.mp3",
        "prompt": "Serene Japanese tea garden ambience, gentle bamboo water fountain, soft wind through trees, peaceful birds, zen meditation atmosphere",
        "duration": 20
    },
    # Chinese tea house
    {
        "filename": "ambient_mandarin.mp3",
        "prompt": "Peaceful Chinese tea house ambience, gentle water pouring, soft wind chimes, quiet contemplative atmosphere, birds singing",
        "duration": 20
    },
    # Polish milk bar
    {
        "filename": "ambient_polish.mp3",
        "prompt": "Cozy Polish restaurant ambience, gentle kitchen sounds, warm conversation murmur, homey and nostalgic atmosphere, peaceful dining",
        "duration": 20
    },
    # British pub
    {
        "filename": "ambient_english.mp3",
        "prompt": "Cozy British pub ambience, gentle fireplace crackling, soft rain outside window, warm conversation murmur, peaceful evening",
        "duration": 20
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
