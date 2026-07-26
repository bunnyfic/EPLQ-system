from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import os
from app.services.email_service import send_reset_email, send_activation_email
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks

from app.database.db import get_db
from app.database.models import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    generate_reset_token,
    generate_activation_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])

ACTIVATION_TOKEN_EXPIRE_HOURS = 24


# --- Schemas ---
class SignupRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    profile_complete: bool


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ActivateAccountRequest(BaseModel):
    token: str


class MessageResponse(BaseModel):
    message: str


# --- Signup ---
# Account is created inactive. An activation link is emailed, and the
# account only becomes usable once that link is clicked (see /activate).
@router.post("/signup", response_model=MessageResponse)
def signup(payload: SignupRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    token = generate_activation_token()

    new_user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        is_active=False,
        activation_token=token,
        activation_token_expiry=datetime.utcnow() + timedelta(hours=ACTIVATION_TOKEN_EXPIRE_HOURS),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    activation_link = f"{os.getenv('FRONTEND_URL')}/activate?token={token}"
    background_tasks.add_task(send_activation_email, new_user.email, activation_link)

    return MessageResponse(
        message="Account created. Check your email to activate your account before logging in."
    )

# --- Activate Account ---
@router.post("/activate", response_model=MessageResponse)
def activate_account(payload: ActivateAccountRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.activation_token == payload.token).first()

    if not user or not user.activation_token_expiry or user.activation_token_expiry < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This activation link is invalid or has expired.",
        )

    user.is_active = True
    user.activation_token = None
    user.activation_token_expiry = None
    db.commit()

    return MessageResponse(message="Account activated successfully. You can now log in.")


# --- Login ---
@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please activate your account via the link we emailed you before logging in.",
        )

    token = create_access_token(data={"sub": user.email})
    profile_complete = bool(user.first_name and user.last_name and user.profile_picture)
    return TokenResponse(access_token=token, profile_complete=profile_complete)


# --- Forgot Password ---
@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    generic_message = "If an account with that email exists, a reset link has been sent."

    if not user:
        return MessageResponse(message=generic_message)

    token = generate_reset_token()
    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=30)
    db.commit()

    reset_link = f"{os.getenv('FRONTEND_URL')}/reset-password?token={token}"
    background_tasks.add_task(send_reset_email, user.email, reset_link)

    return MessageResponse(message=generic_message)


# --- Reset Password ---
@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == payload.token).first()

    if not user or not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This reset link is invalid or has expired.",
        )

    user.hashed_password = hash_password(payload.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()

    return MessageResponse(message="Password updated successfully.")
