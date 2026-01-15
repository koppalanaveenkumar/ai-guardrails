from sqlalchemy.orm import Session
from app.models.user import User, ApiKey
from passlib.context import CryptContext
import secrets

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def create_user(db: Session, email: str, password: str):
    # 1. Create User
    hashed_password = get_password_hash(password)
    db_user = User(email=email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # 2. Auto-generate API Key
    # Format: sk_live_<32_random_chars>
    raw_key = f"ag_live_{secrets.token_urlsafe(24)}"
    
    db_key = ApiKey(key=raw_key, user_id=db_user.id)
    db.add(db_key)
    db.commit()
    db.refresh(db_key)

    return db_user, raw_key

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not pwd_context.verify(password, user.hashed_password):
        return None
    
    # Get the user's active key (assuming 1 key per user for MVP)
    api_key = db.query(ApiKey).filter(ApiKey.user_id == user.id, ApiKey.is_active == True).first()
    return api_key.key if api_key else None
