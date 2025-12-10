# Mówka Backend

This is the backend for the Mówka language learning game, built with FastAPI.

## Current Capabilities

The backend provides the following API endpoints with **real AI integration**:

### Conversation (`/api/conversation`)
- `POST /start`: Initializes a conversation with an NPC.
  - **LLM**: Uses **Claude 3 Haiku** to generate context-aware, goal-oriented greetings.
  - **TTS**: Streams audio using **ElevenLabs v3** with expressive voice tags.
- `POST /respond`: Accepts text input and returns an NPC response.
  - **Logic**: Handles redirects (wrong NPC), hints, and quest progression.
  - **Audio**: Returns an `audio_url` for streaming the response.
- `GET /audio/{audio_id}`: Streams generated audio directly to the client.

### Quest & Vocabulary (`/api/quest`)
- `GET /state`: Returns the current quest state.
- `POST /state`: Manually updates the quest state.
- `GET /vocabulary`: Returns a list of learned words.

## Project Status

- [x] **Core Backend Setup** (FastAPI, Project Structure)
- [x] **NPC Logic Engine** (Claude 3 Haiku Integration)
  - [x] Goal-oriented prompting
  - [x] Redirect logic for out-of-order interactions
  - [x] Automatic quest advancement via `[DONE]` tag
- [x] **Voice Integration** (ElevenLabs)
  - [x] Text-to-Speech (TTS) implementation
  - [x] Audio streaming endpoint
  - [x] Expressive voice tags (`[sadly]`, `[excited]`, etc.) using **Eleven v3**
  - [x] **Speech-to-Text (STT)** (Scribe v1)
    - [x] Backend proxy for secure transcription
    - [x] Language hint enforcement
  - [x] **Pronunciation Assessment**
    - [x] Multi-language feedback heuristics
    - [x] `/api/assess` endpoint
- [x] **Frontend Integration**
  - [x] Basic API connection
  - [x] Audio playback
  - [x] STT Input UI (Secure Backend Proxy)
  - [x] Quest UI updates
- [ ] **Game Content**
  - [ ] Expand questline beyond the initial "Find Cat" demo
  - [ ] Add more vocabulary tracking

## Setup & Running

1.  **Create Virtual Environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Environment Variables**:
    Create a `.env` file with:
    ```
    ANTHROPIC_API_KEY=your_key
    ELEVENLABS_API_KEY=your_key
    ```

4.  **Run Server**:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`. Documentation is at `/docs`.

5.  **Run Tests**:
    ```bash
    PYTHONPATH=. pytest
    ```
