from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from datetime import datetime
from pathlib import Path
import aiosqlite
import csv
import io

app = FastAPI(title="Mówka Waitlist Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to store waitlist database
DATA_DIR = Path(__file__).parent / "data"
DB_PATH = DATA_DIR / "waitlist.db"

# Ensure data directory exists
DATA_DIR.mkdir(exist_ok=True)


async def init_db():
    """Initialize the SQLite database and create tables if they don't exist."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS waitlist (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                joined_at TEXT NOT NULL
            )
        """)
        await db.execute("""
            CREATE INDEX IF NOT EXISTS idx_email ON waitlist(email)
        """)
        await db.commit()


@app.on_event("startup")
async def startup():
    """Initialize database on startup."""
    await init_db()


class WaitlistRequest(BaseModel):
    email: EmailStr


@app.post("/waitlist")
async def join_waitlist(request: WaitlistRequest):
    """
    Add an email to the waitlist.
    """
    try:
        async with aiosqlite.connect(DB_PATH) as db:
            # Check if email already exists
            cursor = await db.execute(
                "SELECT email FROM waitlist WHERE email = ?",
                (request.email,)
            )
            existing = await cursor.fetchone()
            
            if existing:
                raise HTTPException(
                    status_code=400,
                    detail="Email already on waitlist"
                )
            
            # Add new entry
            joined_at = datetime.now().isoformat()
            await db.execute(
                "INSERT INTO waitlist (email, joined_at) VALUES (?, ?)",
                (request.email, joined_at)
            )
            await db.commit()
        
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
        async with aiosqlite.connect(DB_PATH) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute(
                "SELECT id, email, joined_at FROM waitlist ORDER BY joined_at DESC"
            )
            rows = await cursor.fetchall()
            
            waitlist = [
                {
                    "id": row["id"],
                    "email": row["email"],
                    "joined_at": row["joined_at"]
                }
                for row in rows
            ]
        
        return {
            "waitlist": waitlist,
            "count": len(waitlist)
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve waitlist: {str(e)}"
        )


@app.get("/waitlist/export")
async def export_waitlist(format: str = "csv"):
    """
    Export waitlist entries as CSV or JSON.
    """
    try:
        async with aiosqlite.connect(DB_PATH) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute(
                "SELECT id, email, joined_at FROM waitlist ORDER BY joined_at DESC"
            )
            rows = await cursor.fetchall()
            
            if format.lower() == "csv":
                # Generate CSV
                output = io.StringIO()
                writer = csv.writer(output)
                writer.writerow(["ID", "Email", "Joined At"])
                
                for row in rows:
                    writer.writerow([row["id"], row["email"], row["joined_at"]])
                
                return Response(
                    content=output.getvalue(),
                    media_type="text/csv",
                    headers={"Content-Disposition": "attachment; filename=waitlist.csv"}
                )
            else:
                # Return as JSON
                waitlist = [
                    {
                        "id": row["id"],
                        "email": row["email"],
                        "joined_at": row["joined_at"]
                    }
                    for row in rows
                ]
                return {"waitlist": waitlist, "count": len(waitlist)}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to export waitlist: {str(e)}"
        )


@app.get("/")
async def root():
    return {"message": "Mówka Waitlist Backend is running"}

