from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database.db import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Account is inactive until the user clicks the activation link we email them
    is_active = Column(Boolean, default=False, nullable=False)
    activation_token = Column(String, nullable=True)
    activation_token_expiry = Column(DateTime, nullable=True)

    reset_token = Column(String, nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)

    # Profile — filled in after activation, on first login
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)  # stored filename, served from /uploads/profile_pictures/


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)  # restaurant, hospital, atm
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)