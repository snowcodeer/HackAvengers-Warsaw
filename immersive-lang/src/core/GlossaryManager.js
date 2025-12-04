// GlossaryManager - Tracks learned vocabulary and false friends

export class GlossaryManager {
  constructor() {
    this.vocabulary = this.loadFromStorage() || {};
    this.falseFriends = {};
    this.phrases = {};
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('linguaWorlds_glossary');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('linguaWorlds_glossary', JSON.stringify(this.vocabulary));
    } catch (error) {
      console.warn('Failed to save glossary:', error);
    }
  }

  addWord(language, wordData) {
    if (!this.vocabulary[language]) {
      this.vocabulary[language] = [];
    }
    
    // Check if word already exists
    const exists = this.vocabulary[language].some(
      w => w.word.toLowerCase() === wordData.word.toLowerCase()
    );
    
    if (!exists) {
      this.vocabulary[language].push({
        ...wordData,
        learnedAt: Date.now(),
        practiceCount: 0,
        mastery: 0
      });
      
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  addFalseFriend(language, falseFriendData) {
    if (!this.falseFriends[language]) {
      this.falseFriends[language] = [];
    }
    
    const exists = this.falseFriends[language].some(
      f => f.word.toLowerCase() === falseFriendData.word.toLowerCase()
    );
    
    if (!exists) {
      this.falseFriends[language].push({
        ...falseFriendData,
        encounteredAt: Date.now()
      });
      return true;
    }
    
    return false;
  }

  addPhrase(language, phraseData) {
    if (!this.phrases[language]) {
      this.phrases[language] = [];
    }
    
    const exists = this.phrases[language].some(
      p => p.phrase.toLowerCase() === phraseData.phrase.toLowerCase()
    );
    
    if (!exists) {
      this.phrases[language].push({
        ...phraseData,
        learnedAt: Date.now()
      });
      return true;
    }
    
    return false;
  }

  getWords(language, type = 'learned') {
    switch (type) {
      case 'learned':
        return this.vocabulary[language] || [];
      case 'false-friends':
        return this.falseFriends[language] || [];
      case 'phrases':
        return this.phrases[language] || [];
      default:
        return [];
    }
  }

  updateMastery(language, word, correct) {
    const vocab = this.vocabulary[language];
    if (!vocab) return;
    
    const entry = vocab.find(w => w.word.toLowerCase() === word.toLowerCase());
    if (entry) {
      entry.practiceCount++;
      entry.mastery = Math.min(100, entry.mastery + (correct ? 10 : -5));
      this.saveToStorage();
    }
  }

  getStats(language) {
    const words = this.vocabulary[language] || [];
    const falseFriends = this.falseFriends[language] || [];
    const phrases = this.phrases[language] || [];
    
    const masteredWords = words.filter(w => w.mastery >= 80).length;
    const averageMastery = words.length > 0
      ? words.reduce((sum, w) => sum + w.mastery, 0) / words.length
      : 0;
    
    return {
      totalWords: words.length,
      masteredWords,
      averageMastery: Math.round(averageMastery),
      falseFriendsEncountered: falseFriends.length,
      phrasesLearned: phrases.length
    };
  }

  exportGlossary(language) {
    return {
      vocabulary: this.vocabulary[language] || [],
      falseFriends: this.falseFriends[language] || [],
      phrases: this.phrases[language] || [],
      exportedAt: Date.now()
    };
  }

  searchWord(language, query) {
    const vocab = this.vocabulary[language] || [];
    return vocab.filter(w => 
      w.word.toLowerCase().includes(query.toLowerCase()) ||
      w.translation.toLowerCase().includes(query.toLowerCase())
    );
  }
}

