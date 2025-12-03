# Landing Page - Waitlist

A simple one-viewport waitlist page with the same 8-bit UI style as the main game.

## Structure

- `index.html` - Main waitlist page
- `styles.css` - 8-bit pixelated styling matching the home page
- `script.js` - Form handling and snowfall animation
- `backend/` - Separate FastAPI backend for waitlist (runs on port 8001)

## Running the Landing Page

### Frontend (Static HTML)

Simply open `index.html` in a browser, or serve it with any static file server:

```bash
# Using Python
cd landing-page
python3 -m http.server 8080

# Using Node.js http-server
npx http-server -p 8080
```

### Backend

1. Install dependencies:
```bash
cd landing-page/backend
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn main:app --reload --port 8001
```

The backend will store waitlist entries in `backend/data/waitlist.json`

## Features

- ✅ 8-bit pixelated UI matching the main game
- ✅ Animated snowfall
- ✅ Email validation
- ✅ Success/error messages
- ✅ Separate backend (doesn't interfere with main backend)
- ✅ One viewport design

