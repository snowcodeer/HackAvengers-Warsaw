// ═══════════════════════════════════════════════════════════════════════════════
// ProgressionSystem - XP, Levels, Achievements & Streaks
// ═══════════════════════════════════════════════════════════════════════════════

export class ProgressionSystem {
  constructor() {
    this.data = {
      xp: 0,
      level: 1,
      totalXP: 0,
      conversations: [],
      achievements: [],
      streaks: {
        current: 0,
        best: 0,
        lastPractice: null,
      },
    };

    // Level scaling
    this.baseXP = 100;
    this.levelMultiplier = 1.5;

    // Achievement definitions
    this.achievementDefs = [
      // Level achievements
      { id: 'level5', name: 'Apprentice', icon: '🌱', requirement: { type: 'level', value: 5 } },
      { id: 'level10', name: 'Student', icon: '📚', requirement: { type: 'level', value: 10 } },
      { id: 'level25', name: 'Scholar', icon: '🎓', requirement: { type: 'level', value: 25 } },
      { id: 'level50', name: 'Master', icon: '👑', requirement: { type: 'level', value: 50 } },

      // Streak achievements
      { id: 'streak7', name: 'Week Warrior', icon: '🔥', requirement: { type: 'streak', value: 7 } },
      { id: 'streak30', name: 'Month Master', icon: '💪', requirement: { type: 'streak', value: 30 } },
      { id: 'streak100', name: 'Centurion', icon: '🏆', requirement: { type: 'streak', value: 100 } },

      // Conversation achievements
      { id: 'conv10', name: 'Chatterbox', icon: '💬', requirement: { type: 'conversations', value: 10 } },
      { id: 'conv50', name: 'Conversationalist', icon: '🗣️', requirement: { type: 'conversations', value: 50 } },
      { id: 'conv100', name: 'Polyglot', icon: '🌍', requirement: { type: 'conversations', value: 100 } },

      // Word achievements
      { id: 'words50', name: 'Word Collector', icon: '📖', requirement: { type: 'words', value: 50 } },
      { id: 'words200', name: 'Vocabulary Builder', icon: '📗', requirement: { type: 'words', value: 200 } },
      { id: 'words500', name: 'Lexicon Master', icon: '📕', requirement: { type: 'words', value: 500 } },
    ];

    this.loadFromStorage();
  }

