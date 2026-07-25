from app.database.db import SessionLocal, Base, engine
from app.database.models import Location

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Clear existing test data first so we don't end up with duplicates
db.query(Location).delete()
db.commit()

sample_locations = [
    {"name": "Father Muller Medical College Hospital", "category": "hospital", "latitude": 12.8721, "longitude": 74.8449},
    {"name": "KMC Hospital Mangalore", "category": "hospital", "latitude": 12.9089, "longitude": 74.8560},
    {"name": "Yenepoya Medical College Hospital", "category": "hospital", "latitude": 12.8801, "longitude": 74.8896},
    {"name": "Ideal Ice Cream", "category": "restaurant", "latitude": 12.8698, "longitude": 74.8422},
    {"name": "Machali Restaurant", "category": "restaurant", "latitude": 12.8698, "longitude": 74.8430},
    {"name": "Ganesh Prasad", "category": "restaurant", "latitude": 12.8735, "longitude": 74.8420},
    {"name": "SBI ATM Balmatta", "category": "atm", "latitude": 12.8735, "longitude": 74.8425},
    {"name": "HDFC Bank ATM Kadri", "category": "atm", "latitude": 12.8870, "longitude": 74.8480},
    {"name": "Axis Bank ATM Hampankatta", "category": "atm", "latitude": 12.8660, "longitude": 74.8420},
]

for loc in sample_locations:
    db.add(Location(**loc))

db.commit()
db.close()
print(f"Seeded {len(sample_locations)} locations.")