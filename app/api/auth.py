from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.services.auth_service import register_user, login_user
from app.models.user import User
from app.core.dependencies import get_current_user
from app.core.security import verify_password, hash_password

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import verify_password, hash_password
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.post("/register", response_model=UserResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(db, request)


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, request)

@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    stored_password = getattr(current_user, "password", None)

    if not stored_password:
        stored_password = getattr(current_user, "hashed_password", None)

    if not stored_password:
        stored_password = getattr(current_user, "password_hash", None)

    if not stored_password:
        raise HTTPException(status_code=500, detail="Password field not found in User model")

    if not verify_password(request.current_password, stored_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    new_hashed_password = hash_password(request.new_password)

    if hasattr(current_user, "password"):
        current_user.password = new_hashed_password
    elif hasattr(current_user, "hashed_password"):
        current_user.hashed_password = new_hashed_password
    elif hasattr(current_user, "password_hash"):
        current_user.password_hash = new_hashed_password

    db.commit()

    return {"message": "Password changed successfully"}