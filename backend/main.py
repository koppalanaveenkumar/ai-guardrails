import logging
import sentry_sdk
from sentry_sdk.integrations.logging import LoggingIntegration
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.limiter import limiter

# Initialize database tables
from app.core.database import engine, Base
from app.models.user import User, ApiKey
from app.models.audit_log import AuditLog

# Initialize Sentry if DSN is set
if settings.SENTRY_DSN:
    # Configure logging integration
    sentry_logging = LoggingIntegration(
        level=logging.INFO,        # Capture INFO and above as breadcrumbs
        event_level=logging.ERROR  # Send ERROR and above as events
    )
    
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        integrations=[sentry_logging],
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

# Create tables if they don't exist (safe for production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "AI Guardrails API is running", "version": "0.1.0"}

@app.get("/health")
def health_check():
    """
    Health check endpoint for UptimeRobot or Load Balancers.
    """
    return {"status": "ok", "environment": "production" if settings.SENTRY_DSN else "development"}
