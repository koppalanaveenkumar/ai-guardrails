from slowapi import Limiter
from slowapi.util import get_remote_address
import redis
from app.core.config import settings

def get_limiter():
    try:
        # Check if Redis is accessible
        r = redis.from_url(settings.REDIS_URL, socket_connect_timeout=1)
        r.ping()
        return Limiter(key_func=get_remote_address, storage_uri=settings.REDIS_URL)
    except Exception:
        print("⚠️ WARNING: Redis not found. Falling back to Memory Storage for Rate Limiting.")
        return Limiter(key_func=get_remote_address)

limiter = get_limiter()
