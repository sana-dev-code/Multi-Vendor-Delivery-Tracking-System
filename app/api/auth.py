from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import uuid4
from app.db.database import get_db
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.services.auth_service import register_user, login_user, validate_strong_password
from app.models.user import User
from app.core.dependencies import get_current_user
from app.core.security import verify_password, hash_password
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

password_reset_tokens = {}
@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reset_token = uuid4().hex

    password_reset_tokens[request.email] = reset_token

    return {
        "message": "Reset token generated successfully",
        "reset_token": reset_token
    }


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    saved_token = password_reset_tokens.get(request.email)

    if not saved_token or saved_token != request.reset_token:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    validate_strong_password(request.new_password)

    new_hashed_password = hash_password(request.new_password)

    if hasattr(user, "password"):
        user.password = new_hashed_password
    elif hasattr(user, "hashed_password"):
        user.hashed_password = new_hashed_password
    elif hasattr(user, "password_hash"):
        user.password_hash = new_hashed_password
    else:
        raise HTTPException(status_code=500, detail="Password field not found")

    db.commit()

    del password_reset_tokens[request.email]

    return {
        "message": "Password reset successfully"
    }
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
    # Public signup should only create customer accounts.
    # Admin/vendor/driver accounts must be created from protected /admin APIs.
    requested_role = getattr(request, "role", "CUSTOMER")

    if requested_role != "CUSTOMER":
        raise HTTPException(
            status_code=403,
            detail="Only customer self-registration is allowed. Vendor and driver accounts must be created by admin."
        )

    request.role = "CUSTOMER"
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

    validate_strong_password(request.new_password)

    new_hashed_password = hash_password(request.new_password)

    if hasattr(current_user, "password"):
        current_user.password = new_hashed_password
    elif hasattr(current_user, "hashed_password"):
        current_user.hashed_password = new_hashed_password
    elif hasattr(current_user, "password_hash"):
        current_user.password_hash = new_hashed_password

    db.commit()

    return {"message": "Password changed successfully"}
@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == request.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "Email verified"
    }
@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == request.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    validate_strong_password(
        request.new_password
    )

    user.hashed_password = hash_password(
        request.new_password
    )

    db.commit()

    return {
        "message": "Password updated successfully"
    }