import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProfile } from "../services/api";

const API_ORIGIN = "http://127.0.0.1:8000";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1a1519" }}>
        <p style={{ color: "#8B9A7C" }}>loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1a1519" }}>
      <div
        className="w-full max-w-sm mx-4 p-8 rounded-lg border"
        style={{ backgroundColor: "#2B3138", borderColor: "#9B7E8530" }}
      >
        <h1
          className="text-3xl mb-1 text-center tracking-widest"
          style={{ color: "#8B9A7C", fontFamily: "serif" }}
        >
          Your Reflection
        </h1>
        <p className="text-center text-sm mb-8 tracking-wide" style={{ color: "#9B7E85" }}>
          this is who the fog knows
        </p>

        <div className="flex flex-col items-center gap-3 mb-6">
          <div
            className="w-24 h-24 rounded-full overflow-hidden border flex items-center justify-center"
            style={{ borderColor: "#8B9A7C" }}
          >
            {profile?.profile_picture ? (
              <img
                src={`${API_ORIGIN}${profile.profile_picture}`}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-center px-2" style={{ color: "#8B9A7C" }}>
                no photo
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-xs mb-1 tracking-wider" style={{ color: "#8B9A7C" }}>
              NAME
            </p>
            <p className="text-sm" style={{ color: "#e8e2dc" }}>
              {profile?.first_name} {profile?.last_name}
            </p>
          </div>

          <div>
            <p className="text-xs mb-1 tracking-wider" style={{ color: "#8B9A7C" }}>
              EMAIL
            </p>
            <p className="text-sm" style={{ color: "#e8e2dc" }}>
              {profile?.email}
            </p>
          </div>
        </div>

        <Link
          to="/complete-profile"
          className="block w-full text-center py-2 mb-3 tracking-widest text-sm uppercase transition hover:brightness-125"
          style={{ backgroundColor: "#5C0A0A", color: "#e8e2dc" }}
        >
          Edit Profile
        </Link>

        <button
          onClick={handleLogout}
          className="w-full py-2 mb-4 tracking-widest text-sm uppercase transition hover:brightness-125"
          style={{ backgroundColor: "#1a1519", color: "#9B7E85", border: "1px solid #9B7E8550" }}
        >
          Log Out
        </button>

        <p className="text-center text-xs" style={{ color: "#9B7E85" }}>
          <Link to="/dashboard" className="underline" style={{ color: "#8B9A7C" }}>
            back to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}