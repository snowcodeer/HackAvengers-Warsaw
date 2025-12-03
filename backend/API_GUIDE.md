# Mówka Backend

This is the backend for the Mówka language learning game, built with FastAPI.

## Current Capabilities

The backend currently provides the following API endpoints (mocked data):

### Conversation (`/api/conversation`)
- `POST /start`: Initializes a conversation session with an NPC.
- `POST /respond`: Accepts audio/text input and returns an NPC response.
  - *Note*: Currently mocks STT and returns a placeholder response.
- `POST /end`: Ends the conversation session.

### Quest & Vocabulary (`/api/quest`)
- `GET /state`: Returns the current quest state (e.g., "Find the lost cat").
- `GET /vocabulary`: Returns a list of learned words.

## Tests

The project includes automated tests using `pytest` to verify API functionality:

- `test_read_main`: Checks if the server is running and root endpoint returns 200 OK.
- `test_start_conversation`: Verifies conversation initialization with an NPC.
- `test_quest_state`: Verifies the initial quest state is returned correctly.
