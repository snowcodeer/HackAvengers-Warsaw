from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from datetime import datetime
import json
from pathlib import Path

app = FastAPI(title="Mówka Waitlist Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to store waitlist data
WAITLIST_FILE = Path(__file__).parent / "data" / "waitlist.json"

# Ensure data directory exists
WAITLIST_FILE.parent.mkdir(exist_ok=True)


class WaitlistRequest(BaseModel):
    email: EmailStr


@app.post("/waitlist")
async def join_waitlist(request: WaitlistRequest):
    """
    Add an email to the waitlist.
    """
    try:
        # Load existing waitlist
        waitlist = []
        if WAITLIST_FILE.exists():
            with open(WAITLIST_FILE, "r") as f:
                waitlist = json.load(f)
        
        # Check if email already exists
        if any(entry["email"] == request.email for entry in waitlist):
            raise HTTPException(
                status_code=400,
                detail="Email already on waitlist"
            )
        
        # Add new entry
        entry = {
            "email": request.email,
            "joined_at": datetime.now().isoformat()
        }
        waitlist.append(entry)
        
        # Save waitlist
        with open(WAITLIST_FILE, "w") as f:
            json.dump(waitlist, f, indent=2)
        
        return {
            "message": "Successfully joined waitlist",
            "email": request.email
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to join waitlist: {str(e)}"
        )


@app.get("/waitlist")
async def get_waitlist():
    """
    Get all waitlist entries (for admin purposes).
    """
    try:
        if not WAITLIST_FILE.exists():
            return {"waitlist": [], "count": 0}
        
        with open(WAITLIST_FILE, "r") as f:
            waitlist = json.load(f)
        
        return {
            "waitlist": waitlist,
            "count": len(waitlist)
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve waitlist: {str(e)}"
        )


@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Mount static files (must be last to avoid overriding API routes)
app.mount("/", StaticFiles(directory=Path(__file__).parent.parent, html=True), name="static")
