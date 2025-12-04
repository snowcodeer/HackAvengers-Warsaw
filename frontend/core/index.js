// ═══════════════════════════════════════════════════════════════════════════════
// LinguaWorlds Core Module Exports
// ═══════════════════════════════════════════════════════════════════════════════

export { SceneManager, getSceneManager } from './SceneManager.js';
export { GlossaryManager } from './GlossaryManager.js';
export { ProgressionSystem } from './ProgressionSystem.js';
export { ConversationEngine } from './ConversationEngine.js';
export { VoiceManager } from './VoiceManager.js';
export { APIClient, apiClient } from './APIClient.js';
export { AudioManager, audioManager } from './AudioManager.js';
export { RealtimeVoice, realtimeVoice } from './RealtimeVoice.js';
export { RealtimeVoiceFeedback, voiceFeedback } from './RealtimeVoiceFeedback.js';

// Language configurations
export { LANGUAGE_CONFIG, getLanguageConfig, getAllLanguages } from '../config/languages.js';
export { EXTENDED_LANGUAGES } from '../config/languages-extended.js';

// Utility: Get all merged languages
import { LANGUAGE_CONFIG } from '../config/languages.js';
import { EXTENDED_LANGUAGES } from '../config/languages-extended.js';

export const ALL_LANGUAGES = { ...LANGUAGE_CONFIG, ...EXTENDED_LANGUAGES };

export const getLanguage = (code) => ALL_LANGUAGES[code] || null;

export const getAvailableLanguages = () => Object.entries(ALL_LANGUAGES).map(([id, config]) => ({
  id,
  code: config.code,
  name: config.name,
  nativeName: config.nativeName,
  flag: config.flag,
  sceneName: config.scene?.name,
  characterName: config.character?.name,
}));

