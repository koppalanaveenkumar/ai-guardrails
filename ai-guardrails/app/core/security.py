from fastapi import Security, HTTPException, status, Depends
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.user import ApiKey
from app.core.logging_config import logger

api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)

def get_api_key(api_key_token: str = Security(api_key_header)):
    """
    Validate API Key against Database.
    Allows 'sk_local_dev_12345' as a fallback master key if configured.
    """
    # 1. Check Database
    db = SessionLocal()
    try:
        key_record = db.query(ApiKey).filter(ApiKey.key == api_key_token, ApiKey.is_active == True).first()
        if key_record:
            return api_key_token
    except Exception as e:
        logger.error(f"⚠️ Key validation error: {e}")
    finally:
        db.close()

    # 3. Fail
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid or missing API Key"
    )
