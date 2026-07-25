import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";
import MapView from "../components/MapView";
import SearchBar from "../components/SearchBar";
import MenuSystem from "../components/MenuSystem";
import { searchLocations } from "../services/api";
import { decryptValue } from "../services/crypto";

const API_ORIGIN = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    (async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      }
    })();
  }, [navigate]);
  const handleSearch = async ({ query, category }) => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
     const res = await searchLocations({
  lat: pos.coords.latitude,
  lng: pos.coords.longitude,
  radius_km: 20,
  category,
  q: query,
});

const decrypted = await Promise.all(
  res.data.map(async (r) => ({
    ...r,
    latitude: parseFloat(await decryptValue(r.encrypted_lat)),
    longitude: parseFloat(await decryptValue(r.encrypted_lng)),
  }))
);

setResults(decrypted);
setSelected(null);
    } catch (err) {
      console.error("search failed", err);
    }
  });
};

  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase()
    : "";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1a1519" }}>
      {/* Header ribbon */}
      <header
        style={{
          height: "56px",
          backgroundColor: "#2B3138",
          borderBottom: "1px solid #9B7E8530",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
       {/* Left side — menu + logo */}
<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
  <MenuSystem />
  <span
    style={{
      color: "#9B7E85",
      fontFamily: "serif",
      fontSize: "18px",
      letterSpacing: "2px",
    }}
  >
    EPLQ
  </span>
</div>

        {/* Right side — profile avatar */}
        <button
          onClick={() => navigate("/profile")}
          style={{
            width: "42px",
            height: "42px",
            minWidth: "42px",
            minHeight: "42px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid #8B9A7C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            background: "#1a1519",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {profile?.profile_picture ? (
            <img
              src={`${API_ORIGIN}${profile.profile_picture}`}
              alt="profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <span style={{ fontSize: "11px", color: "#8B9A7C" }}>
              {initials || "?"}
            </span>
          )}
        </button>
      </header>
{/* Map */}
{/* Map */}
{/* Map */}
<div style={{ height: "calc(100vh - 56px)", width: "100%", position: "relative" }}>
  <MapView results={results} onSelectResult={setSelected} selected={selected} />
  <SearchBar onSearch={handleSearch} />
</div>
      
    </div>
  );
}