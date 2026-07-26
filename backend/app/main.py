import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import PlainTextResponse

from app.database.db import Base, engine
from app.api import auth, profile, locations

# Creates all tables (like "users") if they don't already exist
Base.metadata.create_all(bind=engine)

# Make sure the upload folder exists before mounting it
os.makedirs("uploads/profile_pictures", exist_ok=True)

app = FastAPI(title="EPLQ API")

# Allow the React frontend (running on a different port) to call this API
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded profile pictures at http://127.0.0.1:8000/uploads/profile_pictures/<filename>
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(locations.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "EPLQ API is running"}


@app.get("/api/keys/private-demo", response_class=PlainTextResponse)
def get_demo_private_key() -> str:
    path = "private.pem" if os.path.exists("private.pem") else "keys/private.pem"
    with open(path) as f:
        return f.read()
