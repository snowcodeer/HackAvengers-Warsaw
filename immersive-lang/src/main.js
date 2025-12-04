// LinguaWorlds - Main Entry Point
import { GameWorld } from './game/GameWorld.js';
import { LanguageManager } from './core/LanguageManager.js';
import { ConversationManager } from './core/ConversationManager.js';
import { GlossaryManager } from './core/GlossaryManager.js';
import { ProgressionSystem } from './core/ProgressionSystem.js';
import { DecartVisuals } from './integrations/DecartVisuals.js';
import { LANGUAGE_CONFIG } from './config/languages.js';

class LinguaWorlds {
  constructor() {
    this.currentLanguage = null;
    this.gameWorld = null;
    this.languageManager = null;
    this.conversationManager = null;
    this.glossaryManager = null;
    this.progressionSystem = null;
    this.decartVisuals = null;
    
    this.init();
  }

  async init() {
    // Simulate loading
    await this.simulateLoading();
    
    // Initialize core systems
    this.glossaryManager = new GlossaryManager();
    this.progressionSystem = new ProgressionSystem();
    
    // Setup event listeners
    this.setupLanguageSelection();
    this.setupUIControls();
    
    // Hide loading screen
    document.getElementById('loadingScreen').classList.add('hidden');
  }

  async simulateLoading() {
    const loadingBar = document.getElementById('loadingBar');
    let progress = 0;
    
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(resolve, 300);
        }
        loadingBar.style.width = `${progress}%`;
      }, 150);
    });
  }

  setupLanguageSelection() {
    const cards = document.querySelectorAll('.language-card');
    
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const lang = card.dataset.lang;
        this.selectLanguage(lang);
      });
      
      // Add hover sound effect
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
    });
  }

  setupUIControls() {
    // Glossary button
    document.getElementById('glossaryBtn')?.addEventListener('click', () => {
      this.toggleGlossary();
    });
    
    document.getElementById('closeGlossary')?.addEventListener('click', () => {
      document.getElementById('glossaryModal').classList.add('hidden');
    });
    
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderGlossaryTab(btn.dataset.tab);
      });
    });
    
    // Level up continue
    document.getElementById('continueLevelUp')?.addEventListener('click', () => {
      document.getElementById('levelUpModal').classList.add('hidden');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'g' && this.currentLanguage) {
        this.toggleGlossary();
      }
    });
  }

  async selectLanguage(langCode) {
    const config = LANGUAGE_CONFIG[langCode];
    if (!config) return;
    
    this.currentLanguage = langCode;
    
    // Hide language select, show game
    document.getElementById('languageSelect').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    // Update UI with language-specific info
    document.getElementById('locationName').textContent = config.location;
    document.getElementById('characterName').textContent = config.character.name;
    document.getElementById('characterRole').textContent = config.character.role;
    document.getElementById('characterAvatar').textContent = config.character.emoji;
    
    // Initialize managers
    this.languageManager = new LanguageManager(langCode, config);
    this.conversationManager = new ConversationManager(
      this.languageManager,
      this.glossaryManager,
      this.progressionSystem
    );
    
    // Initialize 3D game world
    this.gameWorld = new GameWorld(
      document.getElementById('gameCanvas'),
      config,
      this.conversationManager
    );
    
    // Initialize Decart visual enhancement
    this.decartVisuals = new DecartVisuals(
      document.getElementById('decartCanvas'),
      config.visualStyle
    );
    
    // Generate initial lesson content
    await this.languageManager.generateInitialLessons();
    
    // Start the game world
    this.gameWorld.start();
    
    // Show character panel
    setTimeout(() => {
      document.getElementById('characterPanel').classList.remove('hidden');
    }, 1000);
  }

  toggleGlossary() {
    const modal = document.getElementById('glossaryModal');
    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden');
      this.renderGlossaryTab('learned');
    } else {
      modal.classList.add('hidden');
    }
  }

  renderGlossaryTab(tab) {
    const content = document.getElementById('glossaryContent');
    const words = this.glossaryManager.getWords(this.currentLanguage, tab);
    
    if (tab === 'learned') {
      content.innerHTML = words.map(w => `
        <div class="glossary-item">
          <span class="glossary-word">${w.word}</span>
          <div class="glossary-definition">
            <p class="glossary-translation">${w.translation}</p>
            <p class="glossary-pronunciation">/${w.pronunciation}/</p>
          </div>
        </div>
      `).join('') || '<p style="color: var(--text-muted);">No words learned yet. Start a conversation!</p>';
    } else if (tab === 'false-friends') {
      content.innerHTML = words.map(w => `
        <div class="glossary-item">
          <span class="glossary-word">${w.word}</span>
          <div class="glossary-definition">
            <p class="glossary-translation"><strong>Looks like:</strong> ${w.looksLike}</p>
            <p class="glossary-translation"><strong>Actually means:</strong> ${w.actualMeaning}</p>
            <div class="false-friend-warning">
              <span>⚠️</span>
              <span>${w.warning}</span>
            </div>
          </div>
        </div>
      `).join('') || '<p style="color: var(--text-muted);">No false friends encountered yet.</p>';
    } else if (tab === 'phrases') {
      content.innerHTML = words.map(w => `
        <div class="glossary-item">
          <span class="glossary-word">${w.phrase}</span>
          <div class="glossary-definition">
            <p class="glossary-translation">${w.translation}</p>
            <p class="glossary-pronunciation">${w.context}</p>
          </div>
        </div>
      `).join('') || '<p style="color: var(--text-muted);">No phrases learned yet.</p>';
    }
  }

  showLevelUp(level, rewards) {
    document.getElementById('newLevelText').textContent = `You've reached Level ${level}`;
    document.getElementById('rewardsList').innerHTML = rewards
      .map(r => `<li>${r}</li>`)
      .join('');
    document.getElementById('levelUpModal').classList.remove('hidden');
  }
}

// Start the application
window.addEventListener('DOMContentLoaded', () => {
  window.linguaWorlds = new LinguaWorlds();
});

