"""
File: backend/services/memory_service.py
Purpose:
SQLite-backed conversation memory for the Research Agent.
Persists chat history across server restarts.
"""

import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Optional
import os

# Database path
# Database path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "research_memory.db")

# Fallback for alternative environments
if not os.path.exists(DB_PATH):
    alt_path = os.path.join(os.getcwd(), "research_memory.db")
    if os.path.exists(alt_path):
        DB_PATH = alt_path


def get_connection():
    """Get SQLite connection with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    """Initialize the database tables if they don't exist."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Create conversations table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            title TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(session_id)
        )
    """)
    
    # Create messages table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT,
            FOREIGN KEY (session_id) REFERENCES conversations(session_id)
        )
    """)
    
    # Create index for faster lookups
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_messages_session 
        ON messages(session_id)
    """)
    
    conn.commit()
    conn.close()


# Initialize database on module load
init_database()


# ============================================
# Conversation Functions
# ============================================

def create_or_get_conversation(session_id: str, title: Optional[str] = None) -> Dict:
    """Create a new conversation or get existing one."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Try to get existing conversation
    cursor.execute(
        "SELECT * FROM conversations WHERE session_id = ?", 
        (session_id,)
    )
    row = cursor.fetchone()
    
    if row:
        conn.close()
        return dict(row)
    
    # Create new conversation
    cursor.execute(
        "INSERT INTO conversations (session_id, title) VALUES (?, ?)",
        (session_id, title or f"Conversation {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    )
    conn.commit()
    
    cursor.execute(
        "SELECT * FROM conversations WHERE session_id = ?", 
        (session_id,)
    )
    row = cursor.fetchone()
    conn.close()
    
    return dict(row)


def get_all_conversations(limit: int = 50) -> List[Dict]:
    """Get all conversations, ordered by most recent."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT c.*, 
               (SELECT COUNT(*) FROM messages m WHERE m.session_id = c.session_id) as message_count
        FROM conversations c
        ORDER BY c.updated_at DESC
        LIMIT ?
    """, (limit,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]


def delete_conversation(session_id: str) -> bool:
    """Delete a conversation and all its messages."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
    cursor.execute("DELETE FROM conversations WHERE session_id = ?", (session_id,))
    
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    
    return deleted


# ============================================
# Message Functions
# ============================================

def add_message(session_id: str, role: str, content: str, metadata: Optional[Dict] = None) -> Dict:
    """Add a message to a conversation."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Ensure conversation exists
    create_or_get_conversation(session_id)
    
    # Insert message
    timestamp = datetime.now().isoformat()
    metadata_json = json.dumps(metadata) if metadata else None
    
    cursor.execute("""
        INSERT INTO messages (session_id, role, content, timestamp, metadata)
        VALUES (?, ?, ?, ?, ?)
    """, (session_id, role, content, timestamp, metadata_json))
    
    # Update conversation timestamp
    cursor.execute("""
        UPDATE conversations SET updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ?
    """, (session_id,))
    
    conn.commit()
    
    message_id = cursor.lastrowid
    conn.close()
    
    return {
        "id": message_id,
        "session_id": session_id,
        "role": role,
        "content": content,
        "timestamp": timestamp,
        "metadata": metadata
    }


def get_messages(session_id: str, limit: int = 100) -> List[Dict]:
    """Get all messages for a conversation."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM messages 
        WHERE session_id = ?
        ORDER BY timestamp ASC
        LIMIT ?
    """, (session_id, limit))
    
    rows = cursor.fetchall()
    conn.close()
    
    messages = []
    for row in rows:
        msg = dict(row)
        if msg.get('metadata'):
            msg['metadata'] = json.loads(msg['metadata'])
        messages.append(msg)
    
    return messages


def clear_messages(session_id: str) -> bool:
    """Clear all messages for a conversation."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
    
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    
    return deleted


def get_recent_messages(session_id: str, count: int = 10) -> List[Dict]:
    """Get the most recent N messages for context."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM (
            SELECT * FROM messages 
            WHERE session_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        ) ORDER BY timestamp ASC
    """, (session_id, count))
    
    rows = cursor.fetchall()
    conn.close()
    
    messages = []
    for row in rows:
        msg = dict(row)
        if msg.get('metadata'):
            msg['metadata'] = json.loads(msg['metadata'])
        messages.append(msg)
    
    return messages


# ============================================
# Stats Functions
# ============================================

def get_stats() -> Dict:
    """Get memory statistics."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as count FROM conversations")
    conversation_count = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM messages")
    message_count = cursor.fetchone()['count']
    
    conn.close()
    
    return {
        "total_conversations": conversation_count,
        "total_messages": message_count,
        "database_path": DB_PATH
    }
