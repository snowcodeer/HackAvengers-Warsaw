// ═══════════════════════════════════════════════════════════════════════════════
// GlossaryManager - Vocabulary Tracking & Mastery System
// ═══════════════════════════════════════════════════════════════════════════════

export class GlossaryManager {
  constructor() {
    this.vocabulary = {};
    this.falseFriends = {};
    this.phrases = {};
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('linguaWorlds_glossary');
      if (saved) {
        const data = JSON.parse(saved);
        this.vocabulary = data.vocabulary || {};
        this.falseFriends = data.falseFriends || {};
        this.phrases = data.phrases || {};
      }
    } catch (e) {
      console.warn('Failed to load glossary:', e);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('linguaWorlds_glossary', JSON.stringify({
        vocabulary: this.vocabulary,
        falseFriends: this.falseFriends,
        phrases: this.phrases,
      }));
    } catch (e) {
      console.warn('Failed to save glossary:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // VOCABULARY MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════
  
  addWord(language, wordData) {
    if (!this.vocabulary[language]) {
      this.vocabulary[language] = [];
    }
    
    // Check for duplicates
    const exists = this.vocabulary[language].some(
      w => w.word.toLowerCase() === wordData.word.toLowerCase()
    );
    
    if (!exists) {
      this.vocabulary[language].push({
        word: wordData.word,
        translation: wordData.translation,
        pronunciation: wordData.pronunciation || '',
        context: wordData.context || '',
        learnedAt: Date.now(),
        practiceCount: 0,
        correctCount: 0,
        mastery: 0,
      });
      
      this.saveToStorage();
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

  getTotalWords() {
    return Object.values(this.vocabulary).reduce(
      (total, langWords) => total + langWords.length,
      0
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // MASTERY TRACKING
  // ═══════════════════════════════════════════════════════════════════════════════
  
  updateMastery(language, word, correct) {
    const vocab = this.vocabulary[language];
    if (!vocab) return;
    
    const entry = vocab.find(w => w.word.toLowerCase() === word.toLowerCase());
    if (entry) {
      entry.practiceCount++;
      if (correct) entry.correctCount++;
      
      // Calculate mastery (0-100)
      entry.mastery = Math.min(100, Math.round(
        (entry.correctCount / entry.practiceCount) * 100
      ));
      
      this.saveToStorage();
    }
  }

  getMasteredWords(language) {
    const vocab = this.vocabulary[language] || [];
    return vocab.filter(w => w.mastery >= 80);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // FALSE FRIENDS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  addFalseFriend(language, data) {
    if (!this.falseFriends[language]) {
      this.falseFriends[language] = [];
    }
    
    const exists = this.falseFriends[language].some(
      f => f.word.toLowerCase() === data.word.toLowerCase()
    );
    
    if (!exists) {
      this.falseFriends[language].push({
        ...data,
        encounteredAt: Date.now(),
      });
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PHRASES
  // ═══════════════════════════════════════════════════════════════════════════════
  
  addPhrase(language, data) {
    if (!this.phrases[language]) {
      this.phrases[language] = [];
    }
    
    const exists = this.phrases[language].some(
      p => p.phrase.toLowerCase() === data.phrase.toLowerCase()
    );
    
    if (!exists) {
      this.phrases[language].push({
        ...data,
        learnedAt: Date.now(),
      });
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getStats(language) {
    const words = this.vocabulary[language] || [];
    const falseFriends = this.falseFriends[language] || [];
    const phrases = this.phrases[language] || [];
    
    const masteredCount = words.filter(w => w.mastery >= 80).length;
    const avgMastery = words.length > 0
      ? words.reduce((sum, w) => sum + w.mastery, 0) / words.length
      : 0;
    
    return {
      totalWords: words.length,
      masteredWords: masteredCount,
      averageMastery: Math.round(avgMastery),
      falseFriendsEncountered: falseFriends.length,
      phrasesLearned: phrases.length,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SEARCH & EXPORT
  // ═══════════════════════════════════════════════════════════════════════════════
  
  searchWords(language, query) {
    const vocab = this.vocabulary[language] || [];
    const q = query.toLowerCase();
    
    return vocab.filter(w =>
      w.word.toLowerCase().includes(q) ||
      w.translation.toLowerCase().includes(q)
    );
  }

  exportGlossary(language) {
    return {
      vocabulary: this.vocabulary[language] || [],
      falseFriends: this.falseFriends[language] || [],
      phrases: this.phrases[language] || [],
      exportedAt: Date.now(),
    };
  }

  clearLanguage(language) {
    delete this.vocabulary[language];
    delete this.falseFriends[language];
    delete this.phrases[language];
    this.saveToStorage();
  }

  clearAll() {
    this.vocabulary = {};
    this.falseFriends = {};
    this.phrases = {};
    this.saveToStorage();
  }
}

export default GlossaryManager;

