// ═══════════════════════════════════════════════════════════════════════════════
// ConversationEngine - AI-Powered Language Conversation System
// Integrates ElevenLabs TTS/STT with Claude for intelligent responses
// ═══════════════════════════════════════════════════════════════════════════════

export class ConversationEngine {
  constructor(languageConfig, glossaryManager, progressionSystem, voiceManager) {
    this.config = languageConfig;
    this.glossary = glossaryManager;
    this.progression = progressionSystem;
    this.voice = voiceManager;

    // Conversation state
    this.currentScenario = null;
    this.conversationHistory = [];
    this.turnCount = 0;
    this.objectivesCompleted = new Set();

    // Difficulty tracking
    this.currentLevel = 1;
    this.turnsUntilLevelUp = 10;

    // Event callbacks
    this.onMessage = null;
    this.onCorrection = null;
    this.onNewVocabulary = null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SCENARIO MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  async startScenario(scenario) {
    this.currentScenario = scenario;
    this.conversationHistory = [];
    this.turnCount = 0;
    this.objectivesCompleted = new Set();

    // Generate initial greeting based on difficulty
    const greeting = await this.generateGreeting();

    // Add to history
    this.conversationHistory.push({
      role: 'assistant',
      content: greeting.text,
      translation: greeting.translation,
    });

    // Speak the greeting
    if (this.voice) {
      await this.voice.speak(greeting.text, this.config.code);
    }

    // Notify UI
    if (this.onMessage) {
      this.onMessage({
        type: 'npc',
        text: greeting.text,
        translation: greeting.translation,
        character: this.config.character,
      });
    }

    return greeting;
  }

  async generateGreeting() {
    const character = this.config.character;
    const difficulty = this.getDifficulty();

    // Select appropriate greeting based on level
    const greetings = character.greetings || [];
    const appropriateGreeting = greetings.find(g => g.level === this.currentLevel) ||
      greetings[0] ||
      { text: `Welcome! I'm ${character.name}.`, level: 1 };

    // For higher levels, try to get a dynamic greeting from the backend
    if (this.currentLevel >= 2) {
      try {
        const response = await this.callBackend('/api/generate-greeting', {
          language: this.config.code,
          character: character.name,
          personality: character.personality?.background,
          scenario: this.currentScenario?.title,
          level: this.currentLevel,
          englishPercent: difficulty.english,
          targetPercent: difficulty.target,
        });

        if (response && response.greeting) {
          return {
            text: response.greeting,
            translation: response.translation,
          };
        }
      } catch (e) {
        console.warn('Failed to generate dynamic greeting:', e);
      }
    }

    return {
      text: appropriateGreeting.text,
      translation: null,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // MESSAGE PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════════

  async processUserInput(audioBlob) {
    if (!this.currentScenario) {
      console.error('No active scenario');
      return null;
    }

    // Step 1: Transcribe audio
    const transcription = await this.transcribeAudio(audioBlob);
    if (!transcription) {
      return { error: 'Could not transcribe audio' };
    }

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: transcription,
    });

    // Notify UI of user message
    if (this.onMessage) {
      this.onMessage({
        type: 'player',
        text: transcription,
      });
    }

    // Step 2: Generate NPC response
    const response = await this.generateResponse(transcription);

    // Add to history
    this.conversationHistory.push({
      role: 'assistant',
      content: response.text,
      translation: response.translation,
    });

    // Step 3: Speak the response
    if (this.voice) {
      await this.voice.speak(response.text, this.config.code);
    }

    // Step 4: Handle corrections
    if (response.correction && this.onCorrection) {
      this.onCorrection(response.correction);
    }

    // Step 5: Handle new vocabulary
    if (response.newVocabulary && response.newVocabulary.length > 0) {
      response.newVocabulary.forEach(word => {
        this.glossary.addWord(this.config.code, word);
      });

      if (this.onNewVocabulary) {
        this.onNewVocabulary(response.newVocabulary);
      }
    }

    // Step 6: Update progress
    this.turnCount++;
    this.progression.addXP(10);

    // Check for difficulty increase
    if (this.turnCount % this.turnsUntilLevelUp === 0 && this.currentLevel < 5) {
      this.currentLevel++;
    }

    // Notify UI
    if (this.onMessage) {
      this.onMessage({
        type: 'npc',
        text: response.text,
        translation: response.translation,
        character: this.config.character,
        correction: response.correction,
        encouragement: response.encouragement,
      });
    }

    return {
      transcription,
      response: response.text,
      translation: response.translation,
      correction: response.correction,
      newVocabulary: response.newVocabulary,
      turnCount: this.turnCount,
      objectivesComplete: this.checkObjectivesComplete(),
    };
  }

  async transcribeAudio(audioBlob) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('http://localhost:8000/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.text || data.transcription;
      }
    } catch (e) {
      console.error('Transcription error:', e);
    }

