from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.database import get_db
from app.services.auth_service import create_user
from app.models.user import User

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    email: str
    api_key: str

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create user and key
    db_user, api_key = create_user(db, user.email, user.password)
    
    return {
        "email": db_user.email,
        "api_key": api_key
    }

@router.post("/login", response_model=UserResponse)
def login(user: UserCreate, db: Session = Depends(get_db)):
    from app.services.auth_service import authenticate_user
    
    api_key = authenticate_user(db, user.email, user.password)
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "email": user.email,
        "api_key": api_key
    }
