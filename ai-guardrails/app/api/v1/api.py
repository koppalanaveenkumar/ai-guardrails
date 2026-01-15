from fastapi import APIRouter
from app.api.v1.endpoints import guard

api_router = APIRouter()
api_router.include_router(guard.router, prefix="/guard", tags=["guard"])
