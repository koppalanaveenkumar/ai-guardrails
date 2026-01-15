import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.audit_log import AuditLog
from app.core.logging_config import logger

def log_request(model_name: str, is_safe: bool, reason: str = None, latency_ms: float = 0, pii_detected: list = None):
    """
    Log request details to PostgreSQL (Neon DB).
    """
    db: Session = SessionLocal()
    try:
        # Convert PII list to string for storage
        pii_str = ",".join(pii_detected) if pii_detected else ""
        
        log_entry = AuditLog(
            timestamp=datetime.datetime.now().isoformat(),
            model=model_name,
            is_safe=is_safe,
            reason=reason,
            latency_ms=latency_ms,
            pii_detected=pii_str
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        logger.error(f"⚠️ Failed to write audit log: {e}")
        db.rollback()
    finally:
        db.close()

from sqlalchemy import func

def get_recent_logs(db: Session, limit: int = 50):
    """Fetch recent audit logs from PostgreSQL."""
    try:
        logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(limit).all()
        # Convert to dictionary format for API
        return [
            {
                "id": log.id,
                "timestamp": log.timestamp,
                "model": log.model,
                "is_safe": log.is_safe,
                "reason": log.reason,
                "latency_ms": log.latency_ms,
                "pii_detected": log.pii_detected.split(",") if log.pii_detected else []
            }
            for log in logs
        ]
    except Exception as e:
        logger.error(f"⚠️ Failed to read logs: {e}")
        return []

def get_audit_stats(db: Session = None):
    """
    Calculate usage statistics:
    - Total Requests
    - Blocked Requests
    - Average Latency
    
    Accepts db argument for injection, falls back to SessionLocal if None (for robustness).
    """
    if db is None:
        db = SessionLocal()
        should_close = True
    else:
        should_close = False
        
    try:
        total_requests = db.query(func.count(AuditLog.id)).scalar()
        blocked_requests = db.query(func.count(AuditLog.id)).filter(AuditLog.is_safe == False).scalar()
        avg_latency = db.query(func.avg(AuditLog.latency_ms)).scalar() or 0.0

        return {
            "total_requests": total_requests,
            "blocked_requests": blocked_requests,
            "block_rate": (blocked_requests / total_requests * 100) if total_requests > 0 else 0,
            "avg_latency": round(avg_latency, 2)
        }
    except Exception as e:
        logger.error(f"⚠️ Failed to calculate stats: {e}")
        return {
            "total_requests": 0,
            "blocked_requests": 0,
            "block_rate": 0,
            "avg_latency": 0
        }
    finally:
        if should_close:
            db.close()
