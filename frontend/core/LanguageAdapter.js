// ═══════════════════════════════════════════════════════════════════════════════
// LanguageAdapter - Adapts game.js for multi-language support
// Provides NPCs, dialogue, and scene configuration based on selected language
// ═══════════════════════════════════════════════════════════════════════════════

import { ALL_LANGUAGES } from './index.js';

export class LanguageAdapter {
  constructor() {
    this.currentLanguage = null;
    this.languageConfig = null;
  }

  // Get selected language from localStorage or default to Polish
  getSelectedLanguage() {
    return localStorage.getItem('selectedLanguage') || 'polish';
  }

  // Initialize with a language
  initialize(langCode = null) {
    this.currentLanguage = langCode || this.getSelectedLanguage();
    this.languageConfig = ALL_LANGUAGES[this.currentLanguage];
    
    if (!this.languageConfig) {
      console.warn(`Language ${this.currentLanguage} not found, defaulting to Polish`);
      this.currentLanguage = 'polish';
      this.languageConfig = ALL_LANGUAGES.polish;
    }
    
    return this.languageConfig;
  }

  // Get the main character for this language's scene
  getMainCharacter() {
    if (!this.languageConfig) return null;
    
    const char = this.languageConfig.character;
    const scene = this.languageConfig.scene;
    
    return {
      name: char.name,
      fullName: char.fullName || char.name,
      role: char.role,
      emoji: char.emoji,
      position: { x: 0, z: 5 },
      appearance: {
        skinColor: char.appearance?.skinColor || 0xf5c09a,
        outfitColor: char.appearance?.outfitColor || 0x4a90d9,
        outfitSecondary: char.appearance?.outfitSecondary || 0x8b6914,
        outfitStyle: char.appearance?.outfitStyle || 'robe',
        hairColor: char.appearance?.hairColor || 0x2c1810,
        hairStyle: char.appearance?.hairStyle || 'short',
        hat: char.appearance?.hat || 'none',
        accessory: char.appearance?.accessory || 'none',
        hasBeard: char.appearance?.hasBeard || false,
        pantsColor: char.appearance?.pantsColor || 0x2c3e50,
      },
      personality: char.personality,
      greetings: char.greetings || [],
      voice: char.voice,
    };
  }

  // Generate NPCs based on language scenario
  generateNPCs() {
    if (!this.languageConfig) return [];
    
    const mainChar = this.getMainCharacter();
    const npcs = [];
    
    // Add main character
    if (mainChar) {
      npcs.push({
        name: mainChar.name,
        position: { x: 5, z: 5 },
        appearance: mainChar.appearance,
        isMainCharacter: true,
        dialogue: this.generateDialogue(mainChar),
      });
    }
    
    // Add supporting NPCs based on scenario
    const supportingNPCs = this.generateSupportingNPCs();
    npcs.push(...supportingNPCs);
    
    return npcs;
  }

  // Generate dialogue for the main character
  generateDialogue(character) {
    const vocab = this.languageConfig.vocabulary?.basic || [];
    const greetings = character.greetings || [];
    
    // Build dialogue based on vocabulary
    const dialogue = [];
    
    // Opening greeting
    if (greetings.length > 0) {
      dialogue.push({ speaker: 'npc', text: greetings[0].text });
    } else if (vocab.length > 0) {
      dialogue.push({ speaker: 'npc', text: `${vocab[0].word}! Welcome!` });
    }
    
    // Player response
    dialogue.push({ speaker: 'player', text: "Hello! It's nice to meet you." });
    
    // Character introduction
    dialogue.push({ 
      speaker: 'npc', 
      text: `I'm ${character.name}, ${character.role}. Let me teach you some ${this.languageConfig.name}!`
    });
    
    // Vocabulary exchange
    if (vocab.length > 1) {
      dialogue.push({ 
        speaker: 'npc', 
        text: `Try saying "${vocab[1].word}" - it means "${vocab[1].translation}".`
      });
      dialogue.push({ speaker: 'player', text: `${vocab[1].word}!` });
      dialogue.push({ 
        speaker: 'npc', 
        text: `${vocab.find(v => v.word.toLowerCase().includes('thank') || v.word.toLowerCase().includes('merci') || v.word.toLowerCase().includes('gracias'))?.word || 'Excellent'}! You're learning fast!`
      });
    }
    
    return dialogue;
  }

