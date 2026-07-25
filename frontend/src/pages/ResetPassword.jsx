import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/signup-bg.png";
import { resetPassword } from "../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("missing or invalid reset link");
      return;
    }
    if (password.length < 6) {
      setError("password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, new_password: password });
      setSuccess("password updated — you can log in now");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "something went wrong. try again");
    } finally {
      setLoading(false);
    }
  };

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
          Start Over
        </h1>
        <p className="text-center text-sm mb-8 tracking-wide" style={{ color: "#9B7E85" }}>
          choose something new
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs mb-1 tracking-wider" style={{ color: "#8B9A7C" }}>
              NEW PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-black/30 border-b px-2 py-2 text-[#e8e2dc] outline-none focus:border-[#8B9A7C] transition"
              style={{ borderColor: "#5C0A0A" }}
            />
          </div>

          <div>
            <label className="block text-xs mb-1 tracking-wider" style={{ color: "#8B9A7C" }}>
              RE-ENTER PASSWORD
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          {success && (
            <p className="text-xs" style={{ color: "#8B9A7C" }}>
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 tracking-widest text-sm uppercase transition hover:brightness-125 disabled:opacity-50"
            style={{ backgroundColor: "#2B3138", color: "#e8e2dc" }}
          >
            {loading ? "updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: "#9B7E85" }}>
          <Link to="/login" className="underline" style={{ color: "#8B9A7C" }}>
            back to login
          </Link>
        </p>
      </div>
    </div>
  );
}