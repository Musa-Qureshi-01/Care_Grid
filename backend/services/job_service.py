import logging
import uuid
from datetime import datetime
from typing import List, Dict, Optional, Any
import json
import os

# Configure logging
logger = logging.getLogger(__name__)

# File-based persistence for demo purposes (avoids DB migration complexity)
JOB_HISTORY_FILE = "job_history.json"

class JobService:
    """
    Service to manage background jobs and their history.
    Simulates a persistent job queue/log.
    """
    
    def __init__(self):
        self._jobs: List[Dict[str, Any]] = self._load_jobs()

    def _load_jobs(self) -> List[Dict[str, Any]]:
        if os.path.exists(JOB_HISTORY_FILE):
            try:
                with open(JOB_HISTORY_FILE, "r") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Failed to load job history: {e}")
                return []
        return []

    def _save_jobs(self):
        try:
            with open(JOB_HISTORY_FILE, "w") as f:
                json.dump(self._jobs, f, default=str, indent=2)
        except Exception as e:
            logger.error(f"Failed to save job history: {e}")

    def create_job(self, type: str, user: str = "system") -> str:
        """
        Create a new job entry and return its ID.
        """
        job_id = str(uuid.uuid4())
        job = {
            "id": job_id,
            "type": type,
            "status": "pending",
            "started_at": datetime.now().isoformat(),
            "completed_at": None,
            "user": user,
            "details": f"Started {type} job",
            "progress": 0
        }
        self._jobs.insert(0, job) # Newest first
        self._save_jobs()
        logger.info(f"Created job {job_id} of type {type}")
        return job_id

    def update_job(self, job_id: str, status: str, details: Optional[str] = None, progress: int = None):
        """
        Update a job's status and details.
        """
        for job in self._jobs:
            if job["id"] == job_id:
                job["status"] = status
                if details:
                    job["details"] = details
                if progress is not None:
                    job["progress"] = progress
                
                if status in ["completed", "failed"]:
                    job["completed_at"] = datetime.now().isoformat()
                    if progress is None and status == "completed":
                         job["progress"] = 100
                
                self._save_jobs()
                logger.info(f"Updated job {job_id} to {status}")
                return
        logger.warning(f"Job {job_id} not found for update")

    def get_jobs(self, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Get recent jobs.
        """
        return self._jobs[:limit]

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        for job in self._jobs:
            if job["id"] == job_id:
                return job
        return None

    def get_dashboard_stats(self) -> Dict[str, Any]:
        """
        Calculate dashboard stats from job history.
        """
        total_jobs = len(self._jobs)
        completed_jobs = len([j for j in self._jobs if j["status"] == "completed"])
        failed_jobs = len([j for j in self._jobs if j["status"] == "failed"])
        
        # Calculate success rate
        success_rate = (completed_jobs / total_jobs * 100) if total_jobs > 0 else 0
        
        # Calculate average confidence (mock logic based on completed validation jobs)
        # In a real app, this would query the provider_result table
        validation_jobs = [j for j in self._jobs if "Validation" in j["type"] or "validation" in j["type"]]
        total_validated = len(validation_jobs)
        
        return {
            "total_providers": total_jobs, # Using jobs as proxy for providers for now
            "validation_success_rate": round(success_rate, 1),
            "high_risk_count": failed_jobs, # Using failed jobs as proxy for high risk/issues
            "avg_confidence": 0.95 if total_validated > 0 else 0.00
        }

# Singleton instance
job_service = JobService()
