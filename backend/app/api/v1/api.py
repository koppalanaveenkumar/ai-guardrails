from fastapi import APIRouter
from app.api.v1.endpoints import guard, audit, auth

api_router = APIRouter()

api_router.include_router(guard.router, prefix="/guard", tags=["Guard"])
api_router.include_router(audit.router, prefix="/audit", tags=["Audit"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
