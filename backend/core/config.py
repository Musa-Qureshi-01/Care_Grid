"""
File: backend/core/config.py
Purpose:
Centrally manage environment variables and application configuration.
This ensures that sensitive keys (Google, NPI) are loaded securely 
and not scattered throughout the codebase.

Security Note:
Values are read from .env file. This file should be in .gitignore.
"""

import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """
    App Configuration
    """
    PROJECT_NAME: str = "CareGrid Provider Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security: API Keys
    # These will be loaded from .env automatically
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    NPI_REGISTRY_API_KEY: str = os.getenv("NPI_REGISTRY_API_KEY", "")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    
    # Server Config
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", 8000))
    ENV: str = os.getenv("ENV", "dev")

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    """
    Returns cached settings instance.
    """
    return Settings()
