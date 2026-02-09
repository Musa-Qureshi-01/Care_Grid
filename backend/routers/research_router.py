"""
File: backend/routers/research_router.py
Purpose:
API endpoints for the Medical Research Agent.
Provides chat-style research queries and conversation history with SQLite persistence.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from backend.services.research_service import (
    run_research_query,
    get_conversation_history,
    clear_conversation_history,
    get_all_sessions,
    delete_session,
    get_memory_stats
)


router = APIRouter(
    prefix="/api/research",
    tags=["Research Agent"]
)


# ============================================
# Request/Response Models
# ============================================

class ResearchQuery(BaseModel):
    """Request model for research queries."""
    query: str
    session_id: Optional[str] = "default"


class ResearchResponse(BaseModel):
    """Response model for research queries."""
    status: str
    response: Optional[str] = None
    query: Optional[str] = None
    session_id: Optional[str] = None
    timestamp: Optional[str] = None
    error: Optional[str] = None
    message: Optional[str] = None
    has_memory: Optional[bool] = None


class ConversationMessage(BaseModel):
    """Model for a single conversation message."""
    role: str
    content: str
    timestamp: str


# ============================================
# Endpoints
# ============================================

@router.post("/query", response_model=ResearchResponse)
async def research_query(request: ResearchQuery):
    """
    Submit a research query to the AI agent.
    
    The agent will use tools like:
    - Wikipedia for medical articles
    - Web search for current information
    - Drug database for medication info
    - Customer care KB for platform questions
    """
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        result = run_research_query(request.query, request.session_id)
        return ResearchResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{session_id}")
async def get_history(session_id: str = "default") -> Dict:
    """
    Get conversation history for a session.
    """
    try:
        history = get_conversation_history(session_id)
        return {
            "status": "success",
            "session_id": session_id,
            "messages": history,
            "count": len(history)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/history/{session_id}")
async def clear_history(session_id: str = "default") -> Dict:
    """
    Clear conversation history for a session.
    """
    try:
        result = clear_conversation_history(session_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions")
async def list_sessions() -> Dict:
    """
    List all conversation sessions.
    """
    try:
        sessions = get_all_sessions()
        return {
            "status": "success",
            "sessions": sessions,
            "count": len(sessions)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/sessions/{session_id}")
async def remove_session(session_id: str) -> Dict:
    """
    Delete a conversation session and all its messages.
    """
    try:
        result = delete_session(session_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def memory_stats() -> Dict:
    """
    Get memory/database statistics.
    """
    try:
        stats = get_memory_stats()
        return {
            "status": "success",
            **stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def research_status():
    """
    Check if the research agent is operational.
    """
    import os
    api_key_set = bool(os.getenv("GOOGLE_API_KEY", ""))
    
    return {
        "status": "operational" if api_key_set else "api_key_missing",
        "api_key_configured": api_key_set,
        "memory_enabled": True,
        "tools_available": [
            "Wikipedia Search",
            "Web Search (DuckDuckGo)",
            "Drug Database",
            "Customer Care KB"
        ]
    }

