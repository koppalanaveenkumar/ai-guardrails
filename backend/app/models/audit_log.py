from sqlalchemy import Column, Integer, String, Boolean, Float, Text
from app.core.database import Base, engine

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String)  # ISO format
    model = Column(String)
    is_safe = Column(Boolean)
    reason = Column(String, nullable=True)
    latency_ms = Column(Float)
    pii_detected = Column(Text, nullable=True)  # Stored as comma-separated string
    api_key_id = Column(Integer, index=True, nullable=True)  # Link to the user who made the request

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)
