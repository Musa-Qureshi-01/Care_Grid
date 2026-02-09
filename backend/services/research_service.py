"""
File: backend/services/research_service.py
Purpose:
AI-powered Medical Research Agent using Google Gemini.
Simplified version with fallback when LangChain isn't available.
Now with SQLite-backed persistent memory.
"""

import os
from typing import Dict, Any, List
from datetime import datetime

# LangChain is now handled inside agents/research_agent.py

# Try Google GenAI for simple fallback
GENAI_AVAILABLE = False
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    print("google.generativeai not available")

# Database memory service with fallback
try:
    from backend.services.memory_service import (
        add_message,
        get_messages,
        clear_messages,
        get_recent_messages,
        get_all_conversations,
        delete_conversation,
        get_stats
    )
    MEMORY_AVAILABLE = True
except ImportError:
    MEMORY_AVAILABLE = False
    # Fallback in-memory storage
    _conversation_history: Dict[str, List[Dict]] = {}
    
    def add_message(session_id: str, role: str, content: str, metadata=None):
        if session_id not in _conversation_history:
            _conversation_history[session_id] = []
        _conversation_history[session_id].append({
            "role": role, "content": content, "timestamp": datetime.now().isoformat()
        })
        return {"id": len(_conversation_history[session_id])}
    
    def get_messages(session_id: str, limit=100):
        return _conversation_history.get(session_id, [])[:limit]
    
    def clear_messages(session_id: str):
        if session_id in _conversation_history:
            _conversation_history[session_id] = []
        return True
    
    def get_recent_messages(session_id: str, count=10):
        msgs = _conversation_history.get(session_id, [])
        return msgs[-count:] if msgs else []
    
    def get_all_conversations():
        return [{"session_id": k, "message_count": len(v)} for k, v in _conversation_history.items()]
    
    def delete_conversation(session_id: str):
        if session_id in _conversation_history:
            del _conversation_history[session_id]
            return True
        return False
    
    def get_stats():
        return {"total_conversations": len(_conversation_history), "memory_type": "in-memory"}


# ============================================
# Simple Drug Database (built-in)
# ============================================

DRUG_DATABASE = {
    "aspirin": {
        "generic_name": "Acetylsalicylic acid",
        "brand_names": ["Bayer", "Bufferin", "Ecotrin"],
        "drug_class": "NSAID",
        "uses": "Pain relief, fever reduction, anti-inflammatory, blood thinner",
        "side_effects": "Stomach upset, heartburn, nausea, bleeding risk",
        "warnings": "Not for children under 12, avoid with blood thinners"
    },
    "ibuprofen": {
        "generic_name": "Ibuprofen",
        "brand_names": ["Advil", "Motrin", "Nurofen"],
        "drug_class": "NSAID",
        "uses": "Pain relief, fever reduction, anti-inflammatory",
        "side_effects": "Stomach upset, dizziness, headache",
        "warnings": "May increase cardiovascular risk with long-term use"
    },
    "metformin": {
        "generic_name": "Metformin hydrochloride",
        "brand_names": ["Glucophage", "Fortamet"],
        "drug_class": "Biguanide (Antidiabetic)",
        "uses": "Type 2 diabetes, blood sugar control",
        "side_effects": "Nausea, diarrhea, metallic taste",
        "warnings": "Risk of lactic acidosis, avoid with kidney disease"
    },
    "lisinopril": {
        "generic_name": "Lisinopril",
        "brand_names": ["Prinivil", "Zestril"],
        "drug_class": "ACE Inhibitor",
        "uses": "High blood pressure, heart failure",
        "side_effects": "Dry cough, dizziness, headache",
        "warnings": "Not for pregnancy, monitor potassium"
    }
}


# ============================================
# Customer Care Knowledge Base
# ============================================

CUSTOMER_CARE_KB = {
    "update provider": "To update provider information: Log into dashboard > Provider Management > Search & Edit > Submit for verification.",
    "add provider": "To add a new provider: Dashboard > Batch Processing > Upload CSV > Run validation > Review results.",
    "verification": "Check verification status in Dashboard > Overview with color-coded risk levels.",
    "compliance": "CareGrid maintains 48-hour turnaround compliance with automated validation.",
    "export": "Export data: Navigate to results page > Click Export > Choose CSV or JSON.",
    "batch": "Batch processing supports up to 300 records. Upload CSV with name, address, phone, specialty."
}


