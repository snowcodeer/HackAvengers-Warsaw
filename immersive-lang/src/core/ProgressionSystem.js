// ProgressionSystem - Handles XP, levels, and achievements

export class ProgressionSystem {
  constructor() {
    this.data = this.loadFromStorage() || {
      xp: 0,
      level: 1,
      conversations: [],
      achievements: [],
      streaks: {
        current: 0,
        best: 0,
        lastPractice: null
      }
    };
    
    this.xpPerLevel = 100;
    this.levelMultiplier = 1.5;
    
    this.updateUI();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('linguaWorlds_progress');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('linguaWorlds_progress', JSON.stringify(this.data));
    } catch (error) {
      console.warn('Failed to save progress:', error);
    }
  }

  addXP(amount) {
    this.data.xp += amount;
    
    // Check for level up
    const requiredXP = this.getRequiredXP();
    if (this.data.xp >= requiredXP) {
      this.levelUp();
    }
    
    this.updateUI();
    this.saveToStorage();
    
    return this.data.xp;
  }

  getRequiredXP() {
    return Math.floor(this.xpPerLevel * Math.pow(this.levelMultiplier, this.data.level - 1));
  }

  levelUp() {
    this.data.xp = this.data.xp - this.getRequiredXP();
    this.data.level++;
    
    // Check for achievements
    this.checkAchievements();
    
    return this.data.level;
  }

  recordConversation(conversationData) {
    this.data.conversations.push({
      ...conversationData,
      timestamp: Date.now()
    });
    
    // Update streak
    this.updateStreak();
    
    // Grant bonus XP for conversation
    const bonusXP = conversationData.turns * 5 + conversationData.wordsLearned * 10;
    this.addXP(bonusXP);
    
    this.saveToStorage();
  }

  updateStreak() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    if (this.data.streaks.lastPractice) {
      const lastDate = new Date(this.data.streaks.lastPractice);
      const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()).getTime();
      const daysDiff = (today - lastDay) / (1000 * 60 * 60 * 24);
      
      if (daysDiff === 1) {
        // Consecutive day
        this.data.streaks.current++;
      } else if (daysDiff > 1) {
        // Streak broken
        this.data.streaks.current = 1;
      }
      // Same day - no change
    } else {
      this.data.streaks.current = 1;
    }
    
    // Update best streak
    if (this.data.streaks.current > this.data.streaks.best) {
      this.data.streaks.best = this.data.streaks.current;
    }
    
    this.data.streaks.lastPractice = Date.now();
  }

  checkAchievements() {
    const newAchievements = [];
    
    // Level achievements
    const levelAchievements = [
      { id: 'level5', name: 'Apprentice', level: 5, icon: '🌱' },
      { id: 'level10', name: 'Student', level: 10, icon: '📚' },
      { id: 'level25', name: 'Scholar', level: 25, icon: '🎓' },
      { id: 'level50', name: 'Master', level: 50, icon: '👑' },
    ];
    
    levelAchievements.forEach(achievement => {
      if (this.data.level >= achievement.level && 
          !this.data.achievements.includes(achievement.id)) {
        this.data.achievements.push(achievement.id);
        newAchievements.push(achievement);
      }
    });
    
    // Streak achievements
    const streakAchievements = [
      { id: 'streak7', name: 'Week Warrior', streak: 7, icon: '🔥' },
      { id: 'streak30', name: 'Month Master', streak: 30, icon: '💪' },
    ];
    
    streakAchievements.forEach(achievement => {
      if (this.data.streaks.current >= achievement.streak &&
          !this.data.achievements.includes(achievement.id)) {
        this.data.achievements.push(achievement.id);
        newAchievements.push(achievement);
      }
    });
    
    // Conversation achievements
    const convCount = this.data.conversations.length;
    const convAchievements = [
      { id: 'conv10', name: 'Chatterbox', count: 10, icon: '💬' },
      { id: 'conv50', name: 'Conversationalist', count: 50, icon: '🗣️' },
      { id: 'conv100', name: 'Polyglot in Training', count: 100, icon: '🌍' },
    ];
    
    convAchievements.forEach(achievement => {
      if (convCount >= achievement.count &&
          !this.data.achievements.includes(achievement.id)) {
        this.data.achievements.push(achievement.id);
        newAchievements.push(achievement);
      }
    });
    
    return newAchievements;
  }

  updateUI() {
    const requiredXP = this.getRequiredXP();
    const xpPercent = (this.data.xp / requiredXP) * 100;
    
    // Update XP bar
    const xpFill = document.getElementById('xpFill');
    const xpText = document.getElementById('xpText');
    const levelBadge = document.getElementById('levelBadge');
    
    if (xpFill) xpFill.style.width = `${xpPercent}%`;
    if (xpText) xpText.textContent = `${this.data.xp} / ${requiredXP} XP`;
    if (levelBadge) levelBadge.textContent = `Level ${this.data.level}`;
    
    // Update difficulty stars
    this.updateDifficultyStars();
  }

  updateDifficultyStars() {
    const stars = document.querySelectorAll('.difficulty-stars .star');
    const currentDifficulty = Math.min(5, Math.ceil(this.data.level / 10));
    
    stars.forEach((star, i) => {
      if (i < currentDifficulty) {
        star.classList.add('filled');
      } else {
        star.classList.remove('filled');
      }
    });
  }

  getStats() {
    const totalWords = this.data.conversations.reduce(
      (sum, c) => sum + (c.wordsLearned || 0), 0
    );
    
    return {
      level: this.data.level,
      xp: this.data.xp,
      totalConversations: this.data.conversations.length,
      totalWordsLearned: totalWords,
      currentStreak: this.data.streaks.current,
      bestStreak: this.data.streaks.best,
      achievements: this.data.achievements.length
    };
  }
}