  // Generate supporting NPCs for variety
  generateSupportingNPCs() {
    const scene = this.languageConfig.scene;
    const vocab = this.languageConfig.vocabulary;
    
    // Generic supporting NPCs that work across languages
    const supportingRoles = [
      {
        name: 'Local Guide',
        role: 'Friendly local who helps newcomers',
        position: { x: 15, z: 15 },
        appearance: {
          skinColor: 0xc68642,
          outfitColor: 0x27ae60,
          hairStyle: 'short',
        },
      },
      {
        name: 'Shopkeeper',
        role: 'Vendor with goods to sell',
        position: { x: -10, z: 20 },
        appearance: {
          skinColor: 0xffd5b5,
          outfitColor: 0x8e44ad,
          hairStyle: 'long',
        },
      },
      {
        name: 'Elder',
        role: 'Wise community member',
        position: { x: 20, z: -10 },
        appearance: {
          skinColor: 0xdba97a,
          outfitColor: 0x2c3e50,
          hairStyle: 'bald',
          hasBeard: true,
        },
      },
    ];
    
    return supportingRoles.map((npc, i) => ({
      name: npc.name,
      position: npc.position,
      appearance: {
        skinColor: npc.appearance.skinColor,
        outfitColor: npc.appearance.outfitColor,
        outfitSecondary: 0x8b6914,
        outfitStyle: 'casual',
        hairColor: 0x2c1810,
        hairStyle: npc.appearance.hairStyle || 'short',
        hat: 'none',
        accessory: 'none',
        hasBeard: npc.appearance.hasBeard || false,
        pantsColor: 0x34495e,
      },
      dialogue: this.generateGenericDialogue(npc, i),
    }));
  }

  generateGenericDialogue(npc, index) {
    const vocab = this.languageConfig.vocabulary?.basic || [];
    const greetWord = vocab[0]?.word || 'Hello';
    const thankWord = vocab.find(v => 
      v.translation?.toLowerCase().includes('thank')
    )?.word || vocab[2]?.word || 'Thanks';
    
    return [
      { speaker: 'npc', text: `${greetWord}! I'm a ${npc.role}.` },
      { speaker: 'player', text: "Nice to meet you!" },
      { speaker: 'npc', text: `Welcome to our community! ${thankWord} for visiting!` },
    ];
  }

  // Get journal data formatted for current language
  getJournalData() {
    const vocab = [
      ...(this.languageConfig.vocabulary?.basic || []),
      ...(this.languageConfig.vocabulary?.intermediate || []),
    ];
    
    return {
      wordsLearned: vocab.map(v => ({
        word: v.word,
        english: v.translation,
        pronunciation: v.pronunciation,
      })),
      attempts: vocab.slice(0, 6).map((v, i) => ({
        word: v.word,
        accuracy: 70 + Math.floor(Math.random() * 25),
        status: i < 2 ? 'good' : i < 4 ? 'medium' : 'poor',
      })),
    };
  }

  // Get scene styling for current language
  getSceneStyling() {
    const scene = this.languageConfig.scene;
    const visuals = scene?.visuals || {};
    
    return {
      primaryColor: visuals.primaryColor || '#1e3a5f',
      secondaryColor: visuals.secondaryColor || '#d4af37',
      accentColor: visuals.accentColor || '#f5f5f5',
      backgroundColor: visuals.backgroundColor || '#87ceeb',
      theme: visuals.theme || 'default',
      lighting: visuals.lighting || 'warm afternoon',
      ambience: scene?.environment?.ambience || 'peaceful',
    };
  }

  // Get Three.js scene configuration
  getThreeJsConfig() {
    const styling = this.getSceneStyling();
    
    // Convert hex color string to number
    const hexToNum = (hex) => parseInt(hex.replace('#', '0x'));
    
    return {
      skyColor: hexToNum(styling.backgroundColor),
      fogColor: hexToNum(styling.backgroundColor),
      ambientLightColor: 0xb0c4de,
      sunlightColor: 0xffffff,
    };
  }

  // Get vocabulary for display
  getVocabulary(type = 'basic') {
    switch (type) {
      case 'basic':
        return this.languageConfig.vocabulary?.basic || [];
      case 'intermediate':
        return this.languageConfig.vocabulary?.intermediate || [];
      case 'advanced':
        return this.languageConfig.vocabulary?.advanced || [];
      case 'all':
        return [
          ...(this.languageConfig.vocabulary?.basic || []),
          ...(this.languageConfig.vocabulary?.intermediate || []),
          ...(this.languageConfig.vocabulary?.advanced || []),
        ];
      default:
        return [];
    }
  }

  // Get false friends warnings
  getFalseFriends() {
    return this.languageConfig.falseFriends || [];
  }

  // Get cultural notes
  getCulturalNotes() {
    return this.languageConfig.culturalNotes || [];
  }

  // Get mirage prompt for current scene
  getMiragePrompt(npcName) {
    const scene = this.languageConfig.scene;
    const location = scene?.environment?.location || 'a cultural location';
    
    return `A realistic ${npcName} in ${location}, ${scene?.visuals?.atmosphere || 'atmospheric'} setting, high quality, detailed`;
  }

  // Check if a language is available
  static isLanguageAvailable(langCode) {
    return langCode in ALL_LANGUAGES;
  }

  // Get all available languages
  static getAvailableLanguages() {
    return Object.entries(ALL_LANGUAGES).map(([id, config]) => ({
      id,
      name: config.name,
      nativeName: config.nativeName,
      flag: config.flag,
      sceneName: config.scene?.name,
    }));
  }
}

// Singleton instance
let adapterInstance = null;

export const getLanguageAdapter = () => {
  if (!adapterInstance) {
    adapterInstance = new LanguageAdapter();
    adapterInstance.initialize();
  }
  return adapterInstance;
};

export default LanguageAdapter;

