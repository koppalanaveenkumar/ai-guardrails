from fastapi import APIRouter, Depends, HTTPException, Security
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
import app.services.audit_service as audit_service
from app.core.security import get_api_key

router = APIRouter()

@router.get("/logs")
def get_logs(
    limit: int = 50,
    db: Session = Depends(get_db),
    api_key: str = Security(get_api_key)
):
    """
    Get recent audit logs.
    """
    return audit_service.get_recent_logs(db, limit)

@router.delete("/prune")
def prune_old_logs(
    days: int = 30,
    db: Session = Depends(get_db),
    api_key: str = Security(get_api_key)
):
    """Delete logs older than 'days' (default 30) to free up space."""
    count = audit_service.prune_logs(db, days)
    return {"message": f"Deleted {count} logs older than {days} days."}

@router.get("/stats")
def read_audit_stats(
    db: Session = Depends(get_db),
    api_key: str = Depends(get_api_key)
):
    """
    Get aggregated usage statistics.
    """
    return audit_service.get_audit_stats(db)
