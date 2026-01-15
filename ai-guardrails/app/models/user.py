from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base, engine

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)

    api_keys = relationship("ApiKey", back_populates="owner")

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    name = Column(String, default="Default Key")
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.now)
    is_active = Column(Boolean, default=True)

    owner = relationship("User", back_populates="api_keys")

# Create tables
Base.metadata.create_all(bind=engine)
