from fastapi import APIRouter
from typing import List
from ..services.job_service import job_service

router = APIRouter(
    prefix="/api/jobs",
    tags=["jobs"]
)

@router.get("/history")
async def get_job_history(limit: int = 50):
    """
    Get the history of background jobs.
    """
    return job_service.get_jobs(limit)

@router.get("/stats")
async def get_dashboard_stats():
    """
    Get aggregated dashboard statistics.
    """
    return job_service.get_dashboard_stats()

@router.get("/{job_id}")
async def get_job_status(job_id: str):
    """
    Get the status of a specific job.
    """
    job = job_service.get_job(job_id)
    if not job:
        return {"error": "Job not found"}
    return job
