from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Guardrails API"
    API_V1_STR: str = "/api/v1"
    REDIS_URL: str = "redis://localhost:6379/0"
    DATABASE_URL: str
    API_KEY: str = "sk_local_dev_12345"  # Default for local dev
    
    # Monitoring
    SENTRY_DSN: str | None = None
    
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000"]'
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:8000", "https://aiguardrails.vercel.app"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