    return null;
  }

  async generateResponse(userInput) {
    const difficulty = this.getDifficulty();
    const character = this.config.character;

    try {
      const response = await this.callBackend('/api/conversation/respond', {
        language: this.config.code,
        languageName: this.config.name,
        character: {
          name: character.name,
          role: character.role,
          personality: character.personality?.background,
        },
        scenario: this.currentScenario,
        userInput,
        conversationHistory: this.conversationHistory.slice(-10), // Last 10 messages
        difficulty: {
          level: this.currentLevel,
          englishPercent: difficulty.english,
          targetPercent: difficulty.target,
          grammarFocus: difficulty.grammar,
        },
      });

      if (response) {
        return {
          text: response.response || response.text,
          translation: response.translation,
          correction: response.correction,
          newVocabulary: response.newVocabulary || [],
          encouragement: response.encouragement,
        };
      }
    } catch (e) {
      console.error('Response generation error:', e);
    }

    // Fallback response
    return {
      text: this.getFallbackResponse(),
      translation: null,
      correction: null,
      newVocabulary: [],
    };
  }

  getFallbackResponse() {
    const fallbacks = [
      `That's great! Let's continue practicing ${this.config.name}.`,
      `Good effort! Keep going!`,
      `Nice try! Let's keep learning together.`,
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // DIFFICULTY SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  getDifficulty() {
    const scaling = this.config.difficultyScaling;
    return scaling?.[`level${this.currentLevel}`] || {
      english: 80,
      target: 20,
      grammar: 'basic',
      focus: 'survival phrases',
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // HINTS & HELP
  // ═══════════════════════════════════════════════════════════════════════════════

  async getHint() {
    if (!this.currentScenario) return null;

    const objectives = this.currentScenario.objectives || [];
    const nextObjective = objectives.find((_, i) => !this.objectivesCompleted.has(i));

    // Get suggested phrases for current level
    const vocabulary = this.config.vocabulary?.basic || [];
    const randomVocab = vocabulary[Math.floor(Math.random() * vocabulary.length)];

    return {
      objective: nextObjective || 'Continue the conversation naturally',
      suggestedPhrase: randomVocab,
      tip: `Try using "${randomVocab?.word}" (${randomVocab?.translation})`,
    };
  }

  checkObjectivesComplete() {
    if (!this.currentScenario?.objectives) return false;
    return this.objectivesCompleted.size >= this.currentScenario.objectives.length;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // BACKEND COMMUNICATION
  // ═══════════════════════════════════════════════════════════════════════════════

  async callBackend(endpoint, data) {
    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.error('Backend call failed:', e);
    }

    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════════

  endConversation() {
    // Record conversation stats
    this.progression.recordConversation({
      language: this.config.code,
      scenario: this.currentScenario?.id,
      turns: this.turnCount,
      wordsLearned: this.glossary.getWords(this.config.code).length,
    });

    this.currentScenario = null;
    this.conversationHistory = [];
    this.turnCount = 0;
  }

  dispose() {
    this.endConversation();
  }
}

export default ConversationEngine;

