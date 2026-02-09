"""
File: backend/main.py
Purpose:
This is the Entry Point of our Backend Application.

It performs 3 main jobs:
1. Initializes the FastAPI app
2. Configures CORS (so our React frontend can talk to it)
3. Registers our routers (API endpoints)

How to Run:
uvicorn backend.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Use relative imports if running from backend dir, or absolute if running as module
# We will use absolute imports and run with python -m backend.main or uvicorn backend.main:app
from backend.routers import agents_router, reports, jobs, research_router

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Debug: verify loading (Masked)
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    masked_key = f"{api_key[:4]}...{api_key[-4:]}"
    print(f"✅ GOOGLE_API_KEY loaded: {masked_key}")
else:
    print("❌ GOOGLE_API_KEY NOT FOUND in environment")

# 1. Initialize App
app = FastAPI(
    title="CareGrid AI Engine",
    description="Backend API for CareGrid Provider Intelligence Platform",
    version="2.0.0"
)

# 2. Configure CORS (Cross-Origin Resource Sharing)
# This allows requests from our React Frontend (localhost:5173)
origins = [
    "http://localhost:5173",  # Vite Dev Server
    "http://localhost:3000",  # Common React Port
    "*"  # Allow all origins for deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# 3. Register Routers
app.include_router(agents_router.router)
app.include_router(reports.router)
app.include_router(jobs.router)
app.include_router(research_router.router)

@app.get("/")
async def root():
    """
    Simple Health Check Endpoint.
    """
    return {"message": "CareGrid AI Engine is Running", "status": "online"}


if __name__ == "__main__":
    import uvicorn
    # Run the server on port 8000
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
