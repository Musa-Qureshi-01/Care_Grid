"""
File: backend/schemas/request_models.py
Purpose:
This file defines the Strict Data Contracts (Schemas) for our API.
Using Pydantic ensures that:
1. Data sent to our API is valid
2. Data returned to frontend is consistent
3. We get automatic documentation (Swagger UI)

Beginner Note:
Think of these classes as "Blueprints" for the JSON data.
If the frontend sends data that doesn't match the blueprint, FastAPI rejects it automatically.
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class ProviderInput(BaseModel):
    """
    Blueprint for the raw provider data sent from Frontend.
    """
    name: str = Field(..., description="Name of the healthcare provider")
    npi: Optional[str] = Field(None, description="National Provider Identifier (10 digits)")
    address: Optional[str] = Field(None, description="Street address")
    phone: Optional[str] = Field(None, description="Phone number")
    specialty: Optional[str] = Field(None, description="Medical specialty")
    license: Optional[str] = Field(None, description="State license number")

    # Context fields for step-by-step execution (accumulated state)
    google_result: Optional[Dict[str, Any]] = Field(None, description="Result from Validation Agent")
    npi_result: Optional[Dict[str, Any]] = Field(None, description="Result from Enrichment Agent")
    quality_data: Optional[Dict[str, Any]] = Field(None, description="Result from QA Agent")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe MD",
                "npi": "1234567890",
                "address": "123 Main St, New York, NY",
                "phone": "555-0199",
                "specialty": "Cardiology"
            }
        }

class AgentResponse(BaseModel):
    """
    Standardized response format for all agents.
    """
    status: str = Field("success", description="Status of the operation")
    agent_name: str = Field(..., description="Name of the agent that ran")
    data: Dict[str, Any] = Field(..., description="The actual output from the agent")
    confidence_score: Optional[float] = Field(None, description="Confidence in the result (0-1)")

class AnalyticsResponse(BaseModel):
    """
    Blueprint for Dashboard Analytics data.
    """
    total_providers: int
    validation_accuracy: float
    correction_rate: float
    recent_activity: List[Dict[str, Any]]

class BatchProviderInput(BaseModel):
    """
    Input for batch processing.
    """
    providers: List[ProviderInput]
    batch_id: Optional[str] = None

class BatchAnalysisResponse(BaseModel):
    """
    Response for batch processing.
    """
    total_processed: int
    successful: int
    failed: int
    results: List[Dict[str, Any]]
    risk_summary: Dict[str, int]
    avg_confidence: float
