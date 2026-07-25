import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/signup-bg.png";
import { getProfile, saveProfile } from "../services/api";

const API_ORIGIN = "http://127.0.0.1:8000";

export default function CompleteProfile() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  // Load whatever profile data already exists (so re-visiting this page doesn't wipe it)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await getProfile();
        setEmail(res.data.email);
        setFirstName(res.data.first_name || "");
        setLastName(res.data.last_name || "");
        if (res.data.profile_picture) {
          setPreviewUrl(`${API_ORIGIN}${res.data.profile_picture}`);
        }
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("first and last name are required");
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName.trim());
    formData.append("last_name", lastName.trim());
    if (imageFile) {
      formData.append("profile_picture", imageFile);
    }

    setLoading(true);
    try {
      await saveProfile(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "something went wrong. try again");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1a1519" }}>
        <p style={{ color: "#8B9A7C" }}>loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <div
        className="relative z-10 w-full max-w-sm mx-4 p-8 rounded-lg backdrop-blur-sm border border-[#9B7E85]/30"
        style={{ backgroundColor: "rgba(43, 49, 56, 0.75)" }}
      >
        <h1
          className="text-3xl mb-1 text-center tracking-widest"
          style={{ color: "#8B9A7C", fontFamily: "serif" }}
        >
          Who Are You?
        </h1>
        <p className="text-center text-sm mb-8 tracking-wide" style={{ color: "#9B7E85" }}>
          tell us before you go further
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-24 h-24 rounded-full overflow-hidden border flex items-center justify-center"
              style={{ borderColor: "#8B9A7C" }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="profile preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-center px-2" style={{ color: "#8B9A7C" }}>
                  no photo
                </span>
              )}
            </div>
            <label className="text-xs tracking-wider underline cursor-pointer" style={{ color: "#9B7E85" }}>
              choose photo
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-xs mb-1 tracking-wider" style={{ color: "#8B9A7C" }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-black/20 border-b px-2 py-2 cursor-not-allowed"
              style={{ borderColor: "#5C0A0A", color: "#8B9A7C" }}
            />
          </div>

          <div>
            <label className="block text-xs mb-1 tracking-wider" style={{ color: "#8B9A7C" }}>
              FIRST NAME
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full bg-black/30 border-b px-2 py-2 text-[#e8e2dc] outline-none focus:border-[#8B9A7C] transition"
              style={{ borderColor: "#5C0A0A" }}
            />
          </div>

          <div>
            <label className="block text-xs mb-1 tracking-wider" style={{ color: "#8B9A7C" }}>
              LAST NAME
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full bg-black/30 border-b px-2 py-2 text-[#e8e2dc] outline-none focus:border-[#8B9A7C] transition"
              style={{ borderColor: "#5C0A0A" }}
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: "#c73e3e" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 tracking-widest text-sm uppercase transition hover:brightness-125 disabled:opacity-50"
            style={{ backgroundColor: "#2B3138", color: "#e8e2dc" }}
          >
            {loading ? "saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}