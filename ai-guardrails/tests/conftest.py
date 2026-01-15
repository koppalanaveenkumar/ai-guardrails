import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app as fastapi_app
from app.core.database import Base, get_db
from app.models.user import User, ApiKey
from app.models.audit_log import AuditLog
from app.core.limiter import limiter

# Disable rate limiting for tests
limiter.enabled = False

# 1. Use In-Memory SQLite for Tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 2. Setup/Teardown DB
@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()

# 3. Override dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

fastapi_app.dependency_overrides[get_db] = override_get_db

# 4. Patch SessionLocal for direct usages (security.py, audit_service.py)
from unittest.mock import MagicMock
import app.core.database
import app.core.security
import app.services.audit_service

# We need to patch SessionLocal in the places where it is imported/used
app.core.database.SessionLocal = TestingSessionLocal
app.core.security.SessionLocal = TestingSessionLocal
app.services.audit_service.SessionLocal = TestingSessionLocal

@pytest.fixture(scope="module")
def client():
    with TestClient(fastapi_app) as c:
        yield c
