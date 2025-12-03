# Landing Page Backend

Simple FastAPI backend for the waitlist functionality.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn main:app --reload --port 8001
```

The backend will run on `http://localhost:8001`

## Endpoints

- `POST /waitlist` - Add email to waitlist
- `GET /waitlist` - Get all waitlist entries (admin)

## Data Storage

Waitlist data is stored in `data/waitlist.json`

