# **Mówka - Specification Document**

## **1. Overview**

**Mówka** is a 3D voice-powered Polish language learning game. Players navigate a village, talk to NPCs in Polish, and follow clues to find a lost cat. Built for the ElevenLabs Hackathon (Creative Theme).

---

## **2. Concept**

After Babel fractured all languages, rare "Bridgers" can heal the divide by learning to speak across tongues. The player arrives in a Polish village where a Babel Spirit (a cat named Kitty) only reveals itself to those who truly listen. Finding it proves you are a Bridger.

---

## **3. Core Gameplay**

- [ ] Navigate 3D village using hand gestures (TBD)
- [ ] Approach NPC → prompt appears: "Handshake to talk"
- [ ] Handshake gesture → initiate conversation
- [ ] Respond with voice → transcription appears with errors highlighted
- [ ] NPC models correct pronunciation: "Szukam kota? Tak, widziałem."
- [ ] Follow clues across village → find cat → return to child

---

## **4. Quest Structure**

| Step | Location | NPC | Objective |
|------|----------|-----|-----------|
| 1 | Square | [Placeholder] (child) | Receive quest: find lost cat |
| 2 | Market | Mati (shopkeeper) | Get first clue |
| 3 | Alley | Jade (young woman) | Get directions |
| 4 | Garden | Kitty (cat) | Call the cat by name |
| 5 | Square | [Placeholder] (child) | Return cat, complete quest |

---

## **5. Controls**

| Input | Action |
|-------|--------|
| Hand gestures (TBD) | Navigation |
| Handshake gesture | Initiate NPC conversation |
| Voice | NPC interaction |

---

## **6. Features**

**6.1 NPC Behaviour**

| State | Behaviour |
|-------|-----------|
| Idle | Wander within designated area |
| Player in radius | Stop, face player, prompt: "Handshake to talk" |
| Handshake detected | Conversation begins |
| Conversation end | Return to idle |

**6.2 Voice Interaction**
- [ ] Player speaks Polish to NPCs
- [ ] NPCs respond with synthesised Polish speech
- [ ] Natural conversation flow with contextual responses

**6.3 Speech Feedback**
- [ ] Real-time transcription displayed in speech bubble
- [ ] Errors highlighted in bold
- [ ] NPC models correct pronunciation in response

**6.4 Help System**

| Trigger | Response |
|---------|----------|
| "Pomoc" (1st) | NPC slows down, uses simpler words |
| "Pomoc" (2nd) | NPC provides subtle hint in Polish |
| "Powtórz" | NPC repeats last phrase |
| "Powoli" | NPC speaks slower |
| Silence (10s+) | NPC prompts: "Słuchasz?" |
| Stuck (3+ failed attempts) | Bird flies in with English support |

**6.5 Bird Helper ([Placeholder])**
- [ ] Appears when player is truly stuck
- [ ] Flies into scene, perches nearby
- [ ] Speaks in both English and Polish (bilingual helper)
- [ ] Uses neutral ElevenLabs voice
- [ ] Flies away once player succeeds

**6.6 Vocabulary Journal**
- [ ] Tracks words learned
- [ ] Shows pronunciation guide
- [ ] Logs player attempts and accuracy
- [ ] Accessible via voice: "Słownik"

**6.7 Context Clues (New)**
- [x] **Echo Sight**: Looking in the direction of a quest objective causes the relevant Polish keyword in the objective text to glow.
- [x] **Thought Bubbles**: NPCs display icons (pictograms) above their heads representing key subjects (e.g., a cat icon when saying "kot").
- [x] **Objective UI**: Top of screen displays current goal in simple Polish (e.g., "Idź do ogrodu").

**6.8 Difficulty Progression (New)**
The game uses a scaffolding system to gradually increase Polish complexity.
- [x] **Level 1**: Mostly English, key Polish words (e.g., "kot", "tak").
- [x] **Level 2**: Simple Polish sentences, English repetition.
- [x] **Level 3**: Polish, English only if confused.
- [x] **Level 4**: Polish only, simple grammar.
- [x] **Level 5**: Natural Polish.
- [x] **Scaling**: Difficulty increases automatically every 10 conversation turns.

---

## **7. NPCs**

| Name | Location | Role | Voice |
|------|----------|------|-------|
| [Placeholder] | Square | Child, quest giver | Polish, young |
| Mati | Market | Shopkeeper, first clue | Polish, adult male |
| Jade | Alley | Young woman, directions | Polish, adult female |
| Kitty | Garden | Babel Spirit, the cat | Meows / responds to name |
| [Placeholder] | Flies in | Bird, bilingual helper | Neutral, English + Polish |

**Total: 5 characters**

---

## **8. Vocabulary Progression**

| Act | New Words |
|-----|-----------|
| 1 | tak, nie, kot, pomożesz, dziękuję |
| 2 | szukam, widziałem, tam |
| 3 | prosto, w prawo, słuchaj |
| 4 | cicho, tutaj, imię, zawołaj |
| 5 | zostaniesz, dobrze |

---

## **9. Environment**

**9.1 Village Layout**

```
        [Garden]
           |
[Alley] - [Square] - [Market]
```

**9.2 Locations**

| Location | Props |
|----------|-------|
| Square | Fountain, bench |
| Market | Crates, fruit, bread |
| Alley | Window, doorstep |
| Garden | Fence, plants, bench |

