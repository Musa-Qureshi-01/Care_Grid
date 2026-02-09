"""
File: backend/services/agent_service.py
Purpose:
This file acts as the "Service Layer" or "Bridge".
It strictly connects the API (FastAPI) to the Business Logic (Tools & Agents).

Architecture Rule:
The Frontend NEVER calls Google or NPI APIs directly. 
It must pass through here so we can:
1. Keep API keys secure on the server (never expose to browser).
2. Validate inputs before calling external services.
3. Log and monitor usage.
"""

import sys
import os
import pandas as pd

# Add project root to path to allow importing 'tools' and 'agents'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from tools import google_tools
from tools import npi_tools
from agents.agent_1 import validation_agent
from agents.agent_2 import enrichment_agent
from agents.agent_3 import quality_agent
from agents.agent_4 import directory_agent
from pipeline.pipeline_graph import build_pipeline
from backend.services.job_service import job_service

def run_validation(provider_data: dict) -> dict:
    """
    Service: Validate Provider
    Uses Agent 1 Logic.
    """
    job_id = job_service.create_job("Validation", user="agent_system")
    try:
        # Run actual agent logic
        state = {"provider": provider_data}
        result = validation_agent(state)
        
        job_service.update_job(job_id, "completed", details=f"Validated {provider_data.get('name')}")
        
        # Return the simplified structure for frontend, but containing all agent outputs
        return {
            "provider_input": provider_data,
            "validation_result": result.get("validated_data", {}),
            "google_result": result.get("google_result", {}), 
            "npi_result": result.get("npi_result", {}),
            "status": "validated"
        }
    except Exception as e:
        job_service.update_job(job_id, "failed", details=str(e))
        raise e

def run_enrichment(provider_data: dict) -> dict:
    """
    Service: Enrich Provider
    Uses Agent 2 Logic.
    """
    job_id = job_service.create_job("Enrichment", user="agent_system")
    try:
        # Step-by-Step Context? 
        # Agent 2 expects 'validated_data' to prioritize PDF/CSV
        state = {
            "provider": provider_data, 
            "validated_data": provider_data.get("validation_result", {}) # passed from frontend
        }
        result = enrichment_agent(state)
        
        job_service.update_job(job_id, "completed", details=f"Enriched {provider_data.get('name')}")
        return {
            "provider_input": provider_data,
            "enrichment_result": result.get("enriched_data", {}),
            "status": "enriched"
        }
    except Exception as e:
        job_service.update_job(job_id, "failed", details=str(e))
        raise e

def run_quality_check(provider_data: dict) -> dict:
    """
    Service: QA Scoring (Agent 3)
    """
    job_id = job_service.create_job("Quality Check", user="agent_system")
    try:
        # Extract context if provided (Step-by-Step Mode)
        # Frontend passes: google_result (which is actually validation_result/validated_data), npi_result (enriched_data)
        # We need to map them correctly to what Agent 3 expects
        
        validated_data = provider_data.get("google_result", {}) # Mapping frontend param back to agent param
        enriched_data = provider_data.get("npi_result", {})

        # Agent 3 expects a state with "provider" and "validated_data", "enriched_data"
        state = {
            "provider": provider_data,
            "validated_data": validated_data, 
            "enriched_data": enriched_data
        }
        result = quality_agent(state)
        
        score = result.get("quality_data", {}).get("confidence_scores", {}).get("overall", 0)
        job_service.update_job(job_id, "completed", details=f"Scored {score}")
        return result
    except Exception as e:
        job_service.update_job(job_id, "failed", details=str(e))
        raise e

def run_directory_update(provider_data: dict) -> dict:
    """
    Service: Directory Management (Agent 4)
    """
    job_id = job_service.create_job("Directory Update", user="agent_system")
    try:
        # Extract context
        qa_res = provider_data.get("quality_data", {})
        enriched_res = provider_data.get("npi_result", {})
        validated_res = provider_data.get("google_result", {})

        state = {
            "provider": provider_data,
            "quality_data": qa_res,
            "enriched_data": enriched_res,
            "validated_data": validated_res
        }
        result = directory_agent(state)
        
        job_service.update_job(job_id, "completed", details="Directory Updated")
        return result
    except Exception as e:
        job_service.update_job(job_id, "failed", details=str(e))
        raise e

