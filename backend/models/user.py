"""
═══════════════════════════════════════════════════════════════════════════════
LINGUAVERSE - User & Progress Models
Database models for user accounts, progress, glossary, and lesson tracking
═══════════════════════════════════════════════════════════════════════════════
"""

from datetime import datetime
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field, EmailStr
from enum import Enum
import uuid


class LanguageCode(str, Enum):
    """Supported languages"""
    FRENCH = "french"
    GERMAN = "german"
    SPANISH = "spanish"
    ITALIAN = "italian"
    JAPANESE = "japanese"
    MANDARIN = "mandarin"
    POLISH = "polish"
    ENGLISH = "english"


class ProficiencyLevel(str, Enum):
    """Language proficiency levels"""
    BEGINNER = "beginner"         # Level 1-2
    ELEMENTARY = "elementary"     # Level 2-3
    INTERMEDIATE = "intermediate" # Level 3-4
    ADVANCED = "advanced"         # Level 4-5
    FLUENT = "fluent"             # Level 5


# ═══════════════════════════════════════════════════════════════════════════
# USER MODELS
# ═══════════════════════════════════════════════════════════════════════════

class UserCreate(BaseModel):
    """Model for user registration"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=30)
    password: str = Field(..., min_length=8)
    display_name: Optional[str] = None
    native_language: str = "english"


class UserLogin(BaseModel):
    """Model for user login"""
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    """Public user profile"""
    id: str
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    native_language: str
    learning_languages: List[LanguageCode]
    total_xp: int
    current_streak: int
    longest_streak: int
    created_at: datetime
    last_active: datetime


class User(BaseModel):
    """Full user model (internal)"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    username: str
    display_name: str
    password_hash: str
    avatar_url: Optional[str] = None
    native_language: str = "english"
    learning_languages: List[LanguageCode] = []
    total_xp: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    daily_goal_minutes: int = 15
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: datetime = Field(default_factory=datetime.utcnow)
    settings: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        use_enum_values = True


# ═══════════════════════════════════════════════════════════════════════════
# VOCABULARY & GLOSSARY MODELS
# ═══════════════════════════════════════════════════════════════════════════

class VocabularyWord(BaseModel):
    """A word in the user's vocabulary"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    word: str
    translation: str
    pronunciation: str
    language: LanguageCode
    part_of_speech: str  # noun, verb, adjective, etc.
    example_sentence: Optional[str] = None
    example_translation: Optional[str] = None
    audio_url: Optional[str] = None
    image_url: Optional[str] = None
    tags: List[str] = []  # categories like "food", "greetings", etc.
    
    # Learning metrics
    times_seen: int = 0
    times_correct: int = 0
    times_incorrect: int = 0
    last_practiced: Optional[datetime] = None
    mastery_level: float = 0.0  # 0-1, based on spaced repetition
    next_review: Optional[datetime] = None


class FalseFriend(BaseModel):
    """A false friend word (looks similar but means different)"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    word: str
    language: LanguageCode
    looks_like: str
    actual_meaning: str
    warning: str
    example_mistake: Optional[str] = None
    correct_alternative: Optional[str] = None


class Phrase(BaseModel):
    """A useful phrase"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    phrase: str
    translation: str
    pronunciation: str
    language: LanguageCode
    context: str  # When to use this phrase
    formality: str  # formal, informal, neutral
    audio_url: Optional[str] = None
    tags: List[str] = []


class UserGlossary(BaseModel):
    """User's personal glossary"""
    user_id: str
    language: LanguageCode
    words: List[VocabularyWord] = []
    false_friends: List[FalseFriend] = []
    phrases: List[Phrase] = []
    custom_notes: Dict[str, str] = {}  # word_id -> personal notes
    
    # Statistics
    total_words_learned: int = 0
    words_mastered: int = 0  # mastery_level >= 0.8
    last_updated: datetime = Field(default_factory=datetime.utcnow)


# ═══════════════════════════════════════════════════════════════════════════
# LESSON & PROGRESS MODELS
# ═══════════════════════════════════════════════════════════════════════════

class LessonObjective(BaseModel):
    """A single objective within a lesson"""
    id: str
    description: str
    completed: bool = False
    xp_reward: int = 10


