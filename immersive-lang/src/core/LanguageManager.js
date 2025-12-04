// LanguageManager - Handles lesson generation via Claude API

export class LanguageManager {
  constructor(langCode, config) {
    this.langCode = langCode;
    this.config = config;
    this.currentLevel = 1;
    this.lessons = [];
    this.currentScenario = null;
    this.vocabularyPool = [];
    this.grammarTopics = [];
  }

  async generateInitialLessons() {
    // Generate initial lesson content based on language and level
    const scenario = await this.generateScenario();
    this.currentScenario = scenario;
    return scenario;
  }

  async generateScenario() {
    const difficultyConfig = this.config.difficultyScaling[`level${this.currentLevel}`];
    
    const prompt = `You are creating an immersive language learning scenario for ${this.config.name}.

SETTING: ${this.config.location}
CHARACTER: ${this.config.character.name}, a ${this.config.character.role}
PERSONALITY: ${this.config.character.personality}

DIFFICULTY LEVEL: ${this.currentLevel}/5
- English percentage: ${difficultyConfig.english}%
- ${this.config.name} percentage: ${difficultyConfig.target}%
- Grammar focus: ${difficultyConfig.grammar}

Generate a JSON response with:
{
  "greeting": "Character's opening line mixing English and ${this.config.name} based on percentages",
  "scenario": "Brief description of the current situation",
  "objectives": ["List of 3 conversation objectives for the player"],
  "keyVocabulary": [
    {"word": "target word", "translation": "english", "pronunciation": "phonetic"}
  ],
  "suggestedResponses": [
    {"phrase": "in target language", "translation": "in english"}
  ],
  "culturalNote": "An interesting cultural fact relevant to the setting"
}

Make the scenario natural and engaging, gradually introducing ${this.config.name} words while maintaining comprehension.`;

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          language: this.langCode,
          level: this.currentLevel
        })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to generate scenario, using fallback:', error);
    }
    
    // Fallback scenario based on config
    return this.getFallbackScenario();
  }

  getFallbackScenario() {
    const { character, startingPhrases, location } = this.config;
    
    return {
      greeting: `${startingPhrases[0].phrase}! Welcome to ${location}. I'm ${character.name}. Let me teach you some ${this.config.name}!`,
      scenario: `You've just walked into ${location}. ${character.name} greets you warmly.`,
      objectives: [
        'Greet the character',
        'Learn to order something',
        'Thank them and say goodbye'
      ],
      keyVocabulary: startingPhrases.map(p => ({
        word: p.phrase,
        translation: p.translation,
        pronunciation: p.pronunciation
      })),
      suggestedResponses: startingPhrases.slice(0, 2),
      culturalNote: `In ${this.config.nativeName}-speaking cultures, greetings are important for building rapport!`
    };
  }

  async generateResponse(userInput, conversationHistory) {
    const difficultyConfig = this.config.difficultyScaling[`level${this.currentLevel}`];
    
    const prompt = `You are ${this.config.character.name}, a ${this.config.character.role} at ${this.config.location}.
PERSONALITY: ${this.config.character.personality}

CONVERSATION HISTORY:
${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}

USER SAID: "${userInput}"

CURRENT DIFFICULTY: Level ${this.currentLevel}/5
- Use ${difficultyConfig.english}% English, ${difficultyConfig.target}% ${this.config.name}
- Grammar focus: ${difficultyConfig.grammar}

Respond naturally as ${this.config.character.name}. Include:
1. A natural response mixing languages according to difficulty
2. If the user made a grammar/pronunciation error, gently correct them
3. Encourage their progress

Return JSON:
{
  "response": "Your character's response",
  "translation": "English translation if needed",
  "correction": {
    "original": "what they said wrong (if any)",
    "corrected": "the correct version",
    "explanation": "brief explanation"
  } or null,
  "newVocabulary": [{"word": "...", "translation": "...", "pronunciation": "..."}] or [],
  "encouragement": "A brief encouraging comment"
}`;

    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          language: this.langCode,
          level: this.currentLevel,
          userInput,
          history: conversationHistory
        })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to get response:', error);
    }
    
    // Fallback response
    return {
      response: `That's great! Let's continue practicing ${this.config.name}!`,
      translation: null,
      correction: null,
      newVocabulary: [],
      encouragement: 'Keep up the good work!'
    };
  }

  incrementLevel() {
    if (this.currentLevel < 5) {
      this.currentLevel++;
      return true;
    }
    return false;
  }

  getCurrentDifficulty() {
    return this.config.difficultyScaling[`level${this.currentLevel}`];
  }

  getStartingPhrases() {
    return this.config.startingPhrases;
  }

  getFalseFriends() {
    return this.config.falseFriends;
  }
}

