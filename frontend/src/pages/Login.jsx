import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/login-bg.jpg";
import { loginUser } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.access_token);
      navigate(res.data.profile_complete ? "/dashboard" : "/complete-profile");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("incorrect email or password");
      } else if (err.response?.status === 403) {
        setError(err.response?.data?.detail || "please activate your account via the link we emailed you");
      } else {
        setError("something went wrong. try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div
        className="relative z-10 w-full max-w-sm mx-4 p-8 rounded-lg backdrop-blur-sm border border-[#8B9A7C]/30"
        style={{ backgroundColor: "rgba(43, 49, 56, 0.75)" }}
      >
        <h1
          className="text-3xl mb-1 text-center tracking-widest"
          style={{ color: "#9B7E85", fontFamily: "serif" }}
        >
          Welcome Back
        </h1>
        <p className="text-center text-sm mb-8 tracking-wide" style={{ color: "#8B9A7C" }}>
          the fog remembers you
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs mb-1 tracking-wider" style={{ color: "#9B7E85" }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/30 border-b px-2 py-2 text-[#e8e2dc] outline-none focus:border-[#9B7E85] transition"
              style={{ borderColor: "#5C0A0A" }}
            />
          </div>

          <div>
            <label className="block text-xs mb-1 tracking-wider" style={{ color: "#9B7E85" }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/30 border-b px-2 py-2 text-[#e8e2dc] outline-none focus:border-[#9B7E85] transition"
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
            style={{ backgroundColor: "#5C0A0A", color: "#e8e2dc" }}
          >
            {loading ? "entering..." : "Enter"}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: "#8B9A7C" }}>
  <Link to="/forgot-password" className="underline" style={{ color: "#9B7E85" }}>
    forgot password?
  </Link>
</p>

<p className="text-center text-xs mt-4" style={{ color: "#8B9A7C" }}>
  No account?{" "}
  <Link to="/signup" className="underline" style={{ color: "#9B7E85" }}>
    step through
  </Link>
</p>
      </div>
    </div>
  );
}