# LinguaWorlds 🌍

**Immersive Language Learning Through AI-Generated Cultural Worlds**

Step into beautifully crafted 3D environments — a Parisian boulangerie, Berlin's Berghain, a London pub, a Beijing tea house — and learn languages through natural conversation with AI characters.

![LinguaWorlds](https://img.shields.io/badge/LinguaWorlds-Immersive%20Learning-gold)
![Three.js](https://img.shields.io/badge/Three.js-3D%20Engine-black)
![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Voice%20AI-blue)
![Claude](https://img.shields.io/badge/Claude-Anthropic-orange)
![Decart](https://img.shields.io/badge/Decart-Visual%20AI-purple)

## ✨ Features

### 🗣️ Voice-First Conversations
- **Real-time speech recognition** via ElevenLabs
- **Natural TTS responses** with native-speaker voices
- **Grammar correction** with gentle feedback
- **Progressive difficulty** that adapts to your level

### 🏛️ Cultural Immersion
| Language | Location | Character |
|----------|----------|-----------|
| 🇫🇷 French | Paris Boulangerie | Amélie the Baker |
| 🇩🇪 German | Berlin Berghain | Wolfgang the DJ |
| 🇬🇧 English | London Pub | Victoria the Landlady |
| 🇨🇳 Mandarin | Beijing Tea House | Mei Lin the Tea Master |
| 🇪🇸 Spanish | Madrid Tapas Bar | Carmen the Dancer |
| 🇯🇵 Japanese | Kyoto Tea Garden | Yuki the Host |
| 🇮🇹 Italian | Rome Café | Marco the Barista |
| 🇵🇱 Polish | Warsaw Old Town | Kasia the Guide |

### 🎨 AI-Enhanced Visuals
- **Decart Mirage** real-time visual styling
- Dreamlike atmospheric effects
- Theme-matched environments

### 📚 Smart Learning System
- **Vocabulary Journal** tracks all learned words
- **False Friends Warning** ⚠️ for tricky words
- **Progressive Difficulty** (5 levels)
- **XP & Achievements** gamification

## 🚀 Quick Start

```bash
# Install dependencies
cd immersive-lang
npm install

# Start the backend server
npm run server

# In another terminal, start the frontend
npm run dev
```

Open http://localhost:3000 and pick a language to begin your journey!

## 🔑 API Keys Required

The app uses these APIs (keys are pre-configured):

| Service | Purpose |
|---------|---------|
| **ElevenLabs** | Voice synthesis & recognition |
| **Anthropic Claude** | Lesson generation & conversation AI |
| **Decart** | Real-time visual enhancement |

## 🎮 How to Play

1. **Choose a Language** - Select from 8 culturally immersive worlds
2. **Explore** - Walk around with WASD, look with mouse
3. **Talk** - Press E near the character to start a conversation
4. **Speak** - Hold the mic button and speak in the target language
5. **Learn** - Get corrections, learn new words, level up!

### Controls
| Input | Action |
|-------|--------|
| WASD | Move around |
| Mouse | Look around |
| E | Start conversation |
| G | Open glossary |
| Hold Mic | Record speech |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                          │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐  │
│  │   Three.js  │ │   Voice UI  │ │  Decart FX   │  │
│  │  3D World   │ │   Manager   │ │   Overlay    │  │
│  └─────────────┘ └─────────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────┘
                         │
                    REST API
                         │
┌─────────────────────────────────────────────────────┐
│                    Backend                           │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐  │
│  │   Claude    │ │ ElevenLabs  │ │    Decart    │  │
│  │   Lesson    │ │   TTS/STT   │ │   Visuals    │  │
│  └─────────────┘ └─────────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
immersive-lang/
├── src/
│   ├── main.js              # App entry point
│   ├── index.html           # Main HTML
│   ├── styles.css           # Beautiful styling
│   ├── config/
│   │   └── languages.js     # Language configurations
│   ├── core/
│   │   ├── LanguageManager.js      # Claude integration
│   │   ├── ConversationManager.js  # ElevenLabs integration
│   │   ├── GlossaryManager.js      # Vocabulary tracking
│   │   └── ProgressionSystem.js    # XP & levels
│   ├── game/
│   │   ├── GameWorld.js           # Three.js world
│   │   └── EnvironmentBuilder.js  # 3D environments
│   └── integrations/
│       └── DecartVisuals.js       # Visual effects
├── server/
│   └── index.js             # Express backend
├── package.json
└── vite.config.js
```

## 🎯 Difficulty Progression

Each language has 5 difficulty levels:

| Level | English % | Target % | Focus |
|-------|-----------|----------|-------|
| 1 | 80% | 20% | Basic greetings |
| 2 | 60% | 40% | Ordering/basics |
| 3 | 40% | 60% | Grammar intro |
| 4 | 20% | 80% | Complex grammar |
| 5 | 0% | 100% | Natural conversation |

Difficulty increases automatically every 10 conversation turns!

## ⚠️ False Friends Examples

The app warns you about tricky words:

| Word | Looks Like | Actually Means |
|------|------------|----------------|
| 🇫🇷 `actuellement` | actually | currently |
| 🇩🇪 `Gift` | gift | poison |
| 🇪🇸 `embarazada` | embarrassed | pregnant |
| 🇮🇹 `caldo` | cold | hot |

## 🛠️ Tech Stack

- **Frontend**: Vite, Three.js, Vanilla JS
- **Backend**: Node.js, Express
- **AI Services**: 
  - Claude (Anthropic) - Conversation AI
  - ElevenLabs - Voice synthesis/recognition
  - Decart - Visual enhancement

## 📜 License

MIT License - Build amazing things!

---

Built with ❤️ for the ElevenLabs Hackathon

*Learn languages the way they were meant to be learned — through immersion, culture, and conversation.*