**9.3 Visual Style**
- [ ] Warm, hand-painted aesthetic
- [ ] Muted earth tones, golden light
- [ ] Crumbling Babel tower in background

---

## **10. Architecture**

### **10.1 Overview**

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │   Three.js    │  │  MediaPipe    │  │  HTML/CSS   │ │
│  │   (3D scene)  │  │  (gestures)   │  │  (UI)       │ │
│  └───────────────┘  └───────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                       BACKEND                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │                 Python / FastAPI                   │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   ┌─────────────────┐ ┌─────────────┐ ┌─────────────┐
   │   ElevenLabs    │ │  ElevenLabs │ │   Claude    │
   │   (TTS)         │ │  (STT)      │ │  (NPC AI)   │
   └─────────────────┘ └─────────────┘ └─────────────┘
```

### **10.2 Tech Stack**

**Frontend**

| Component | Technology |
|-----------|------------|
| 3D Engine | Three.js |
| Hand Tracking | MediaPipe Hands |
| UI Layer | HTML / CSS / Vanilla JS |

**Backend**

| Component | Technology |
|-----------|------------|
| Server | Python / FastAPI |
| API Layer | REST endpoints |
| Session | In-memory (MVP) |

**External Services**

| Service | Provider | Purpose |
|---------|----------|---------|
| Text-to-Speech | ElevenLabs | NPC voices |
| Speech-to-Text | ElevenLabs | Player voice input |
| NPC Logic | Claude API | Conversation handling |

**Infrastructure**

| Component | Technology |
|-----------|------------|
| Hosting (Frontend) | Vercel |
| Hosting (Backend) | Railway / Render |

### **10.3 Conversation Flow**

```
Player speaks
      │
      ▼
┌─────────────────┐
│ ElevenLabs STT  │
│ POST /v1/speech-│
│ to-text         │
└─────────────────┘
      │
      ▼ transcription
┌─────────────────┐
│ Claude API      │
│ - NPC persona   │
│ - Quest state   │
│ - Correction    │
└─────────────────┘
      │
      ▼ NPC reply
┌─────────────────┐
│ ElevenLabs TTS  │
│ POST /v1/text-  │
│ to-speech       │
└─────────────────┘
      │
      ▼ audio
┌─────────────────┐
│ Client          │
│ - Play audio    │
│ - Show subtitle │
│ - Update UI     │
└─────────────────┘
```

### **10.4 ElevenLabs API Endpoints**

**Speech-to-Text**

| Property | Value |
|----------|-------|
| Endpoint | `POST https://api.elevenlabs.io/v1/speech-to-text` |
| Docs | https://elevenlabs.io/docs/api-reference/speech-to-text/convert |
| Input | Audio file (multipart/form-data) |
| Output | `{ "text": "transcribed text" }` |

**Text-to-Speech**

| Property | Value |
|----------|-------|
| Endpoint | `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}` |
| Docs | https://elevenlabs.io/docs/api-reference/text-to-speech/convert |
| Input | `{ "text": "...", "model_id": "eleven_multilingual_v2" }` |
| Output | Audio stream (mp3) |

**Text-to-Speech Streaming**

| Property | Value |
|----------|-------|
| Endpoint | `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream` |
| Docs | https://elevenlabs.io/docs/api-reference/text-to-speech/convert-as-stream |
| Input | `{ "text": "...", "model_id": "eleven_multilingual_v2" }` |
| Output | Chunked audio stream |

**Voices**

| Property | Value |
|----------|-------|
| Endpoint | `GET https://api.elevenlabs.io/v1/voices` |
| Docs | https://elevenlabs.io/docs/api-reference/voices/get-all |
| Use | List available voices, select Polish-compatible voices |

### **10.5 Claude API Integration**

| Property | Value |
|----------|-------|
| Endpoint | `POST https://api.anthropic.com/v1/messages` |
| Model | `claude-3-5-sonnet-20240620` |

**Request Structure**

```json
{
  "model": "claude-3-5-sonnet-20240620",
  "max_tokens": 256,
  "system": "[NPC persona + teaching instructions]",
  "messages": [
    { "role": "user", "content": "[player transcription]" }
  ]
}
```

### **10.6 Backend API Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/conversation/start` | POST | Init conversation, return greeting |
| `/api/conversation/respond` | POST | Send audio, return NPC response + audio |
| `/api/conversation/end` | POST | End conversation, update quest |
| `/api/vocabulary` | GET | Fetch vocabulary list |
| `/api/vocabulary` | POST | Log player attempt |
| `/api/quest/state` | GET | Get quest progress |

---

## **11. UI Components**

| Component | Description |
|-----------|-------------|
| Speech bubble | Player transcription with errors bolded |
| Subtitles | NPC dialogue (Polish, fading English) |
| Vocabulary journal | Learned words, attempts, accuracy |
| Objective hint | Current quest goal |
| Interaction prompt | "Handshake to talk" when near NPC |
| Bird dialogue | Bilingual help (English + Polish) |

---

## **12. Scope**

**In Scope (MVP):**
- [ ] 1 village, 4 locations
- [ ] 5 NPCs (child, Mati, Jade, Kitty, bird)
- [ ] 1 quest
- [ ] Hand gesture navigation (TBD)
- [ ] Handshake to initiate conversation
- [ ] Voice interaction via ElevenLabs
- [ ] Claude-powered NPC conversations
- [ ] Speech feedback with error highlighting
- [ ] Bird helper (bilingual)
- [ ] Vocabulary journal