def lookup_drug(query: str) -> str:
    """Look up drug information."""
    query_lower = query.lower()
    for drug_name, info in DRUG_DATABASE.items():
        if drug_name in query_lower:
            return f"""
**{info['generic_name']}** ({', '.join(info['brand_names'])})
- Class: {info['drug_class']}
- Uses: {info['uses']}
- Side Effects: {info['side_effects']}
- Warnings: {info['warnings']}

⚠️ Consult a healthcare provider for medical advice.
"""
    return None


def lookup_customer_care(query: str) -> str:
    """Look up customer care answers."""
    query_lower = query.lower()
    for keyword, answer in CUSTOMER_CARE_KB.items():
        if keyword in query_lower:
            return answer
    return None


# ============================================
# Simple Gemini Agent (fallback)
# ============================================

def simple_gemini_response(query: str, context: str = "") -> str:
    """Use Google Gemini directly for responses."""
    api_key = os.getenv("GOOGLE_API_KEY", "")
    
    if not api_key or api_key == "your_google_gemini_key_here":
        return "⚠️ GOOGLE_API_KEY not configured. Please set a valid API key in your .env file."
    
    if not GENAI_AVAILABLE:
        return "⚠️ Google GenAI package not installed. Run: pip install google-generativeai"
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Check for drug queries first
        drug_info = lookup_drug(query)
        if drug_info:
            return drug_info
        
        # Check customer care queries
        care_info = lookup_customer_care(query)
        if care_info:
            return care_info
        
        # Use Gemini for general queries
        prompt = f"""You are CareGrid Research Assistant, a helpful AI for:
1. Medical research and information
2. Drug information
3. Healthcare provider questions
4. CareGrid platform support

{context}

User question: {query}

Provide a helpful, concise response. For medical questions, include a disclaimer to consult healthcare providers."""

        response = model.generate_content(prompt)
        return response.text
        
    except Exception as e:
        return f"⚠️ Error: {str(e)}"


# ============================================
# Cached Agent (LangChain version)
# ============================================

# Import the agent from your AGENTS folder
try:
    from agents.research_agent import build_research_agent
except ImportError:
    build_research_agent = None


_agent_cache = None

def get_agent():
    """Get or create agent using the logic in agents/research_agent.py"""
    global _agent_cache
    if _agent_cache is None:
        if build_research_agent:
            _agent_cache = build_research_agent()
    return _agent_cache


# ============================================
# Main Service Functions
# ============================================

def run_research_query(query: str, session_id: str = "default") -> Dict[str, Any]:
    """Run a research query - uses LangChain if available, otherwise simple Gemini."""
    try:
        # Get conversation context
        recent = get_recent_messages(session_id, count=4)
        context = ""
        if recent:
            context = "Recent conversation:\n" + "\n".join(
                f"{m['role']}: {m['content'][:100]}..." for m in recent
            )
        
        # Try to use LangChain agent for real agentic execution
        agent = get_agent()
        
        if agent:
            try:
                # Run agent with ReAct reasoning
                result = agent.invoke({"input": query})
                response = result.get("output", "No response generated")
                
                # Track which tools were used
                tools_used = []
                if "intermediate_steps" in result:
                    for step in result["intermediate_steps"]:
                        if len(step) > 0 and hasattr(step[0], 'tool'):
                            tools_used.append(step[0].tool)
                
            except Exception as e:
                print(f"Agent execution error: {e}")
                # Fallback to simple Gemini
                response = simple_gemini_response(query, context)
                tools_used = []
        else:
            # Fallback if agent creation failed
            response = simple_gemini_response(query, context)
            tools_used = []
        
        # Save to memory
        add_message(session_id, "user", query)
        add_message(session_id, "assistant", response)
        
        return {
            "status": "success",
            "response": response,
            "query": query,
            "session_id": session_id,
            "timestamp": datetime.now().isoformat(),
            "tools_used": list(set(tools_used)) if tools_used else [],
            "has_memory": MEMORY_AVAILABLE
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "message": "An error occurred. Please check your GOOGLE_API_KEY."
        }


def get_conversation_history(session_id: str = "default") -> List[Dict]:
    """Get conversation history."""
    return get_messages(session_id)


def clear_conversation_history(session_id: str = "default"):
    """Clear conversation history."""
    clear_messages(session_id)
    return {"status": "cleared", "session_id": session_id}


def get_all_sessions() -> List[Dict]:
    """Get all sessions."""
    return get_all_conversations()


def delete_session(session_id: str) -> Dict:
    """Delete a session."""
    deleted = delete_conversation(session_id)
    return {"status": "deleted" if deleted else "not_found", "session_id": session_id}


def get_memory_stats() -> Dict:
    """Get memory stats."""
    return get_stats()