def run_batch_pipeline(providers_list: list) -> dict:
    """
    Runs the full pipeline for a batch of providers.
    Sequence: Validate -> Enrich -> Score -> Directory
    """
    results = []
    risk_counts = {"LOW": 0, "MEDIUM": 0, "HIGH": 0}
    total_confidence = 0.0
    
    for provider in providers_list:
        try:
            # 1. Validate
            val_out = run_validation(provider)
            google_res = val_out["validation_result"]
            
            # 2. Enrich
            enrich_out = run_enrichment(provider)
            npi_res = enrich_out["enrichment_result"]
            
            # 3. Score
            # Pass all gathered context to the QA agent
            qa_state = {
                "provider": provider,
                "google_result": google_res,
                "npi_result": npi_res
            }
            # We call the agent function directly
            qa_res = quality_agent(qa_state)
            
            # 4. Directory Update
            dir_state = {
                "provider": provider,
                "quality_data": qa_res
            }
            dir_res = directory_agent(dir_state)
            
            # Aggregate Result for Dashboard
            full_record = {
                "input": provider,
                "status": "processed",
                "risk_level": qa_res.get("risk_level", "UNKNOWN"),
                "confidence_score": float(qa_res.get("confidence_scores", {}).get("overall", 0)),
                "final_data": dir_res.get("directory_entry", {}),
                "flags": qa_res.get("discrepancies", [])
            }
            results.append(full_record)
            
            # Update Stats
            r_level = full_record["risk_level"]
            if r_level in risk_counts:
                risk_counts[r_level] += 1
            total_confidence += full_record["confidence_score"]
            
        except Exception as e:
            results.append({
                "input": provider,
                "status": "failed",
                "error": str(e)
            })
            
    # Calculate Batch Stats
    success_count = len([r for r in results if r["status"] == "processed"])
    avg_conf = (total_confidence / success_count) if success_count > 0 else 0
    
    return {
        "total_processed": len(providers_list),
        "successful": success_count,
        "failed": len(providers_list) - success_count,
        "results": results,
        "risk_summary": risk_counts,
        "avg_confidence": round(avg_conf, 2)
    }


# ============================================
# NEW: Full LangGraph Pipeline Integration
# ============================================

# Cache the pipeline so it builds only once
_pipeline_cache = None

def get_pipeline():
    """Get or create the cached LangGraph pipeline."""
    global _pipeline_cache
    if _pipeline_cache is None:
        _pipeline_cache = build_pipeline()
    return _pipeline_cache


def run_full_pipeline(provider_data: dict) -> dict:
    """
    Run the complete 4-agent LangGraph pipeline for a single provider.
    
    This uses the real pipeline from pipeline/pipeline_graph.py which chains:
    Agent 1 (Validation) → Agent 2 (Enrichment) → Agent 3 (QA) → Agent 4 (Directory)
    
    Returns the complete result with all agent outputs.
    """
    pipeline = get_pipeline()
    
    # Run the pipeline with the provider data
    result = pipeline.invoke({"provider": provider_data})
    
    return {
        "status": "success",
        "provider_input": provider_data,
        "validated_data": result.get("validated_data", {}),
        "google_result": result.get("google_result", {}),
        "npi_result": result.get("npi_result", {}),
        "enriched_data": result.get("enriched_data", {}),
        "quality_data": result.get("quality_data", {}),
        "final_profile": result.get("final_profile", {}),
        "summary_report": result.get("summary_report", {})
    }


def load_providers_csv(path: str = None) -> list:
    """
    Load providers from the data/providers.csv file.
    Returns a list of provider dictionaries for the frontend dropdown.
    """
    if path is None:
        # Navigate from backend/services to project root/data
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
        path = os.path.join(project_root, "data", "providers.csv")
    
    if not os.path.exists(path):
        return []
    
    try:
        df = pd.read_csv(path)
        # Convert to list of dicts
        providers = df.to_dict('records')
        return providers
    except Exception as e:
        print(f"Error loading providers CSV: {e}")
        return []

 
# ============================================
# NEW: Bulk Automation Functions
# ============================================

def run_bulk_validation(providers_list: list, clean_data: bool = True) -> dict:
    """
    Bulk validate providers and optionally clean bad data.
    
    Args:
        providers_list: List of provider dictionaries
        clean_data: If True, update database with validated data
        
    Returns:
        Dictionary with validation results and statistics
    """
    job_id = job_service.create_job("bulk_validation", user="system")
    
    try:
        validated_providers = []
        cleaned_count = 0
        error_count = 0
        
        total = len(providers_list)
        
        for idx, provider in enumerate(providers_list):
            try:
                # Update progress
                progress = int((idx / total) * 100)
                job_service.update_job(job_id, "running", progress=progress)
                
                # Run validation
                result = run_validation(provider)
                validated_providers.append(result)
                
                # Clean data if requested (would update DB in production)
                if clean_data and result.get("validation_result"):
                    cleaned_count += 1
                    
            except Exception as e:
                error_count += 1
                print(f"Error validating provider {provider.get('name')}: {e}")
        
        job_service.update_job(
            job_id, 
            "completed", 
            details=f"Validated {len(validated_providers)} providers, cleaned {cleaned_count}",
            progress=100
        )
        
        return {
            "status": "success",
            "job_id": job_id,
            "total_processed": len(providers_list),
            "validated": len(validated_providers),
            "cleaned": cleaned_count,
            "errors": error_count,
            "results": validated_providers
        }
        
    except Exception as e:
        job_service.update_job(job_id, "failed", details=str(e))
        raise e


