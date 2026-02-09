"""
File: backend/routers/agents_router.py
Purpose:
This file defines the API Endpoints (URLs) for our agents.
Think of this as the "Front Desk" of the backend.

Endpoints:
- POST /api/agents/validate : Triggers validation
- POST /api/agents/enrich   : Triggers enrichment
- POST /api/agents/score    : Triggers scoring

It uses 'pydantic' models to ensure data is correct before processing.
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
import json
import asyncio
from typing import Dict, Any

# Absolute imports for running as 'python -m backend.main'
from backend.schemas.request_models import ProviderInput, AgentResponse, BatchProviderInput, BatchAnalysisResponse
from backend.services.agent_service import (
    run_validation,
    run_enrichment,
    run_quality_check,
    run_directory_update,
    run_batch_pipeline,
    run_full_pipeline,
    get_pipeline,
    load_providers_csv,
    run_bulk_validation,
    run_bulk_enrichment,
    start_monitoring,
    stop_monitoring,
    get_monitoring_status,
    check_for_changes
)

# Create a router instance.
router = APIRouter(
    prefix="/api",
    tags=["AI Agents"]
)

@router.post("/validate-provider", response_model=AgentResponse)
async def validate_provider_endpoint(provider: ProviderInput):
    """
    Endpoint: Trigger Validation Agent
    path: /api/validate-provider
    """
    try:
        provider_dict = provider.model_dump()
        result = run_validation(provider_dict)
        return AgentResponse(
            status="success",
            agent_name="Validation Agent",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/enrich-provider", response_model=AgentResponse)
async def enrich_provider_endpoint(provider: ProviderInput):
    """
    Endpoint: Trigger Enrichment Agent
    path: /api/enrich-provider
    """
    try:
        provider_dict = provider.model_dump()
        result = run_enrichment(provider_dict)
        return AgentResponse(
            status="success",
            agent_name="Enrichment Agent",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/score-provider", response_model=AgentResponse)
async def score_provider_endpoint(provider: ProviderInput):
    """
    Endpoint: Trigger QA Scoring Agent
    path: /api/score-provider
    """
    try:
        provider_dict = provider.model_dump()
        result = run_quality_check(provider_dict)
        return AgentResponse(
            status="success",
            agent_name="QA Scoring Agent",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-directory", response_model=AgentResponse)
async def directory_update_endpoint(provider: ProviderInput):
    """
    Endpoint: Trigger Directory Manager Agent
    path: /api/generate-directory
    """
    try:
        provider_dict = provider.model_dump()
        result = run_directory_update(provider_dict)
        return AgentResponse(
            status="success",
            agent_name="Directory Manager",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch", response_model=BatchAnalysisResponse)
async def batch_process_endpoint(batch_input: BatchProviderInput):
    """
    Endpoint: Trigger Batch Processing
    path: /api/batch
    """
    try:
        # Convert list of Pydantic models to list of dicts
        providers_list = [p.model_dump() for p in batch_input.providers]
        
        result = run_batch_pipeline(providers_list)
        
        return BatchAnalysisResponse(**result)
    except Exception as e:
        print(f"Batch Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics")
async def get_analytics():
    """
    Endpoint: Dashboard Analytics
    path: /api/analytics
    """
    # Mock data for now, would connect to DB in real prod
    return {
        "total_providers": 12450,
        "validation_accuracy": 99.8,
        "correction_rate": 12.5,
        "recent_activity": [
            {"id": 1, "action": "Validated John Doe", "timestamp": "2 mins ago"},
            {"id": 2, "action": "Enriched Jane Smith", "timestamp": "5 mins ago"},
            {"id": 3, "action": "Flagged Anomaly", "timestamp": "12 mins ago"}
        ]
    }

@router.get("/agent-status")
async def get_agent_status():
    """
    Endpoint: Agent Health/Status
    path: /api/agent-status
    """
    return {
        "status": "operational",
        "active_agents": 4,
        "uptime": "99.9%"
    }


# ============================================
# NEW: Full Pipeline & Provider Endpoints
# ============================================

@router.get("/providers")
async def get_providers():
    """
    Endpoint: Get all providers from CSV
    path: /api/providers
    Returns list of providers for frontend dropdown.
    """
    try:
        providers = load_providers_csv()
        return {
            "status": "success",
            "count": len(providers),
            "providers": providers
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper function to get a fresh pipeline instance
def get_fresh_pipeline():
    """Create a fresh LangGraph pipeline for every request to avoid state leakage."""
    return build_pipeline()

@router.post("/run-pipeline")
async def run_pipeline_endpoint(provider: ProviderInput):
    """
    Endpoint: Run the full 4-agent LangGraph pipeline
    path: /api/run-pipeline
    
    This executes the real pipeline:
    Agent 1 (Validation) → Agent 2 (Enrichment) → Agent 3 (QA) → Agent 4 (Directory)
    """
    try:
        provider_dict = provider.model_dump()
        result = run_full_pipeline(provider_dict)
        return result
    except Exception as e:
        print(f"Pipeline Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/run-stream")
async def run_pipeline_stream(provider: ProviderInput):
    """
    Stream the LangGraph pipeline execution using Server-Sent Events (SSE).
    This allows the frontend to see 'internal working' of agents in real-time.
    """
    pipeline = get_pipeline()
    
    async def event_generator():
        initial_state = {"provider": provider.model_dump()}
        
        try:
            # astream_events provides granular events (tool calls, node transitions)
            async for event in pipeline.astream_events(initial_state, version="v1"):
                kind = event["event"]
                
                # We are interested in Node transitions and Tool executions
                if kind in ["on_chain_start", "on_chain_end", "on_tool_start", "on_tool_end"]:
                    # Create a simplified event object for frontend
                    payload = {
                        "type": kind,
                        "name": event["name"],
                        "data": str(event["data"])[:1000] # Truncate large data to avoid SSE issues
                    }
                    
                    # Extract specific outputs if available
                    if "output" in event["data"]:
                        payload["output"] = event["data"]["output"]
                    if "input" in event["data"]:
                         payload["input"] = event["data"]["input"]

                    yield f"data: {json.dumps(payload)}\n\n"
                    
            yield "data: [DONE]\n\n"

        except Exception as e:
            error_payload = {"type": "error", "message": str(e)}
            yield f"data: {json.dumps(error_payload)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

# ============================================
# NEW: Bulk Automation Endpoints
# ============================================

@router.post("/agents/validate-bulk")
async def validate_bulk_endpoint(batch_input: BatchProviderInput):
    """
    Endpoint: Bulk validate providers
    path: /api/agents/validate-bulk
    """
    try:
        providers_list = [p.model_dump() for p in batch_input.providers]
        result = run_bulk_validation(providers_list, clean_data=True)
        return result
    except Exception as e:
        print(f"Bulk Validation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/agents/enrich-bulk")
async def enrich_bulk_endpoint(batch_input: BatchProviderInput):
    """
    Endpoint: Bulk enrich providers
    path: /api/agents/enrich-bulk
    """
    try:
        providers_list = [p.model_dump() for p in batch_input.providers]
        result = run_bulk_enrichment(providers_list, save_to_db=True)
        return result
    except Exception as e:
        print(f"Bulk Enrichment Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/agents/monitor/start")
async def start_monitoring_endpoint(interval_minutes: int = 60):
    """
    Endpoint: Start provider monitoring
    path: /api/agents/monitor/start
    """
    try:
        result = start_monitoring(interval_minutes)
        return result
    except Exception as e:
        print(f"Start Monitoring Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/agents/monitor/stop")
async def stop_monitoring_endpoint():
    """
    Endpoint: Stop provider monitoring
    path: /api/agents/monitor/stop
    """
    try:
        result = stop_monitoring()
        return result
    except Exception as e:
        print(f"Stop Monitoring Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/agents/monitor/status")
async def get_monitoring_status_endpoint():
    """
    Endpoint: Get current monitoring status
    path: /api/agents/monitor/status
    """
    try:
        result = get_monitoring_status()
        return result
    except Exception as e:
        print(f"Get Monitoring Status Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/agents/monitor/check")
async def check_for_changes_endpoint():
    """
    Endpoint: Manually trigger change detection
    path: /api/agents/monitor/check
    """
    try:
        result = check_for_changes()
        return result
    except Exception as e:
        print(f"Check For Changes Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
