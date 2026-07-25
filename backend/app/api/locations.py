import os
import httpx
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, List
from math import radians, cos, sin, asin, sqrt
from dotenv import load_dotenv
from app.core.rsa_crypto import encrypt_value

load_dotenv()
GEOAPIFY_API_KEY = os.getenv("GEOAPIFY_API_KEY")

router = APIRouter(prefix="/locations", tags=["locations"])

# Geoapify "categories" reference: https://apidocs.geoapify.com/docs/places/#categories
CATEGORY_MAP = {
    # Food & drink
    "restaurant": "catering.restaurant",
    "cafe": "catering.cafe",
    "bar": "catering.bar,catering.pub",
    "fast_food": "catering.fast_food",
    "bakery": "commercial.food_and_drink.bakery",

    # Health
    "hospital": "healthcare.hospital",
    "pharmacy": "healthcare.pharmacy",
    "clinic": "healthcare.clinic_or_praxis",
    "dentist": "healthcare.dentist",

    # Money & essentials
    "atm": "service.financial.atm",
    "bank": "service.financial.bank",

    # Education
    "school": "education.school",
    "college": "education.university,education.college",
    "library": "education.library",

    # Shopping
    "supermarket": "commercial.supermarket",
    "mall": "commercial.shopping_mall",
    "market": "commercial.marketplace",
    "clothing_store": "commercial.clothing",

    # Travel & transport
    "hotel": "accommodation.hotel",
    "gas_station": "service.vehicle.fuel",
    "parking": "parking",
    "bus_station": "public_transport.bus",
    "train_station": "public_transport.train",
    "airport": "airport",

    # Leisure & outdoors
    "park": "leisure.park",
    "beach": "natural.beach",
    "gym": "sport.fitness",
    "cinema": "entertainment.cinema",
    "museum": "entertainment.museum",
    "zoo": "entertainment.zoo",
    "tourist_attraction": "tourism.attraction",

    # Worship
    "temple": "religion.place_of_worship.hinduism",
    "church": "religion.place_of_worship.christianity",
    "mosque": "religion.place_of_worship.islam",

    # Services
    "post_office": "service.post",
    "police": "service.police",
    "veterinary": "service.animal_shelter,healthcare.veterinary",
}


class LocationResponse(BaseModel):
    id: str
    name: str
    category: str
    encrypted_lat: str
    encrypted_lng: str
    distance_km: Optional[float] = None


def haversine_km(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return 6371 * 2 * asin(sqrt(a))


def detect_category(text: str) -> Optional[str]:
    text_lower = text.strip().lower()
    words = text_lower.split()

    # Only treat it as a category browse if the ENTIRE input is just
    # the category word (optionally plural), not a longer specific query.
    for key in CATEGORY_MAP:
        if text_lower == key or text_lower == f"{key}s":
            return key
        if text_lower in (f"{key} near me", f"{key}s near me"):
            return key

    return None


async def search_by_category(lat: float, lng: float, radius_km: float, category: str):
    geoapify_category = CATEGORY_MAP.get(category)
    if not geoapify_category:
        return []

    radius_m = int(radius_km * 1000)
    url = "https://api.geoapify.com/v2/places"
    params = {
        "categories": geoapify_category,
        "filter": f"circle:{lng},{lat},{radius_m}",
        "bias": f"proximity:{lng},{lat}",
        "limit": 20,
        "apiKey": GEOAPIFY_API_KEY,
    }

    print(f"[Geoapify categories] category={category} -> {geoapify_category}")
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url, params=params)
        print(f"[Geoapify categories] status={resp.status_code}")
        if resp.status_code != 200:
            print(f"[Geoapify categories] error body: {resp.text[:300]}")
            return []
        data = resp.json()

    return _parse_geoapify_features(data, lat, lng, category)


async def search_by_text(lat: float, lng: float, radius_km: float, q: str):
    url = "https://api.geoapify.com/v1/geocode/autocomplete"
    params = {
        "text": q,
        "bias": f"proximity:{lng},{lat}",  # nudges results toward you, but doesn't exclude far ones
        "limit": 10,
        "apiKey": GEOAPIFY_API_KEY,
    }

    print(f"[Geoapify autocomplete] q='{q}'")
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url, params=params)
        print(f"[Geoapify autocomplete] status={resp.status_code}")
        if resp.status_code != 200:
            print(f"[Geoapify autocomplete] error body: {resp.text[:300]}")
            return []
        data = resp.json()

    return _parse_geoapify_features(data, lat, lng, "place")


def _parse_geoapify_features(data: dict, lat: float, lng: float, fallback_category: str):
    results = []
    seen_coords = set()

    for feature in data.get("features", []):
        props = feature.get("properties", {})
        name = (props.get("name") or props.get("address_line1") or "").strip()

        if not name:
            continue  # skip anything with no usable name at all

        item_lat = props.get("lat")
        item_lon = props.get("lon")
        if item_lat is None or item_lon is None:
            continue

        # Round coordinates to ~11m precision to detect near-duplicate stacked points
        coord_key = (round(item_lat, 4), round(item_lon, 4))
        if coord_key in seen_coords:
            continue
        seen_coords.add(coord_key)

        dist = haversine_km(lat, lng, item_lat, item_lon)

        results.append(
                LocationResponse(
                    id=str(props.get("place_id", f"{item_lat}-{item_lon}")),
                    name=name,
                    category=fallback_category,
                    encrypted_lat=encrypt_value(str(item_lat)),
                    encrypted_lng=encrypt_value(str(item_lon)),
                    distance_km=round(dist, 2),
                )
            )

    results.sort(key=lambda r: r.distance_km)
    print(f"[Geoapify] parsed {len(results)} named, de-duplicated results")
    return results


@router.get("/search", response_model=List[LocationResponse])
async def search_locations(
    lat: float = Query(...),
    lng: float = Query(...),
    radius_km: float = Query(15.0),
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
):
    print(f"\n--- SEARCH: lat={lat} lng={lng} radius={radius_km} category={category} q={q!r} ---")

    if not GEOAPIFY_API_KEY:
        print("!!! GEOAPIFY_API_KEY is missing from .env !!!")
        return []

    has_specific_category = category and category in CATEGORY_MAP
    has_text = q and q.strip()

    try:
        if has_specific_category:
            results = await search_by_category(lat, lng, radius_km, category)
            print(f"--- RETURNING {len(results)} category results ---\n")
            return results

        if has_text:
            detected = detect_category(q.strip())
            if detected:
                print(f"[Detected category keyword '{detected}' in text]")
                results = await search_by_category(lat, lng, radius_km, detected)
                if results:
                    print(f"--- RETURNING {len(results)} keyword-detected category results ---\n")
                    return results

            results = await search_by_text(lat, lng, radius_km, q.strip())
            print(f"--- RETURNING {len(results)} text search results ---\n")
            return results

        # "All", no text — just grab a broad mix nearby
        results = await search_by_category(lat, lng, radius_km, "restaurant")
        print(f"--- RETURNING {len(results)} default results ---\n")
        return results

    except Exception as e:
        print(f"!!! SEARCH FAILED: {type(e).__name__}: {e}\n")
        return []