class Lesson(BaseModel):
    """A structured lesson"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    language: LanguageCode
    unit_number: int
    lesson_number: int
    difficulty_level: int  # 1-5
    
    # Content
    objectives: List[LessonObjective]
    vocabulary: List[str]  # VocabularyWord IDs
    phrases: List[str]  # Phrase IDs
    grammar_points: List[str]
    cultural_notes: List[str]
    
    # Scenarios for conversation practice
    scenarios: List[Dict[str, Any]] = []
    
    # Rewards
    xp_reward: int = 50
    estimated_minutes: int = 10
    
    # Prerequisites
    prerequisites: List[str] = []  # Lesson IDs


class LessonProgress(BaseModel):
    """User's progress on a specific lesson"""
    user_id: str
    lesson_id: str
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    objectives_completed: List[str] = []  # Objective IDs
    score: float = 0.0  # 0-100
    time_spent_seconds: int = 0
    attempts: int = 1
    
    # Conversation performance
    conversation_turns: int = 0
    pronunciation_scores: List[float] = []
    vocabulary_accuracy: float = 0.0


class LanguageProgress(BaseModel):
    """User's overall progress in a language"""
    user_id: str
    language: LanguageCode
    
    # Level
    current_level: int = 1  # 1-5
    current_xp: int = 0
    xp_to_next_level: int = 100
    
    # Proficiency
    proficiency: ProficiencyLevel = ProficiencyLevel.BEGINNER
    
    # Statistics
    lessons_completed: int = 0
    total_lessons: int = 0
    words_learned: int = 0
    phrases_learned: int = 0
    conversation_minutes: int = 0
    
    # Streaks
    current_streak: int = 0
    longest_streak: int = 0
    last_practice_date: Optional[datetime] = None
    
    # Lesson completion
    completed_lessons: List[str] = []  # Lesson IDs
    current_lesson_id: Optional[str] = None
    
    # Performance metrics
    average_pronunciation_score: float = 0.0
    average_comprehension_score: float = 0.0


# ═══════════════════════════════════════════════════════════════════════════
# CONVERSATION MODELS
# ═══════════════════════════════════════════════════════════════════════════

class ConversationMessage(BaseModel):
    """A single message in a conversation"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str  # "user" or "assistant" (character)
    content: str
    translation: Optional[str] = None
    audio_url: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # For user messages
    pronunciation_score: Optional[float] = None
    corrections: Optional[List[str]] = None
    
    # For assistant messages
    expression: Optional[str] = None
    teaching_moment: Optional[str] = None


class Conversation(BaseModel):
    """A conversation session with a character"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    character_id: str
    language: LanguageCode
    scene: str  # Scene name
    
    # Messages
    messages: List[ConversationMessage] = []
    
    # Session info
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    difficulty_level: int = 1
    
    # Metrics
    total_turns: int = 0
    user_turns: int = 0
    average_pronunciation: float = 0.0
    words_practiced: List[str] = []
    new_words_introduced: List[str] = []


# ═══════════════════════════════════════════════════════════════════════════
# ACHIEVEMENT & GAMIFICATION MODELS
# ═══════════════════════════════════════════════════════════════════════════

class Achievement(BaseModel):
    """An achievement/badge"""
    id: str
    name: str
    description: str
    icon: str
    category: str  # streak, vocabulary, conversation, etc.
    xp_reward: int
    requirement: Dict[str, Any]  # What's needed to earn this


class UserAchievement(BaseModel):
    """Achievement earned by a user"""
    user_id: str
    achievement_id: str
    earned_at: datetime = Field(default_factory=datetime.utcnow)
    progress: float = 1.0  # 0-1 for partial progress


class DailyChallenge(BaseModel):
    """A daily challenge for extra XP"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: datetime
    description: str
    language: Optional[LanguageCode] = None  # None = any language
    goal: Dict[str, Any]
    xp_reward: int
    bonus_xp: int  # If completed perfectly


# ═══════════════════════════════════════════════════════════════════════════
# API RESPONSE MODELS
# ═══════════════════════════════════════════════════════════════════════════

class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserProfile


class ProgressResponse(BaseModel):
    """Response with user's progress"""
    language: LanguageCode
    level: int
    xp: int
    xp_to_next: int
    streak: int
    proficiency: ProficiencyLevel
    stats: Dict[str, Any]


class LessonResponse(BaseModel):
    """Response with lesson details"""
    lesson: Lesson
    progress: Optional[LessonProgress]
    next_lesson: Optional[str]
    is_unlocked: bool


class ConversationResponse(BaseModel):
    """Response from conversation endpoint"""
    message: ConversationMessage
    conversation_id: str
    character_name: str
    audio_url: Optional[str]
    pronunciation_feedback: Optional[Dict[str, Any]]
    new_words: List[VocabularyWord]
    xp_earned: int