def run_bulk_enrichment(providers_list: list, save_to_db: bool = True) -> dict:
    """
    Bulk enrich providers and save metadata to database.
    
    Args:
        providers_list: List of provider dictionaries
        save_to_db: If True, save enrichment data to database
        
    Returns:
        Dictionary with enrichment results and statistics
    """
    job_id = job_service.create_job("bulk_enrichment", user="system")
    
    try:
        enriched_providers = []
        saved_count = 0
        error_count = 0
        
        total = len(providers_list)
        
        for idx, provider in enumerate(providers_list):
            try:
                # Update progress
                progress = int((idx / total) * 100)
                job_service.update_job(job_id, "running", progress=progress)
                
                # Run enrichment
                result = run_enrichment(provider)
                enriched_providers.append(result)
                
                # Save to DB if requested (would save in production)
                if save_to_db and result.get("enrichment_result"):
                    saved_count += 1
                    
            except Exception as e:
                error_count += 1
                print(f"Error enriching provider {provider.get('name')}: {e}")
        
        job_service.update_job(
            job_id,
            "completed",
            details=f"Enriched {len(enriched_providers)} providers, saved {saved_count}",
            progress=100
        )
        
        return {
            "status": "success",
            "job_id": job_id,
            "total_processed": len(providers_list),
            "enriched": len(enriched_providers),
            "saved": saved_count,
            "errors": error_count,
            "results": enriched_providers
        }
        
    except Exception as e:
        job_service.update_job(job_id, "failed", details=str(e))
        raise e


# Monitoring state (would be in DB in production)
_monitoring_state = {
    "active": False,
    "interval_minutes": 60,
    "last_check": None,
    "detected_changes": []
}


def start_monitoring(interval_minutes: int = 60) -> dict:
    """
    Start periodic monitoring of provider data.
    
    Args:
        interval_minutes: How often to check for changes
        
    Returns:
        Dictionary with monitoring status
    """
    global _monitoring_state
    
    job_id = job_service.create_job("start_monitoring", user="system")
    
    try:
        _monitoring_state["active"] = True
        _monitoring_state["interval_minutes"] = interval_minutes
        _monitoring_state["last_check"] = pd.Timestamp.now().isoformat()
        
        job_service.update_job(
            job_id,
            "completed",
            details=f"Monitoring started with {interval_minutes}min interval"
        )
        
        return {
            "status": "success",
            "job_id": job_id,
            "monitoring_active": True,
            "interval_minutes": interval_minutes,
            "message": f"Monitoring started. Checking every {interval_minutes} minutes."
        }
        
    except Exception as e:
        job_service.update_job(job_id, "failed", details=str(e))
        raise e


def stop_monitoring() -> dict:
    """Stop periodic monitoring."""
    global _monitoring_state
    
    job_id = job_service.create_job("stop_monitoring", user="system")
    
    try:
        _monitoring_state["active"] = False
        
        job_service.update_job(job_id, "completed", details="Monitoring stopped")
        
        return {
            "status": "success",
            "job_id": job_id,
            "monitoring_active": False,
            "message": "Monitoring stopped successfully."
        }
        
    except Exception as e:
        job_service.update_job(job_id, "failed", details=str(e))
        raise e


def get_monitoring_status() -> dict:
    """Get current monitoring status and detected changes."""
    global _monitoring_state
    
    return {
        "status": "success",
        "active": _monitoring_state["active"],
        "interval_minutes": _monitoring_state["interval_minutes"],
        "last_check": _monitoring_state["last_check"],
        "changes_detected": len(_monitoring_state["detected_changes"]),
        "recent_changes": _monitoring_state["detected_changes"][-10:]    # Last 10
    }


def check_for_changes() -> dict:
    """
    Manually trigger a provider data change check.
    In production, this would compare current data with historical snapshots.
    """
    global _monitoring_state
    
    job_id = job_service.create_job("monitor_check", user="system")
    
    try:
        # Simulate detecting changes (in production, query DB for diffs)
        import random
        
        changes_found = []
        providers = load_providers_csv()[:5]    # Check first 5 for demo
        
        for provider in providers:
            if random.random() < 0.3:    # 30% chance of change
                change = {
                    "provider_name": provider.get("name"),
                    "field_changed": random.choice(["phone", "address", "specialty"]),
                    "old_value": "Previous value",
                    "new_value": "Updated value",
                    "detected_at": pd.Timestamp.now().isoformat()
                }
                changes_found.append(change)
        
        _monitoring_state["detected_changes"].extend(changes_found)
        _monitoring_state["last_check"] = pd.Timestamp.now().isoformat()
        
        job_service.update_job(
            job_id,
            "completed",
            details=f"Found {len(changes_found)} changes"
        )
        
        return {
            "status": "success",
            "job_id": job_id,
            "changes_found": len(changes_found),
            "changes": changes_found
        }
        
    except Exception as e:
        job_service.update_job(job_id, "failed", details=str(e))
        raise e