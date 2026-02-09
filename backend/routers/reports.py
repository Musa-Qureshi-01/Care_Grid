from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from ..services.export_service import ExportService
from ..services.email_service import email_service, EmailService
from ..services.job_service import job_service

router = APIRouter(
    prefix="/api/reports",
    tags=["reports"]
)

# --- Schemas ---
class ExportRequest(BaseModel):
    format: str = "csv" # csv or json
    filters: Optional[Dict[str, Any]] = None

class EmailRequest(BaseModel):
    template_id: str
    recipients: List[str]
    data: Optional[Dict[str, Any]] = None

# --- Endpoints ---

@router.post("/export")
async def export_data(request: ExportRequest, background_tasks: BackgroundTasks):
    """
    Trigger a data export.
    Returns: File download or Job ID if async.
    For this MVP, we return the file directly for small datasets.
    """
    try:
        # 1. Log Job Start
        job_id = job_service.create_job("data_export", user="admin")
        
        # 2. Get Data (Mocking fetching from DB or Agent Service)
        # In a real app, inject ProviderService here.
        # We'll use dummy data for demonstration if DB isn't connected
        mock_providers = [
            {"id": 1, "name": "Dr. Smith", "npi": "1234567890", "status": "active"},
            {"id": 2, "name": "Dr. Doe", "npi": "0987654321", "status": "inactive"},
            {"id": 3, "name": "General Hospital", "npi": "1122334455", "status": "review_needed"},
        ]
        
        # 3. Process Export
        result = ExportService.export_provider_data(mock_providers, request.format)
        
        # 4. Log Completion
        job_service.update_job(job_id, "completed", details=f"Exported {len(mock_providers)} records to {request.format}")

        # 5. Return Response
        return Response(
            content=result["content"],
            media_type=result["media_type"],
            headers={"Content-Disposition": f"attachment; filename={result['filename']}"}
        )

    except Exception as e:
        # Log Failure
        if 'job_id' in locals():
            job_service.update_job(job_id, "failed", details=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/templates")
async def get_email_templates():
    """
    Get available email templates.
    """
    return email_service.get_templates()

@router.post("/email")
async def send_report_email(request: EmailRequest, background_tasks: BackgroundTasks):
    """
    Send a report via email (Async).
    """
    # 1. Log Job
    job_id = job_service.create_job("email_campaign", user="admin")
    
    # 2. Add to Background Tasks (Non-blocking)
    background_tasks.add_task(
        _process_email_sending, 
        job_id, 
        request.template_id, 
        request.recipients, 
        request.data
    )
    
    return {"message": "Email sending initiated", "job_id": job_id}

async def _process_email_sending(job_id: str, template_id: str, recipients: List[str], data: Any):
    """
    Background task wrapper for email sending to ensure job logging.
    """
    try:
        success = email_service.send_email(template_id, recipients, data)
        status = "completed" if success else "failed"
        details = f"Sent {template_id} to {len(recipients)} recipients" if success else "Failed to send email"
        job_service.update_job(job_id, status, details=details)
    except Exception as e:
        job_service.update_job(job_id, "failed", details=f"Error: {str(e)}")
