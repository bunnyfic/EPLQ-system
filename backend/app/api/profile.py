import os
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.db import get_db
from app.database.models import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/profile", tags=["profile"])

UPLOAD_DIR = "uploads/profile_pictures"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


class ProfileResponse(BaseModel):
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture: Optional[str] = None  # public URL path, e.g. /uploads/profile_pictures/xyz.png
    profile_complete: bool


def _to_response(user: User) -> ProfileResponse:
    return ProfileResponse(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        profile_picture=f"/uploads/profile_pictures/{user.profile_picture}" if user.profile_picture else None,
        profile_complete=bool(user.first_name and user.last_name and user.profile_picture),
    )


# --- Get current user's profile ---
@router.get("", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return _to_response(current_user)


# --- Create / update profile (name + picture). Email is never accepted here. ---
@router.post("", response_model=ProfileResponse)
def save_profile(
    first_name: str = Form(...),
    last_name: str = Form(...),
    profile_picture: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    first_name = first_name.strip()
    last_name = last_name.strip()

    if not first_name or not last_name:
        raise HTTPException(status_code=400, detail="First and last name are required.")

    current_user.first_name = first_name
    current_user.last_name = last_name

    if profile_picture is not None:
        ext = os.path.splitext(profile_picture.filename or "")[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Unsupported image type. Use jpg, jpeg, png, gif, or webp.",
            )

        contents = profile_picture.file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="Image must be under 5MB.")

        # Remove any previous picture for this user before saving the new one
        if current_user.profile_picture:
            old_path = os.path.join(UPLOAD_DIR, current_user.profile_picture)
            if os.path.exists(old_path):
                os.remove(old_path)

        filename = f"{current_user.id}_{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(contents)

        current_user.profile_picture = filename

    db.commit()
    db.refresh(current_user)

    return _to_response(current_user)