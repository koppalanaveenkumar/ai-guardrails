import sqlite3
import json
from datetime import datetime
from pathlib import Path

DB_PATH = Path("audit.db")

def init_db():
    """Initialize the SQLite audit database."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            api_key TEXT,
            is_safe BOOLEAN,
            reason TEXT,
            latency_ms REAL,
            config_snapshot TEXT
        )
    ''')
    conn.commit()
    conn.close()

def log_request(api_key: str, is_safe: bool, reason: str, latency_ms: float, config: dict):
    """
    Log a request to the audit database.
    This should be run in a BackgroundTask to avoid blocking the response.
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''
            INSERT INTO audit_logs (timestamp, api_key, is_safe, reason, latency_ms, config_snapshot)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            datetime.now(),
            api_key,
            is_safe,
            reason,
            latency_ms,
            json.dumps(config)
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"⚠️ Failed to write audit log: {e}")
