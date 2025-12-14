#!/usr/bin/env python3
"""
Simple script to view and export waitlist emails from SQLite database.
Usage:
    python3 view_waitlist.py              # View all emails
    python3 view_waitlist.py --export csv  # Export as CSV
    python3 view_waitlist.py --export json # Export as JSON
"""

import sqlite3
import csv
import json
import argparse
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).parent / "data" / "waitlist.db"


def view_waitlist():
    """View all waitlist entries."""
    if not DB_PATH.exists():
        print("No waitlist database found.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, email, joined_at FROM waitlist ORDER BY joined_at DESC")
    rows = cursor.fetchall()
    
    if not rows:
        print("Waitlist is empty.")
        return
    
    print(f"\nTotal emails: {len(rows)}\n")
    print(f"{'ID':<5} {'Email':<40} {'Joined At'}")
    print("-" * 80)
    
    for row in rows:
        print(f"{row['id']:<5} {row['email']:<40} {row['joined_at']}")
    
    conn.close()


def export_csv(output_file="waitlist_export.csv"):
    """Export waitlist to CSV file."""
    if not DB_PATH.exists():
        print("No waitlist database found.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, email, joined_at FROM waitlist ORDER BY joined_at DESC")
    rows = cursor.fetchall()
    
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["ID", "Email", "Joined At"])
        for row in rows:
            writer.writerow([row['id'], row['email'], row['joined_at']])
    
    print(f"Exported {len(rows)} emails to {output_file}")
    conn.close()


def export_json(output_file="waitlist_export.json"):
    """Export waitlist to JSON file."""
    if not DB_PATH.exists():
        print("No waitlist database found.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, email, joined_at FROM waitlist ORDER BY joined_at DESC")
    rows = cursor.fetchall()
    
    waitlist = [
        {
            "id": row['id'],
            "email": row['email'],
            "joined_at": row['joined_at']
        }
        for row in rows
    ]
    
    with open(output_file, 'w') as f:
        json.dump({"waitlist": waitlist, "count": len(waitlist)}, f, indent=2)
    
    print(f"Exported {len(waitlist)} emails to {output_file}")
    conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="View or export waitlist emails")
    parser.add_argument(
        "--export",
        choices=["csv", "json"],
        help="Export format (csv or json)"
    )
    parser.add_argument(
        "--output",
        help="Output file name (default: waitlist_export.csv or waitlist_export.json)"
    )
    
    args = parser.parse_args()
    
    if args.export == "csv":
        output_file = args.output or "waitlist_export.csv"
        export_csv(output_file)
    elif args.export == "json":
        output_file = args.output or "waitlist_export.json"
        export_json(output_file)
    else:
        view_waitlist()

