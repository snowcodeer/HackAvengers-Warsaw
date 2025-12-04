"""
═══════════════════════════════════════════════════════════════════════════════
LINGUAVERSE - Comprehensive Lesson Service
Full lesson plans, progress tracking, and adaptive learning
═══════════════════════════════════════════════════════════════════════════════
"""

import os
import json
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()


class LessonService:
    """
    Comprehensive lesson management service.
    
    Features:
    - Structured lesson plans for each language
    - Adaptive difficulty based on user performance
    - Spaced repetition for vocabulary
    - Progress tracking and analytics
    - AI-generated personalized content
    """
    
    def __init__(self):
        self.anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        
        # In-memory storage (replace with database in production)
        self.user_progress: Dict[str, Dict] = {}
        self.user_glossaries: Dict[str, Dict] = {}
        self.conversations: Dict[str, List] = {}
        
        # Initialize lesson plans
        self.lesson_plans = self._create_lesson_plans()
    
    def _create_lesson_plans(self) -> Dict[str, List[Dict]]:
        """Create structured lesson plans for all languages"""
        return {
            "french": self._french_lessons(),
            "german": self._german_lessons(),
            "spanish": self._spanish_lessons(),
            "italian": self._italian_lessons(),
            "japanese": self._japanese_lessons(),
            "mandarin": self._mandarin_lessons(),
            "polish": self._polish_lessons()
        }
    
    def _french_lessons(self) -> List[Dict]:
        """French lesson plan - Paris Boulangerie"""
        return [
            {
                "id": "fr_u1_l1",
                "unit": 1,
                "lesson": 1,
                "title": "Bonjour! - Greetings at the Bakery",
                "description": "Learn to greet people and introduce yourself",
                "difficulty": 1,
                "estimated_minutes": 10,
                "xp_reward": 50,
                "objectives": [
                    {"id": "obj1", "text": "Say hello and goodbye", "xp": 10},
                    {"id": "obj2", "text": "Introduce yourself", "xp": 15},
                    {"id": "obj3", "text": "Ask how someone is doing", "xp": 15},
                    {"id": "obj4", "text": "Respond to greetings", "xp": 10}
                ],
                "vocabulary": [
                    {"word": "Bonjour", "translation": "Hello/Good day", "pronunciation": "bon-ZHOOR"},
                    {"word": "Au revoir", "translation": "Goodbye", "pronunciation": "oh ruh-VWAR"},
                    {"word": "Merci", "translation": "Thank you", "pronunciation": "mer-SEE"},
                    {"word": "S'il vous plaît", "translation": "Please", "pronunciation": "seel voo PLAY"},
                    {"word": "Je m'appelle", "translation": "My name is", "pronunciation": "zhuh ma-PEL"},
                    {"word": "Comment allez-vous?", "translation": "How are you?", "pronunciation": "koh-mahn ta-lay VOO"},
                    {"word": "Très bien", "translation": "Very well", "pronunciation": "treh BYEN"},
                    {"word": "Enchanté(e)", "translation": "Nice to meet you", "pronunciation": "ahn-shahn-TAY"}
                ],
                "scenarios": [
                    {
                        "name": "Entering the Bakery",
                        "situation": "You enter Amélie's bakery for the first time",
                        "goal": "Greet Amélie and introduce yourself",
                        "hints": ["Start with 'Bonjour'", "Say your name with 'Je m'appelle...'"]
                    }
                ],
                "cultural_notes": [
                    "Always greet with 'Bonjour' when entering a shop - it's considered polite",
                    "Use 'vous' (formal you) with shopkeepers you don't know",
                    "French people typically greet each other with la bise (cheek kisses) between friends"
                ],
                "grammar": ["Subject pronouns: je, tu, vous", "Verb: être (to be) - je suis, vous êtes"]
            },
            {
                "id": "fr_u1_l2",
                "unit": 1,
                "lesson": 2,
                "title": "Un croissant, s'il vous plaît - Ordering",
                "description": "Learn to order food and drinks at the bakery",
                "difficulty": 1,
                "estimated_minutes": 12,
                "xp_reward": 60,
                "prerequisites": ["fr_u1_l1"],
                "objectives": [
                    {"id": "obj1", "text": "Order a croissant", "xp": 15},
                    {"id": "obj2", "text": "Ask for coffee", "xp": 15},
                    {"id": "obj3", "text": "Use numbers 1-10", "xp": 20},
                    {"id": "obj4", "text": "Ask the price", "xp": 10}
                ],
                "vocabulary": [
                    {"word": "croissant", "translation": "croissant", "pronunciation": "krwa-SAHN"},
                    {"word": "pain au chocolat", "translation": "chocolate pastry", "pronunciation": "pan oh sho-ko-LAH"},
                    {"word": "baguette", "translation": "baguette", "pronunciation": "ba-GET"},
                    {"word": "café", "translation": "coffee", "pronunciation": "ka-FAY"},
                    {"word": "C'est combien?", "translation": "How much is it?", "pronunciation": "say kom-BYEN"},
                    {"word": "un/une", "translation": "a/an", "pronunciation": "uhn/oon"},
                    {"word": "Je voudrais", "translation": "I would like", "pronunciation": "zhuh voo-DRAY"}
                ],
                "scenarios": [
                    {
                        "name": "Morning Order",
                        "situation": "You want a croissant and coffee for breakfast",
                        "goal": "Successfully order and pay",
                        "hints": ["Use 'Je voudrais' to politely request", "Don't forget 's'il vous plaît'"]
                    }
                ],
                "cultural_notes": [
                    "French people typically drink coffee 'au comptoir' (at the counter) for a lower price",
                    "Bread is bought fresh daily in France",
                    "It's common to tear bread rather than cut it"
                ],
                "grammar": ["Articles: un, une, le, la", "Numbers 1-10", "Je voudrais + noun"]
            },
            {
                "id": "fr_u1_l3",
                "unit": 1,
                "lesson": 3,
                "title": "C'est délicieux! - Describing Food",
                "description": "Learn adjectives to describe taste and quality",
                "difficulty": 1,
                "estimated_minutes": 15,
                "xp_reward": 70,
                "prerequisites": ["fr_u1_l2"],
                "objectives": [
                    {"id": "obj1", "text": "Use taste adjectives", "xp": 20},
                    {"id": "obj2", "text": "Express preferences", "xp": 20},
                    {"id": "obj3", "text": "Give compliments", "xp": 15},
                    {"id": "obj4", "text": "Ask for recommendations", "xp": 15}
                ],
                "vocabulary": [
                    {"word": "délicieux", "translation": "delicious", "pronunciation": "day-lee-SYUH"},
                    {"word": "frais/fraîche", "translation": "fresh", "pronunciation": "fray/fresh"},
                    {"word": "chaud/chaude", "translation": "hot/warm", "pronunciation": "shoh/shohd"},
                    {"word": "sucré", "translation": "sweet", "pronunciation": "soo-KRAY"},
                    {"word": "J'aime", "translation": "I like/love", "pronunciation": "zhem"},
                    {"word": "Je préfère", "translation": "I prefer", "pronunciation": "zhuh pray-FAIR"},
                    {"word": "Qu'est-ce que vous recommandez?", "translation": "What do you recommend?", "pronunciation": "kes-kuh voo reh-ko-mahn-DAY"}
                ],
                "scenarios": [
                    {
                        "name": "Tasting Pastries",
                        "situation": "Amélie offers you samples of her pastries",
                        "goal": "Express your preferences and ask for recommendations",
                        "hints": ["Use 'C'est...' + adjective", "Ask about her favorites"]
                    }
                ],
                "grammar": ["Adjective agreement (masculine/feminine)", "C'est + adjective", "Aimer, préférer + noun"]
            },
            {
                "id": "fr_u2_l1",
                "unit": 2,
                "lesson": 1,
                "title": "D'où venez-vous? - Origins & Small Talk",
                "description": "Learn to discuss where you're from and make small talk",
                "difficulty": 2,
                "estimated_minutes": 15,
                "xp_reward": 80,
                "prerequisites": ["fr_u1_l3"],
                "objectives": [
                    {"id": "obj1", "text": "Talk about where you're from", "xp": 20},
                    {"id": "obj2", "text": "Ask about someone's background", "xp": 20},
                    {"id": "obj3", "text": "Discuss the weather", "xp": 20},
                    {"id": "obj4", "text": "Use nationalities", "xp": 20}
                ],
                "vocabulary": [
                    {"word": "D'où venez-vous?", "translation": "Where are you from?", "pronunciation": "doo vuh-nay VOO"},
                    {"word": "Je viens de...", "translation": "I come from...", "pronunciation": "zhuh vyen duh"},
                    {"word": "Il fait beau", "translation": "The weather is nice", "pronunciation": "eel fay BOH"},
                    {"word": "américain(e)", "translation": "American", "pronunciation": "ah-may-ree-KAN"},
                    {"word": "anglais(e)", "translation": "English", "pronunciation": "ahn-GLAY"}
                ],
                "grammar": ["Venir (to come) conjugation", "Nationality adjectives", "Il fait + weather"]
            }
        ]
    
    def _german_lessons(self) -> List[Dict]:
        """German lesson plan - Berlin Club"""
        return [
            {
                "id": "de_u1_l1",
                "unit": 1,
                "lesson": 1,
                "title": "Guten Abend - Evening Greetings",
                "description": "Learn greetings appropriate for nightlife",
                "difficulty": 1,
                "estimated_minutes": 10,
                "xp_reward": 50,
                "objectives": [
                    {"id": "obj1", "text": "Use evening/night greetings", "xp": 15},
                    {"id": "obj2", "text": "Introduce yourself casually", "xp": 15},
                    {"id": "obj3", "text": "Ask basic questions", "xp": 10},
                    {"id": "obj4", "text": "Understand responses", "xp": 10}
                ],
                "vocabulary": [
                    {"word": "Guten Abend", "translation": "Good evening", "pronunciation": "GOO-ten AH-bent"},
                    {"word": "Hallo", "translation": "Hello (casual)", "pronunciation": "HA-loh"},
                    {"word": "Ich bin...", "translation": "I am...", "pronunciation": "ikh bin"},
                    {"word": "Wie heißt du?", "translation": "What's your name? (informal)", "pronunciation": "vee HYSST doo"},
                    {"word": "Freut mich", "translation": "Nice to meet you", "pronunciation": "froyt mikh"},
                    {"word": "Tschüss", "translation": "Bye (casual)", "pronunciation": "tchews"}
                ],
                "scenarios": [
                    {
                        "name": "At the Club Door",
                        "situation": "You meet Wolfgang at the club entrance",
                        "goal": "Introduce yourself and start a conversation",
                        "hints": ["Use casual greetings", "German nightlife is informal"]
                    }
                ],
                "cultural_notes": [
                    "Berlin club culture is famous for its door policies - be respectful",
                    "Germans use 'du' (informal you) more freely in nightlife settings",
                    "Berliners are known for being direct but friendly once you get to know them"
                ],
                "grammar": ["Du vs Sie (informal vs formal)", "Verb: sein (to be)", "Question formation"]
            },
            {
                "id": "de_u1_l2",
                "unit": 1,
                "lesson": 2,
                "title": "Ein Bier, bitte - Ordering Drinks",
                "description": "Learn to order drinks at the bar",
                "difficulty": 1,
                "estimated_minutes": 12,
                "xp_reward": 60,
                "prerequisites": ["de_u1_l1"],
                "vocabulary": [
                    {"word": "Bier", "translation": "beer", "pronunciation": "BEER"},
                    {"word": "Wasser", "translation": "water", "pronunciation": "VA-ser"},
                    {"word": "bitte", "translation": "please", "pronunciation": "BIT-uh"},
                    {"word": "danke", "translation": "thanks", "pronunciation": "DAHN-kuh"},
                    {"word": "Was kostet das?", "translation": "How much does that cost?", "pronunciation": "vas KOS-tet das"},
                    {"word": "Ich möchte...", "translation": "I would like...", "pronunciation": "ikh MUKH-tuh"}
                ],
                "grammar": ["Definite articles: der, die, das", "Ich möchte + noun", "Numbers and prices"]
            }
        ]
    
    def _spanish_lessons(self) -> List[Dict]:
        """Spanish lesson plan - Madrid Tapas Bar"""
        return [
            {
                "id": "es_u1_l1",
                "unit": 1,
                "lesson": 1,
                "title": "¡Hola! - Spanish Greetings",
                "description": "Learn warm Spanish greetings and expressions",
                "difficulty": 1,
                "estimated_minutes": 10,
                "xp_reward": 50,
                "vocabulary": [
                    {"word": "¡Hola!", "translation": "Hello!", "pronunciation": "OH-lah"},
                    {"word": "¿Qué tal?", "translation": "How are you?", "pronunciation": "kay TAHL"},
                    {"word": "Muy bien", "translation": "Very well", "pronunciation": "mwee BYEN"},
                    {"word": "Me llamo...", "translation": "My name is...", "pronunciation": "meh YAH-moh"},
                    {"word": "Mucho gusto", "translation": "Nice to meet you", "pronunciation": "MOO-cho GOO-stoh"},
                    {"word": "¡Hasta luego!", "translation": "See you later!", "pronunciation": "AH-stah LWEH-goh"}
                ],
                "cultural_notes": [
                    "Spanish people often greet with two cheek kisses (starting left)",
                    "Tapas culture encourages standing at the bar and socializing",
                    "Spaniards eat dinner very late (9-10 PM)"
                ],
                "grammar": ["Verb: llamarse (to be called)", "Question words: qué, cómo", "Greetings with ¡!"]
            }
        ]
    
    def _italian_lessons(self) -> List[Dict]:
        """Italian lesson plan - Rome Café"""
        return [
            {
                "id": "it_u1_l1",
                "unit": 1,
                "lesson": 1,
                "title": "Buongiorno! - Italian Greetings",
                "description": "Learn elegant Italian greetings",
                "difficulty": 1,
                "estimated_minutes": 10,
                "xp_reward": 50,
                "vocabulary": [
                    {"word": "Buongiorno", "translation": "Good day/morning", "pronunciation": "bwon-JORN-oh"},
                    {"word": "Buonasera", "translation": "Good evening", "pronunciation": "bwon-ah-SEH-rah"},
                    {"word": "Ciao", "translation": "Hi/Bye (informal)", "pronunciation": "CHOW"},
                    {"word": "Come sta?", "translation": "How are you? (formal)", "pronunciation": "KOH-meh STAH"},
                    {"word": "Bene, grazie", "translation": "Well, thanks", "pronunciation": "BEH-neh, GRAH-tsyeh"},
                    {"word": "Piacere", "translation": "Nice to meet you", "pronunciation": "pyah-CHEH-reh"}
                ],
                "cultural_notes": [
                    "Italians use different greetings based on time of day",
                    "Coffee culture is sacred - espresso is drunk standing at the bar",
                    "Never order cappuccino after 11 AM - it's a breakfast drink"
                ]
            }
        ]
    
    def _japanese_lessons(self) -> List[Dict]:
        """Japanese lesson plan - Kyoto Tea House"""
        return [
            {
                "id": "ja_u1_l1",
                "unit": 1,
                "lesson": 1,
                "title": "はじめまして - First Meetings",
                "description": "Learn polite Japanese greetings and introductions",
                "difficulty": 1,
                "estimated_minutes": 15,
                "xp_reward": 60,
                "vocabulary": [
                    {"word": "こんにちは", "translation": "Hello", "pronunciation": "kon-ni-chi-wa"},
                    {"word": "はじめまして", "translation": "Nice to meet you", "pronunciation": "ha-ji-me-ma-shi-te"},
                    {"word": "私は...です", "translation": "I am...", "pronunciation": "wa-ta-shi wa... de-su"},
                    {"word": "よろしくお願いします", "translation": "Please treat me well", "pronunciation": "yo-ro-shi-ku o-ne-gai-shi-mas"},
                    {"word": "ありがとうございます", "translation": "Thank you (polite)", "pronunciation": "a-ri-ga-tou go-za-i-mas"},
                    {"word": "どうぞ", "translation": "Please (offering)", "pronunciation": "dou-zo"}
                ],
                "cultural_notes": [
                    "Bowing is an important part of Japanese greetings",
                    "Use polite forms (keigo) with people you've just met",
                    "The tea ceremony (茶道) is about harmony, respect, purity, and tranquility"
                ],
                "grammar": ["Particle: は (wa) topic marker", "です (desu) - polite copula", "Basic sentence structure: Subject は Object です"]
            }
        ]
    
    def _mandarin_lessons(self) -> List[Dict]:
        """Mandarin lesson plan - Beijing Tea House"""
        return [
            {
                "id": "zh_u1_l1",
                "unit": 1,
                "lesson": 1,
                "title": "你好 - Hello in Chinese",
                "description": "Learn basic Chinese greetings with proper tones",
                "difficulty": 1,
                "estimated_minutes": 15,
                "xp_reward": 60,
                "vocabulary": [
                    {"word": "你好", "translation": "Hello", "pronunciation": "nǐ hǎo (3rd, 3rd tone)"},
                    {"word": "谢谢", "translation": "Thank you", "pronunciation": "xiè xiè (4th, 4th tone)"},
                    {"word": "不客气", "translation": "You're welcome", "pronunciation": "bù kè qì"},
                    {"word": "我叫...", "translation": "My name is...", "pronunciation": "wǒ jiào..."},
                    {"word": "请", "translation": "Please", "pronunciation": "qǐng (3rd tone)"},
                    {"word": "茶", "translation": "Tea", "pronunciation": "chá (2nd tone)"}
                ],
                "cultural_notes": [
                    "Tones are essential in Mandarin - the same syllable can mean different things",
                    "Tea culture in China spans thousands of years",
                    "It's polite to pour tea for others before yourself"
                ],
                "grammar": ["Four tones of Mandarin", "Basic sentence: Subject + Verb + Object", "Question particle 吗 (ma)"]
            }
        ]
    
    def _polish_lessons(self) -> List[Dict]:
        """Polish lesson plan - Warsaw Milk Bar"""
        return [
            {
                "id": "pl_u1_l1",
                "unit": 1,
                "lesson": 1,
                "title": "Cześć! - Polish Greetings",
                "description": "Learn friendly Polish greetings",
                "difficulty": 1,
                "estimated_minutes": 10,
                "xp_reward": 50,
                "vocabulary": [
                    {"word": "Cześć", "translation": "Hi", "pronunciation": "cheshch"},
                    {"word": "Dzień dobry", "translation": "Good day", "pronunciation": "jen DOB-ry"},
                    {"word": "Dziękuję", "translation": "Thank you", "pronunciation": "jen-KOO-yeh"},
                    {"word": "Proszę", "translation": "Please/You're welcome", "pronunciation": "PRO-sheh"},
                    {"word": "Przepraszam", "translation": "Excuse me/Sorry", "pronunciation": "psheh-PRA-shahm"},
                    {"word": "Do widzenia", "translation": "Goodbye", "pronunciation": "do vee-DZEN-ya"}
                ],
                "cultural_notes": [
                    "Polish has complex pronunciation - don't be afraid to practice",
                    "Milk bars (bar mleczny) are traditional affordable Polish restaurants",
                    "Pierogi are a beloved Polish comfort food"
                ],
                "grammar": ["Polish has 7 grammatical cases", "Formal vs informal forms", "Basic pronunciation rules"]
            },
            {
                "id": "pl_u1_l2",
                "unit": 1,
                "lesson": 2,
                "title": "Poproszę pierogi - Ordering Food",
                "description": "Learn to order traditional Polish dishes",
                "difficulty": 1,
                "estimated_minutes": 12,
                "xp_reward": 60,
                "prerequisites": ["pl_u1_l1"],
                "vocabulary": [
                    {"word": "Poproszę", "translation": "I'd like (polite)", "pronunciation": "po-PRO-sheh"},
                    {"word": "pierogi", "translation": "dumplings", "pronunciation": "pyeh-RO-gee"},
                    {"word": "barszcz", "translation": "beet soup", "pronunciation": "barshch"},
                    {"word": "żurek", "translation": "sour rye soup", "pronunciation": "ZHOO-rek"},
                    {"word": "kotlet schabowy", "translation": "pork cutlet", "pronunciation": "KOT-let skha-BO-vy"},
                    {"word": "Smacznego!", "translation": "Enjoy your meal!", "pronunciation": "smach-NEH-go"}
                ]
            }
        ]
    
    # ═══════════════════════════════════════════════════════════════════════════
    # LESSON MANAGEMENT
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_lesson_plan(self, language: str) -> List[Dict]:
        """Get the full lesson plan for a language"""
        return self.lesson_plans.get(language, [])
    
    def get_lesson(self, lesson_id: str) -> Optional[Dict]:
        """Get a specific lesson by ID"""
        for language_lessons in self.lesson_plans.values():
            for lesson in language_lessons:
                if lesson["id"] == lesson_id:
                    return lesson
        return None
    
    def get_next_lesson(self, user_id: str, language: str) -> Optional[Dict]:
        """Get the next unlocked lesson for a user"""
        progress = self.get_user_progress(user_id, language)
        completed = progress.get("completed_lessons", [])
        
        for lesson in self.lesson_plans.get(language, []):
            if lesson["id"] not in completed:
                # Check prerequisites
                prerequisites = lesson.get("prerequisites", [])
                if all(prereq in completed for prereq in prerequisites):
                    return lesson
        
        return None
    
    def complete_lesson(
        self,
        user_id: str,
        lesson_id: str,
        score: float,
        time_spent: int
    ) -> Dict:
        """Mark a lesson as completed and award XP"""
        lesson = self.get_lesson(lesson_id)
        if not lesson:
            return {"error": "Lesson not found"}
        
        language = lesson_id.split("_")[0]  # e.g., "fr" from "fr_u1_l1"
        language_map = {"fr": "french", "de": "german", "es": "spanish", 
                       "it": "italian", "ja": "japanese", "zh": "mandarin", "pl": "polish"}
        language = language_map.get(language, language)
        
        progress = self.get_user_progress(user_id, language)
        
        # Award XP based on score
        base_xp = lesson["xp_reward"]
        earned_xp = int(base_xp * (score / 100))
        
        # Update progress
        if lesson_id not in progress.get("completed_lessons", []):
            progress.setdefault("completed_lessons", []).append(lesson_id)
            progress["total_xp"] = progress.get("total_xp", 0) + earned_xp
            progress["lessons_completed"] = len(progress["completed_lessons"])
        
        # Check for level up
        level_thresholds = [0, 100, 300, 600, 1000, 1500]
        current_xp = progress["total_xp"]
        new_level = 1
        for i, threshold in enumerate(level_thresholds):
            if current_xp >= threshold:
                new_level = i + 1
        
        progress["level"] = new_level
        
        # Add vocabulary to glossary
        self._add_vocabulary_to_glossary(user_id, language, lesson.get("vocabulary", []))
        
        # Save progress
        self._save_user_progress(user_id, language, progress)
        
        return {
            "success": True,
            "xp_earned": earned_xp,
            "total_xp": progress["total_xp"],
            "level": new_level,
            "next_lesson": self.get_next_lesson(user_id, language)
        }
    
    # ═══════════════════════════════════════════════════════════════════════════
    # PROGRESS TRACKING
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_user_progress(self, user_id: str, language: str) -> Dict:
        """Get user's progress for a specific language"""
        key = f"{user_id}_{language}"
        if key not in self.user_progress:
            self.user_progress[key] = {
                "user_id": user_id,
                "language": language,
                "level": 1,
                "total_xp": 0,
                "lessons_completed": 0,
                "completed_lessons": [],
                "words_learned": 0,
                "current_streak": 0,
                "last_practice": None
            }
        return self.user_progress[key]
    
    def _save_user_progress(self, user_id: str, language: str, progress: Dict):
        """Save user progress"""
        key = f"{user_id}_{language}"
        self.user_progress[key] = progress
    
    def update_streak(self, user_id: str, language: str) -> Dict:
        """Update user's practice streak"""
        progress = self.get_user_progress(user_id, language)
        
        today = datetime.now().date()
        last_practice = progress.get("last_practice")
        
        if last_practice:
            last_date = datetime.fromisoformat(last_practice).date()
            if last_date == today:
                # Already practiced today
                pass
            elif last_date == today - timedelta(days=1):
                # Consecutive day - increase streak
                progress["current_streak"] = progress.get("current_streak", 0) + 1
            else:
                # Streak broken
                progress["current_streak"] = 1
        else:
            progress["current_streak"] = 1
        
        progress["last_practice"] = today.isoformat()
        self._save_user_progress(user_id, language, progress)
        
        return {"streak": progress["current_streak"]}
    
    # ═══════════════════════════════════════════════════════════════════════════
    # GLOSSARY MANAGEMENT
    # ═══════════════════════════════════════════════════════════════════════════
    
    def get_user_glossary(self, user_id: str, language: str) -> Dict:
        """Get user's vocabulary glossary"""
        key = f"{user_id}_{language}"
        if key not in self.user_glossaries:
            self.user_glossaries[key] = {
                "words": [],
                "false_friends": [],
                "phrases": []
            }
        return self.user_glossaries[key]
    
    def _add_vocabulary_to_glossary(
        self,
        user_id: str,
        language: str,
        vocabulary: List[Dict]
    ):
        """Add vocabulary words to user's glossary"""
        glossary = self.get_user_glossary(user_id, language)
        
        existing_words = {w["word"] for w in glossary["words"]}
        
        for word in vocabulary:
            if word["word"] not in existing_words:
                glossary["words"].append({
                    **word,
                    "times_seen": 1,
                    "times_correct": 0,
                    "mastery": 0.0,
                    "added_at": datetime.now().isoformat()
                })
        
        # Update progress
        progress = self.get_user_progress(user_id, language)
        progress["words_learned"] = len(glossary["words"])
        self._save_user_progress(user_id, language, progress)
    
    def update_word_mastery(
        self,
        user_id: str,
        language: str,
        word: str,
        correct: bool
    ) -> Dict:
        """Update mastery level of a vocabulary word"""
        glossary = self.get_user_glossary(user_id, language)
        
        for w in glossary["words"]:
            if w["word"] == word:
                w["times_seen"] = w.get("times_seen", 0) + 1
                if correct:
                    w["times_correct"] = w.get("times_correct", 0) + 1
                
                # Calculate mastery (simple version - can use spaced repetition)
                w["mastery"] = w["times_correct"] / w["times_seen"]
                
                return {"word": word, "mastery": w["mastery"]}
        
        return {"error": "Word not found"}
    
    # ═══════════════════════════════════════════════════════════════════════════
    # AI-POWERED CONTENT GENERATION
    # ═══════════════════════════════════════════════════════════════════════════
    
    def generate_personalized_practice(
        self,
        user_id: str,
        language: str,
        focus_area: Optional[str] = None
    ) -> Dict:
        """Generate personalized practice based on user's weak areas"""
        glossary = self.get_user_glossary(user_id, language)
        progress = self.get_user_progress(user_id, language)
        
        # Find words that need practice (low mastery)
        weak_words = [
            w for w in glossary["words"]
            if w.get("mastery", 0) < 0.7
        ][:5]
        
        if not weak_words:
            weak_words = glossary["words"][:5]
        
        # Generate practice sentences using Claude
        try:
            prompt = f"""Generate 3 practice sentences in {language} that include these words:
            {', '.join([w['word'] for w in weak_words])}
            
            Format each as:
            - Sentence in {language}
            - English translation
            - Key vocabulary highlighted
            
            Make sentences appropriate for a {progress.get('level', 1)}/5 difficulty level.
            """
            
            response = self.anthropic.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            return {
                "practice_sentences": response.content[0].text,
                "focus_words": [w["word"] for w in weak_words],
                "difficulty": progress.get("level", 1)
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "focus_words": [w["word"] for w in weak_words]
            }


# Singleton instance
lesson_service = LessonService()
