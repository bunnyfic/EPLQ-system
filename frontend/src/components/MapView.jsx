import { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

const userIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#9B7E85;border:2px solid #e8e2dc;box-shadow:0 0 8px #9B7E85;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const resultIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#5C0A0A;border:2px solid #e8e2dc;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

function RecenterOnLocate({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 14);
  }, [position, map]);
  return null;
}

export default function MapView({ results = [], onSelectResult, selected }) {
  const fallbackCenter = [12.9141, 74.8560]; // Mangalore
  const [userPos, setUserPos] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const fogRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => setUserPos(null)
    );
  }, []);

  // Fetch a real road-following route whenever a result is selected
  useEffect(() => {
    if (!userPos || !selected) {
      setRouteCoords(null);
      return;
    }

    const fetchRoute = async () => {
      setRouteLoading(true);
      try {
        const [startLat, startLng] = userPos;
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${selected.longitude},${selected.latitude}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          // OSRM returns [lng, lat] pairs — Leaflet wants [lat, lng]
          const coords = data.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
          setRouteCoords(coords);
        } else {
          // No drivable route found — fall back to a straight line
          setRouteCoords([userPos, [selected.latitude, selected.longitude]]);
        }
      } catch (err) {
        console.error("routing failed, falling back to straight line", err);
        setRouteCoords([userPos, [selected.latitude, selected.longitude]]);
      } finally {
        setRouteLoading(false);
      }
    };

    fetchRoute();
  }, [userPos, selected]);

  const handleMouseMove = (e) => {
    if (!fogRef.current) return;
    const rect = fogRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    fogRef.current.style.setProperty("--mouse-x", `${x}%`);
    fogRef.current.style.setProperty("--mouse-y", `${y}%`);
  };

  const handleMouseLeave = () => {
    if (!fogRef.current) return;
    fogRef.current.style.setProperty("--mouse-x", `-100%`);
    fogRef.current.style.setProperty("--mouse-y", `-100%`);
  };

  return (
    <div
      style={{ position: "relative", height: "100%", width: "100%", overflow: "hidden" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <MapContainer
        center={userPos || fallbackCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        <RecenterOnLocate position={userPos} />

        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>you are here</Popup>
          </Marker>
        )}

        {results.map((r) => (
          <Marker
            key={r.id}
            position={[r.latitude, r.longitude]}
            icon={resultIcon}
            eventHandlers={{ click: () => onSelectResult?.(r) }}
          >
            <Popup>
              <strong>{r.name}</strong>
              <br />
              {r.category} — {r.distance_km} km away
            </Popup>
          </Marker>
        ))}

        {routeCoords && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: "#ffffff", weight: 4, opacity: 0.95 }}
          />
        )}
      </MapContainer>

      {routeLoading && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 500,
            backgroundColor: "rgba(43, 49, 56, 0.9)",
            color: "#9B7E85",
            fontSize: "11px",
            letterSpacing: "1px",
            padding: "6px 14px",
            borderRadius: "6px",
            border: "1px solid #9B7E8550",
          }}
        >
          finding the path...
        </div>
      )}

      <div ref={fogRef} className="fog-container">
        <div className="fog-layer fog-layer-1" />
        <div className="fog-layer fog-layer-2" />
      </div>
    </div>
  );
}