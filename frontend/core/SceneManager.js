// ═══════════════════════════════════════════════════════════════════════════════
// SceneManager - Iterative Scene-Based Language Learning System
// Handles transitions, state, and scene orchestration
// ═══════════════════════════════════════════════════════════════════════════════

import { LANGUAGE_CONFIG, getLanguageConfig } from '../config/languages.js';
import { EXTENDED_LANGUAGES } from '../config/languages-extended.js';
import { GlossaryManager } from './GlossaryManager.js';
import { ProgressionSystem } from './ProgressionSystem.js';
import { ConversationEngine } from './ConversationEngine.js';
import { VoiceManager } from './VoiceManager.js';

// Merge all language configs
const ALL_LANGUAGES = { ...LANGUAGE_CONFIG, ...EXTENDED_LANGUAGES };

export class SceneManager {
  constructor() {
    // Current state
    this.currentLanguage = null;
    this.currentScene = null;
    this.currentScenario = null;
    this.scenarioProgress = 0;
    
    // Scene iteration tracking
    this.sceneHistory = [];
    this.visitedScenarios = new Set();
    this.totalScenesCompleted = 0;
    
    // Core systems
    this.glossaryManager = new GlossaryManager();
    this.progressionSystem = new ProgressionSystem();
    this.conversationEngine = null;
    this.voiceManager = null;
    
    // UI state
    this.isTransitioning = false;
    this.isInConversation = false;
    
    // Event handlers
    this.onSceneChange = null;
    this.onScenarioComplete = null;
    this.onLevelUp = null;
    
    // Initialize
    this.loadSavedState();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  
  loadSavedState() {
    try {
      const saved = localStorage.getItem('linguaWorlds_sceneState');
      if (saved) {
        const state = JSON.parse(saved);
        this.sceneHistory = state.sceneHistory || [];
        this.visitedScenarios = new Set(state.visitedScenarios || []);
        this.totalScenesCompleted = state.totalScenesCompleted || 0;
      }
    } catch (e) {
      console.warn('Failed to load scene state:', e);
    }
  }

  saveState() {
    try {
      localStorage.setItem('linguaWorlds_sceneState', JSON.stringify({
        sceneHistory: this.sceneHistory,
        visitedScenarios: Array.from(this.visitedScenarios),
        totalScenesCompleted: this.totalScenesCompleted,
      }));
    } catch (e) {
      console.warn('Failed to save scene state:', e);
    }
  }

  async initialize() {
    // Initialize voice manager
    this.voiceManager = new VoiceManager();
    await this.voiceManager.initialize();
    
    console.log('🌍 SceneManager initialized with', Object.keys(ALL_LANGUAGES).length, 'languages');
    return true;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // LANGUAGE & SCENE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getAllLanguages() {
    return Object.entries(ALL_LANGUAGES).map(([key, config]) => ({
      id: key,
      code: config.code,
      name: config.name,
      nativeName: config.nativeName,
      flag: config.flag,
      scene: config.scene,
      character: config.character,
      completed: this.isLanguageCompleted(key),
      progress: this.getLanguageProgress(key),
    }));
  }

  getLanguageProgress(langId) {
    const config = ALL_LANGUAGES[langId];
    if (!config || !config.scenarios) return 0;
    
    const totalScenarios = config.scenarios.length;
    const completedScenarios = config.scenarios.filter(s => 
      this.visitedScenarios.has(`${langId}_${s.id}`)
    ).length;
    
    return Math.round((completedScenarios / totalScenarios) * 100);
  }

  isLanguageCompleted(langId) {
    return this.getLanguageProgress(langId) === 100;
  }

  async selectLanguage(langId) {
    if (this.isTransitioning) return;
    
    const config = ALL_LANGUAGES[langId];
    if (!config) {
      console.error('Unknown language:', langId);
      return;
    }
    
    this.isTransitioning = true;
    this.currentLanguage = langId;
    this.currentScene = config.scene;
    
    // Initialize conversation engine for this language
    this.conversationEngine = new ConversationEngine(
      config,
      this.glossaryManager,
      this.progressionSystem,
      this.voiceManager
    );
    
    // Add to history
    this.sceneHistory.push({
      language: langId,
      scene: config.scene.id,
      timestamp: Date.now(),
    });
    
    // Trigger scene change event
    if (this.onSceneChange) {
      await this.onSceneChange(config);
    }
    
    this.isTransitioning = false;
    this.saveState();
    
    return config;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SCENARIO MANAGEMENT (Iterative Learning)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getCurrentScenarios() {
    if (!this.currentLanguage) return [];
    
    const config = ALL_LANGUAGES[this.currentLanguage];
    if (!config.scenarios) return [];
    
    return config.scenarios.map(scenario => ({
      ...scenario,
      completed: this.visitedScenarios.has(`${this.currentLanguage}_${scenario.id}`),
      locked: this.isScenarioLocked(scenario),
    }));
  }

  isScenarioLocked(scenario) {
    // First scenario is always unlocked
    const config = ALL_LANGUAGES[this.currentLanguage];
    if (!config.scenarios) return false;
    
    const index = config.scenarios.findIndex(s => s.id === scenario.id);
    if (index === 0) return false;
    
    // Unlock if previous scenario is completed
    const previousScenario = config.scenarios[index - 1];
    return !this.visitedScenarios.has(`${this.currentLanguage}_${previousScenario.id}`);
  }

  async startScenario(scenarioId) {
    if (!this.currentLanguage) return;
    
    const config = ALL_LANGUAGES[this.currentLanguage];
    const scenario = config.scenarios?.find(s => s.id === scenarioId);
    
    if (!scenario) {
      console.error('Scenario not found:', scenarioId);
      return;
    }
    
    if (this.isScenarioLocked(scenario)) {
      console.warn('Scenario is locked:', scenarioId);
      return;
    }
    
    this.currentScenario = scenario;
    this.scenarioProgress = 0;
    this.isInConversation = true;
    
    // Start the conversation for this scenario
    await this.conversationEngine.startScenario(scenario);
    
    return scenario;
  }

  async completeScenario() {
    if (!this.currentScenario || !this.currentLanguage) return;
    
    const scenarioKey = `${this.currentLanguage}_${this.currentScenario.id}`;
    const wasNewCompletion = !this.visitedScenarios.has(scenarioKey);
    
    this.visitedScenarios.add(scenarioKey);
    
    if (wasNewCompletion) {
      this.totalScenesCompleted++;
      
      // Award rewards
      const rewards = this.currentScenario.rewards;
      if (rewards) {
        this.progressionSystem.addXP(rewards.xp || 0);
        
        if (rewards.vocabulary) {
          rewards.vocabulary.forEach(word => {
            this.glossaryManager.addWord(this.currentLanguage, {
              word,
              translation: '(learned)',
              pronunciation: '',
            });
          });
        }
      }
      
      // Check for level up
      const leveledUp = this.progressionSystem.checkLevelUp();
      if (leveledUp && this.onLevelUp) {
        this.onLevelUp(this.progressionSystem.getLevel());
      }
    }
    
    this.isInConversation = false;
    
    if (this.onScenarioComplete) {
      this.onScenarioComplete(this.currentScenario, wasNewCompletion);
    }
    
    this.saveState();
    
    // Return next scenario if available
    return this.getNextScenario();
  }

  getNextScenario() {
    if (!this.currentLanguage || !this.currentScenario) return null;
    
    const config = ALL_LANGUAGES[this.currentLanguage];
    if (!config.scenarios) return null;
    
    const currentIndex = config.scenarios.findIndex(s => s.id === this.currentScenario.id);
    if (currentIndex < config.scenarios.length - 1) {
      return config.scenarios[currentIndex + 1];
    }
    
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONVERSATION HANDLING
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async sendMessage(audioBlob) {
    if (!this.conversationEngine || !this.isInConversation) return null;
    
    const response = await this.conversationEngine.processUserInput(audioBlob);
    
    // Update scenario progress based on objectives
    if (response && this.currentScenario) {
      this.updateScenarioProgress(response);
    }
    
    return response;
  }

  updateScenarioProgress(response) {
    // Simple progress tracking based on conversation turns
    this.scenarioProgress++;
    
    // Complete after enough turns or if all objectives met
    if (this.scenarioProgress >= 5 || response.objectivesComplete) {
      // Don't auto-complete, let user choose to continue or finish
    }
  }

  async requestHint() {
    if (!this.conversationEngine) return null;
    return this.conversationEngine.getHint();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // VOCABULARY & LEARNING
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getVocabulary(type = 'all') {
    if (!this.currentLanguage) return [];
    
    const config = ALL_LANGUAGES[this.currentLanguage];
    
    switch (type) {
      case 'basic':
        return config.vocabulary?.basic || [];
      case 'intermediate':
        return config.vocabulary?.intermediate || [];
      case 'advanced':
        return config.vocabulary?.advanced || [];
      case 'learned':
        return this.glossaryManager.getWords(this.currentLanguage);
      case 'false-friends':
        return config.falseFriends || [];
      default:
        return [
          ...(config.vocabulary?.basic || []),
          ...(config.vocabulary?.intermediate || []),
          ...(config.vocabulary?.advanced || []),
        ];
    }
  }

  getCulturalNotes() {
    if (!this.currentLanguage) return [];
    const config = ALL_LANGUAGES[this.currentLanguage];
    return config.culturalNotes || [];
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SCENE ITERATION (Navigate between languages)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getRecommendedNextLanguage() {
    // Recommend language with lowest progress that isn't 100%
    const languages = this.getAllLanguages();
    
    // Filter out completed languages
    const incomplete = languages.filter(l => l.progress < 100);
    
    if (incomplete.length === 0) {
      return null; // All completed!
    }
    
    // Sort by progress (lowest first), then by not-recently-visited
    incomplete.sort((a, b) => {
      const aRecent = this.sceneHistory.findIndex(h => h.language === a.id);
      const bRecent = this.sceneHistory.findIndex(h => h.language === b.id);
      
      // Prefer less progress
      if (a.progress !== b.progress) {
        return a.progress - b.progress;
      }
      
      // Then prefer less recently visited
      return bRecent - aRecent;
    });
    
    return incomplete[0];
  }

  async iterateToNextScene() {
    const next = this.getRecommendedNextLanguage();
    if (next) {
      return this.selectLanguage(next.id);
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STATISTICS & PROGRESS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getGlobalStats() {
    const languages = this.getAllLanguages();
    
    return {
      totalLanguages: languages.length,
      languagesStarted: languages.filter(l => l.progress > 0).length,
      languagesCompleted: languages.filter(l => l.progress === 100).length,
      totalScenariosCompleted: this.totalScenesCompleted,
      totalWordsLearned: this.glossaryManager.getTotalWords(),
      currentStreak: this.progressionSystem.getStreak(),
      level: this.progressionSystem.getLevel(),
      xp: this.progressionSystem.getXP(),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════════
  
  dispose() {
    this.saveState();
    
    if (this.conversationEngine) {
      this.conversationEngine.dispose();
    }
    
    if (this.voiceManager) {
      this.voiceManager.dispose();
    }
  }
}

// Singleton instance
let sceneManagerInstance = null;

export const getSceneManager = () => {
  if (!sceneManagerInstance) {
    sceneManagerInstance = new SceneManager();
  }
  return sceneManagerInstance;
};

export default SceneManager;

