# 🔐 EPLQ System
### Efficient Privacy-Preserving Location-Based Query System

<p align="center">

![Python](https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
![RSA](https://img.shields.io/badge/RSA-Encryption-red?style=for-the-badge)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap)

</p>

---

## 📖 Overview

EPLQ (Efficient Privacy-Preserving Location-Based Query System) is a secure location-based web application that enables users to search for nearby locations while reducing the exposure of sensitive location information.

Unlike conventional location-based services that require users to continuously share precise location data with cloud servers, EPLQ incorporates modern authentication, encryption, and secure communication mechanisms to better protect user privacy.

The project demonstrates how privacy-preserving techniques can be integrated into real-world location-based applications while maintaining a modern and user-friendly interface.

---

# ✨ Features

### 🔐 Secure Authentication

- User Registration
- Login
- Email Verification
- Forgot Password
- Password Reset
- JWT Authentication

---

### 👤 User Management

- Complete Profile
- Profile Picture Upload
- Profile Editing
- Secure Password Storage

---

### 📍 Location Services

- Search Nearby Hospitals
- Restaurants
- ATMs
- Pharmacies
- Other Points of Interest
- Interactive Map View
- Live User Location

---

### 🔒 Privacy & Security

- RSA Public-Key Cryptography
- Secure Password Hashing
- JWT Authorization
- Encrypted Communication
- Protected User Data

---

# 🏗️ System Architecture

```
              User
                │
                ▼
        React + Vite Frontend
                │
     Secure HTTP Requests (HTTPS)
                │
                ▼
         FastAPI REST Backend
                │
        Authentication & Encryption
                │
                ▼
      PostgreSQL Database (Neon)
```

---

# 🚀 Why EPLQ?

Most location-based applications provide excellent functionality but require users to trust the service provider with sensitive location information.

EPLQ is designed with a stronger emphasis on privacy and security.

## Comparison

| Feature | Traditional Location Services | EPLQ |
|----------|-------------------------------|------|
| User Authentication | ✅ | ✅ |
| Nearby Search | ✅ | ✅ |
| Interactive Maps | ✅ | ✅ |
| Secure Password Recovery | Depends | ✅ |
| JWT Authentication | Optional | ✅ |
| RSA Encryption | ❌ | ✅ |
| Privacy-Focused Design | Limited | ✅ |
| Open Source | Usually No | ✅ |

---

# 💡 Advantages

- 🔐 Better protection of sensitive user information
- 📍 Interactive location-based search
- 🛡️ Modern authentication and authorization
- ☁️ Cloud deployment ready
- 📚 Educational implementation of privacy-preserving location queries
- ⚡ Fast React + FastAPI architecture
- 🌍 Uses modern web technologies

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- JavaScript
- Leaflet
- OpenStreetMap

---

## Backend

- FastAPI
- Python
- SQLAlchemy
- JWT
- Passlib
- RSA Cryptography

---

## Database

- PostgreSQL
- Neon Database

---

## Deployment

- ▲ Vercel
- Render
- Neon PostgreSQL

---

# 📂 Project Structure

```
EPLQ-system/

│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   ├── keys/
│   ├── requirements.txt
│   ├── generate_keys.py
│   └── seed_locations.py
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/bunnyfic/EPLQ-system.git
```

---

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
DATABASE_URL=

SECRET_KEY=

JWT_SECRET=

MAIL_USERNAME=

MAIL_PASSWORD=
```

---

# 📸 Screenshots

| Login | Dashboard |
|--------|-----------|
|<img width="1364" height="605" alt="image" src="https://github.com/user-attachments/assets/2198e706-05b3-48cc-b81a-63b70b8ef93e" />
 |<img width="1366" height="599" alt="image" src="https://github.com/user-attachments/assets/804aee0d-b613-4c4d-9f82-1229a6b7e863" />
|

| Map | Profile |
|-----|----------|
|<img width="720" height="493" alt="image" src="https://github.com/user-attachments/assets/ead298e8-31b0-4454-978a-a3d257e3a5cc" />
 |<img width="1359" height="609" alt="image" src="https://github.com/user-attachments/assets/53a8cbae-3164-450a-aa33-905bfb043fdd" />
 |

---

# 🔮 Future Improvements

- Homomorphic Encryption
- Searchable Encryption
- PostGIS Spatial Queries
- Encrypted Query Processing
- Mobile Application
- AI-powered Route Recommendation
- Performance Benchmarking

---

# 👩‍💻 Author

**Maya**

MSc Data Science

---

⭐ If you found this project useful, consider giving it a **Star** on GitHub.
