// ═══════════════════════════════════════════════════════════════════════════════
// LINGUAVERSE - Unified API Client
// Standardized backend communication for all frontend modules
// ═══════════════════════════════════════════════════════════════════════════════

const API_BASE_URL = 'http://localhost:8000';

/**
 * Unified API Client for LinguaVerse
 * 
 * Provides clean, typed access to all backend endpoints:
 * - Voice (TTS, STT, Pronunciation)
 * - Conversation (Multi-turn AI dialogue)
 * - Lessons & Progress
 * - Glossary
 */
class APIClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.sessionId = null;
    this.userId = 'default_user';
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════════

  setUserId(userId) {
    this.userId = userId;
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CORE HTTP METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, value);
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async post(endpoint, data = {}, isFormData = false) {
    const options = {
      method: 'POST',
    };

    if (isFormData) {
      options.body = data; // FormData
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    // Check if response is audio
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('audio')) {
      return response.blob();
    }

    return response.json();
  }

  async postForAudio(endpoint, data = {}, isFormData = false) {
    const options = {
      method: 'POST',
    };

    if (isFormData) {
      options.body = data;
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.blob();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // VOICE API
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Convert text to speech
   * @param {string} text - Text to speak
   * @param {object} options - Voice options (characterId, expression, language)
   * @returns {Promise<Blob>} Audio blob
   */
  async speak(text, options = {}) {
    const { characterId = 'amelie', expression = null, language = 'french' } = options;

    return this.postForAudio('/api/speak', {
      text,
      character_id: characterId,
      expression,
      language,
    });
  }

  /**
   * Stream text to speech for real-time playback
   * @param {string} text - Text to speak
   * @param {object} options - Voice options
   * @returns {Promise<Response>} Streaming response
   */
  async speakStream(text, options = {}) {
    const { characterId = 'amelie', expression = null } = options;

    const response = await fetch(`${this.baseUrl}/api/speak/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        character_id: characterId,
        expression,
      }),
    });

    return response;
  }

  /**
   * Transcribe audio to text
   * @param {Blob} audioBlob - Audio blob to transcribe
   * @param {string} language - Language hint
   * @returns {Promise<{text: string, confidence: number}>}
   */
  async transcribe(audioBlob, language = null) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    if (language) {
      formData.append('language', language);
    }

    return this.post('/api/transcribe', formData, true);
  }

  /**
   * Assess pronunciation
   * @param {Blob} audioBlob - Audio of user's speech
   * @param {string} targetText - What they should have said
   * @param {string} language - Language code
   * @returns {Promise<{accuracy: number, issues: string[], suggestions: string[]}>}
   */
  async assessPronunciation(audioBlob, targetText, language = 'french') {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('target_text', targetText);
    formData.append('language', language);

    return this.post('/api/pronunciation/assess', formData, true);
  }

  /**
   * Generate a sound effect
   * @param {string} description - Description of the sound
   * @param {number} duration - Duration in seconds
   * @returns {Promise<Blob>} Audio blob
   */
  async generateSoundEffect(description, duration = 2.0) {
    return this.postForAudio(`/api/sound-effect?description=${encodeURIComponent(description)}&duration=${duration}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONVERSATION API
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Start a new conversation
   * @param {object} config - Conversation config
   * @returns {Promise<{sessionId: string, greeting: string}>}
   */
  async startConversation(config = {}) {
    const {
      language = 'french',
      languageName = 'French',
      characterId = 'amelie',
      scenarioId = null,
      difficultyLevel = 1,
    } = config;

    const response = await this.post('/api/conversation/start', {
      language,
      language_name: languageName,
      character_id: characterId,
      scenario_id: scenarioId,
      difficulty_level: difficultyLevel,
      user_id: this.userId,
    });

    this.sessionId = response.session_id;
    return {
      sessionId: response.session_id,
      greeting: response.greeting,
      translation: response.translation,
    };
  }

  /**
   * Send a text message in the conversation
   * @param {string} userInput - User's message
   * @param {object} context - Conversation context
   * @returns {Promise<{response: string, translation: string, correction: string}>}
   */
  async sendMessage(userInput, context = {}) {
    const {
      language = 'french',
      languageName = 'French',
      character = null,
      scenario = null,
      difficulty = { level: 1 },
      conversationHistory = [],
    } = context;

    return this.post('/api/conversation/respond', {
      language,
      language_name: languageName,
      user_input: userInput,
      conversation_history: conversationHistory,
      character,
      scenario,
      difficulty,
      session_id: this.sessionId,
      user_id: this.userId,
    });
  }

  /**
   * Full voice conversation turn - send audio, get audio response
   * @param {Blob} audioBlob - User's audio
   * @param {object} options - Options (language, characterId, difficultyLevel)
   * @returns {Promise<Blob>} Response audio
   */
  async voiceConversation(audioBlob, options = {}) {
    const {
      language = 'french',
      characterId = 'amelie',
      difficultyLevel = 1,
    } = options;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', language);
    formData.append('character_id', characterId);
    formData.append('difficulty_level', difficultyLevel.toString());
    if (this.sessionId) {
      formData.append('session_id', this.sessionId);
    }

    return this.postForAudio('/api/conversation/voice/respond', formData, true);
  }

  /**
   * Full voice conversation with detailed JSON response
   * @param {Blob} audioBlob - User's audio
   * @param {object} options - Options
   * @returns {Promise<{transcription: string, response: string, audioUrl: string}>}
   */
  async voiceConversationFull(audioBlob, options = {}) {
    const {
      language = 'french',
      characterId = 'amelie',
      difficultyLevel = 1,
    } = options;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', language);
    formData.append('character_id', characterId);
    formData.append('difficulty_level', difficultyLevel.toString());
    if (this.sessionId) {
      formData.append('session_id', this.sessionId);
    }

    const result = await this.post('/api/conversation/voice/respond/full', formData, true);
    
    if (result.session_id) {
      this.sessionId = result.session_id;
    }
    
    return result;
  }

  /**
   * Get conversation hint
   * @param {string} language - Language code
   * @returns {Promise<{phrase: string, translation: string, tip: string}>}
   */
  async getHint(language = 'french') {
    if (!this.sessionId) {
      throw new Error('No active session');
    }
    return this.get(`/api/conversation/hint/${this.sessionId}`, { language });
  }

  /**
   * End the current conversation
   */
  async endConversation() {
    if (!this.sessionId) return;
    
    try {
      await fetch(`${this.baseUrl}/api/conversation/session/${this.sessionId}`, {
        method: 'DELETE',
      });
    } finally {
      this.sessionId = null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // LESSON & PROGRESS API
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get lesson plan for a language
   * @param {string} language - Language code
   * @returns {Promise<{lessons: Array}>}
   */
  async getLessonPlan(language) {
    return this.get(`/api/lessons/${language}`);
  }

  /**
   * Get a specific lesson
   * @param {string} language - Language code
   * @param {string} lessonId - Lesson ID
   * @returns {Promise<object>}
   */
  async getLesson(language, lessonId) {
    return this.get(`/api/lessons/${language}/${lessonId}`);
  }

  /**
   * Get next available lesson
   * @param {string} language - Language code
   * @returns {Promise<object>}
   */
  async getNextLesson(language) {
    return this.get(`/api/lessons/${language}/next`, { user_id: this.userId });
  }

  /**
   * Mark a lesson as complete
   * @param {string} lessonId - Lesson ID
   * @param {number} score - Score achieved
   * @param {number} timeSpent - Time in seconds
   * @returns {Promise<object>}
   */
  async completeLesson(lessonId, score = 100, timeSpent = 600) {
    return this.post(`/api/lessons/${lessonId}/complete?user_id=${this.userId}&score=${score}&time_spent=${timeSpent}`);
  }

  /**
   * Get user progress for a language
   * @param {string} language - Language code
   * @returns {Promise<object>}
   */
  async getProgress(language) {
    return this.get(`/api/progress/${language}`, { user_id: this.userId });
  }

  /**
   * Get progress for all languages
   * @returns {Promise<object>}
   */
  async getAllProgress() {
    return this.get('/api/progress', { user_id: this.userId });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // GLOSSARY API
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get user's vocabulary glossary
   * @param {string} language - Language code
   * @returns {Promise<{words: Array}>}
   */
  async getGlossary(language) {
    return this.get(`/api/glossary/${language}`, { user_id: this.userId });
  }

  /**
   * Record vocabulary practice result
   * @param {string} language - Language code
   * @param {string} word - Word practiced
   * @param {boolean} correct - Whether answer was correct
   * @returns {Promise<object>}
   */
  async practiceWord(language, word, correct) {
    return this.post(`/api/glossary/${language}/word/${encodeURIComponent(word)}/practice?correct=${correct}&user_id=${this.userId}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CHARACTER & LANGUAGE INFO
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get all available languages
   * @returns {Promise<{languages: Array}>}
   */
  async getLanguages() {
    return this.get('/api/languages');
  }

  /**
   * Get all characters
   * @returns {Promise<{characters: Array}>}
   */
  async getCharacters() {
    return this.get('/api/characters');
  }

  /**
   * Get specific character info
   * @param {string} characterId - Character ID
   * @returns {Promise<object>}
   */
  async getCharacter(characterId) {
    return this.get(`/api/characters/${characterId}`);
  }

  /**
   * Get difficulty level info
   * @returns {Promise<{levels: Array}>}
   */
  async getDifficultyLevels() {
    return this.get('/api/difficulty');
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // UTILITY
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Health check
   * @returns {Promise<{status: string}>}
   */
  async healthCheck() {
    return this.get('/health');
  }

  /**
   * Get API info
   * @returns {Promise<object>}
   */
  async getInfo() {
    return this.get('/');
  }
}

// Export singleton instance and class
export const apiClient = new APIClient();
export { APIClient };
export default apiClient;

