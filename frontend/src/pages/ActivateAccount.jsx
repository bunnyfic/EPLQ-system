import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import bgImage from "../assets/signup-bg.png";
import { activateAccount } from "../services/api";

export default function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("activating"); // activating | success | error
  const [message, setMessage] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return; // guard against double-invoke in StrictMode
    calledRef.current = true;

    if (!token) {
      setStatus("error");
      setMessage("missing or invalid activation link");
      return;
    }

    (async () => {
      try {
        const res = await activateAccount({ token });
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.detail || "something went wrong. try again");
      }
    })();
  }, [token]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <div
        className="relative z-10 w-full max-w-sm mx-4 p-8 rounded-lg backdrop-blur-sm border border-[#9B7E85]/30 text-center"
        style={{ backgroundColor: "rgba(43, 49, 56, 0.75)" }}
      >
        <h1
          className="text-3xl mb-1 text-center tracking-widest"
          style={{ color: "#8B9A7C", fontFamily: "serif" }}
        >
          {status === "success" ? "Crossed Over" : status === "error" ? "Lost in the Fog" : "Crossing Over"}
        </h1>

        <p className="text-sm mt-6 tracking-wide" style={{ color: status === "error" ? "#c73e3e" : "#9B7E85" }}>
          {status === "activating" ? "activating your account..." : message}
        </p>

        {status !== "activating" && (
          <p className="text-center text-xs mt-8" style={{ color: "#9B7E85" }}>
            <Link to="/login" className="underline" style={{ color: "#8B9A7C" }}>
              back to login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}