  async loadFromStorage() {
    try {
      // Try loading from API first
      const userId = localStorage.getItem('userId') || 'default_user';
      try {
        const response = await fetch(`http://localhost:8000/api/progress/load/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.status !== 'no_data') {
            this.data = { ...this.data, ...data };
            console.log('Progress loaded from API');
            return;
          }
        }
      } catch (err) {
        console.warn('API load failed, falling back to local storage', err);
      }

      const saved = localStorage.getItem('linguaWorlds_progress');
      if (saved) {
        this.data = { ...this.data, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load progression:', e);
    }
  }

  async saveToStorage() {
    try {
      localStorage.setItem('linguaWorlds_progress', JSON.stringify(this.data));

      // Save to API
      const userId = localStorage.getItem('userId') || 'default_user';
      try {
        await fetch('http://localhost:8000/api/progress/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            data: this.data
          })
        });
      } catch (err) {
        console.warn('API save failed', err);
      }
    } catch (e) {
      console.warn('Failed to save progression:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // XP & LEVELS
  // ═══════════════════════════════════════════════════════════════════════════════

  getRequiredXP(level = this.data.level) {
    return Math.floor(this.baseXP * Math.pow(this.levelMultiplier, level - 1));
  }

  addXP(amount) {
    this.data.xp += amount;
    this.data.totalXP += amount;
    this.checkLevelUp();
    this.saveToStorage();
    return this.data.xp;
  }

  checkLevelUp() {
    const required = this.getRequiredXP();
    let leveledUp = false;

    while (this.data.xp >= required) {
      this.data.xp -= this.getRequiredXP();
      this.data.level++;
      leveledUp = true;
    }

    if (leveledUp) {
      this.checkAchievements();
      this.saveToStorage();
    }

    return leveledUp;
  }

  getLevel() {
    return this.data.level;
  }

  getXP() {
    return this.data.xp;
  }

  getXPProgress() {
    const required = this.getRequiredXP();
    return {
      current: this.data.xp,
      required,
      percent: Math.round((this.data.xp / required) * 100),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STREAKS
  // ═══════════════════════════════════════════════════════════════════════════════

  updateStreak() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    if (this.data.streaks.lastPractice) {
      const lastDate = new Date(this.data.streaks.lastPractice);
      const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()).getTime();
      const daysDiff = (today - lastDay) / (1000 * 60 * 60 * 24);

      if (daysDiff === 0) {
        // Same day - no change
      } else if (daysDiff === 1) {
        // Consecutive day - increase streak
        this.data.streaks.current++;
      } else {
        // Streak broken
        this.data.streaks.current = 1;
      }
    } else {
      // First practice
      this.data.streaks.current = 1;
    }

    // Update best streak
    if (this.data.streaks.current > this.data.streaks.best) {
      this.data.streaks.best = this.data.streaks.current;
    }

    this.data.streaks.lastPractice = Date.now();
    this.checkAchievements();
    this.saveToStorage();
  }

  getStreak() {
    return this.data.streaks.current;
  }

  getBestStreak() {
    return this.data.streaks.best;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONVERSATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  recordConversation(data) {
    this.data.conversations.push({
      ...data,
      timestamp: Date.now(),
    });

    // Award XP
    const xpGain = (data.turns || 1) * 10 + (data.wordsLearned || 0) * 5;
    this.addXP(xpGain);

    // Update streak
    this.updateStreak();

    this.checkAchievements();
    this.saveToStorage();
  }

  getConversationCount() {
    return this.data.conversations.length;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ACHIEVEMENTS
  // ═══════════════════════════════════════════════════════════════════════════════

  checkAchievements(wordsLearned = 0) {
    const newAchievements = [];

    this.achievementDefs.forEach(def => {
      if (this.data.achievements.includes(def.id)) return;

      let earned = false;

      switch (def.requirement.type) {
        case 'level':
          earned = this.data.level >= def.requirement.value;
          break;
        case 'streak':
          earned = this.data.streaks.current >= def.requirement.value;
          break;
        case 'conversations':
          earned = this.data.conversations.length >= def.requirement.value;
          break;
        case 'words':
          earned = wordsLearned >= def.requirement.value;
          break;
      }

      if (earned) {
        this.data.achievements.push(def.id);
        newAchievements.push(def);
      }
    });

    if (newAchievements.length > 0) {
      this.saveToStorage();
    }

    return newAchievements;
  }

  getAchievements() {
    return this.achievementDefs.filter(def =>
      this.data.achievements.includes(def.id)
    );
  }

  getLockedAchievements() {
    return this.achievementDefs.filter(def =>
      !this.data.achievements.includes(def.id)
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════════════════════

  getStats() {
    const totalTurns = this.data.conversations.reduce(
      (sum, c) => sum + (c.turns || 0), 0
    );

    return {
      level: this.data.level,
      xp: this.data.xp,
      totalXP: this.data.totalXP,
      currentStreak: this.data.streaks.current,
      bestStreak: this.data.streaks.best,
      totalConversations: this.data.conversations.length,
      totalTurns,
      achievementsEarned: this.data.achievements.length,
      achievementsTotal: this.achievementDefs.length,
    };
  }

  resetProgress() {
    this.data = {
      xp: 0,
      level: 1,
      totalXP: 0,
      conversations: [],
      achievements: [],
      streaks: { current: 0, best: 0, lastPractice: null },
    };
    this.saveToStorage();
  }
}

export default ProgressionSystem;

