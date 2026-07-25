import { useState } from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/login-bg.jpg";
import { forgotPassword } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message);
    } catch {
      setMessage("something went wrong. try again");
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
          Lost Something?
        </h1>
        <p className="text-center text-sm mb-8 tracking-wide" style={{ color: "#8B9A7C" }}>
          we'll guide you back through the fog
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

          {message && (
            <p className="text-xs" style={{ color: "#8B9A7C" }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 tracking-widest text-sm uppercase transition hover:brightness-125 disabled:opacity-50"
            style={{ backgroundColor: "#5C0A0A", color: "#e8e2dc" }}
          >
            {loading ? "sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: "#8B9A7C" }}>
          <Link to="/login" className="underline" style={{ color: "#9B7E85" }}>
            back to login
          </Link>
        </p>
      </div>
    </div>
  );
}