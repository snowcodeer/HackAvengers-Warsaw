import sqlite3
import json
from typing import Dict, Any, Optional

DB_PATH = "user_progress.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # User progress table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_progress (
        user_id TEXT PRIMARY KEY,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        total_xp INTEGER DEFAULT 0,
        streaks_current INTEGER DEFAULT 0,
        streaks_best INTEGER DEFAULT 0,
        streaks_last_practice INTEGER,
        conversations_json TEXT, 
        achievements_json TEXT,
        last_updated INTEGER
    )
    ''')
    
    conn.commit()
    conn.close()

def save_progress(user_id: str, data: Dict[str, Any]):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    conversations = json.dumps(data.get("conversations", []))
    achievements = json.dumps(data.get("achievements", []))
    streaks = data.get("streaks", {})
    
    cursor.execute('''
    INSERT OR REPLACE INTO user_progress 
    (user_id, xp, level, total_xp, streaks_current, streaks_best, streaks_last_practice, conversations_json, achievements_json, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        data.get("xp", 0),
        data.get("level", 1),
        data.get("totalXP", 0),
        streaks.get("current", 0),
        streaks.get("best", 0),
        streaks.get("lastPractice"),
        conversations,
        achievements,
        int(streaks.get("lastPractice") or 0) # approximation for last updated
    ))
    
    conn.commit()
    conn.close()

def load_progress(user_id: str) -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM user_progress WHERE user_id = ?', (user_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            "xp": row["xp"],
            "level": row["level"],
            "totalXP": row["total_xp"],
            "streaks": {
                "current": row["streaks_current"],
                "best": row["streaks_best"],
                "lastPractice": row["streaks_last_practice"]
            },
            "conversations": json.loads(row["conversations_json"]),
            "achievements": json.loads(row["achievements_json"])
        }
    return None

# Initialize DB on import
init_db()
