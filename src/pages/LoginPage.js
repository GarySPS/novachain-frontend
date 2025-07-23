import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MAIN_API_BASE } from '../config';
import Card from "../components/card";
import NovaChainLogo from "../components/NovaChainLogo.svg";
import DatabaseErrorCard from "../components/DatabaseErrorCard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${MAIN_API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.status === 403 && data.error && data.error.toLowerCase().includes("verify your email")) {
        navigate("/verify-otp", { state: { email } });
        return;
      }
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      navigate('/wallet');
    } catch (err) {
      setError("Platform is under scheduled maintenance. Please try again soon.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative px-2 py-4"
      style={{
        backgroundImage: 'url("/novachain.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-[#181c2cbb] backdrop-blur-[2px]" style={{ zIndex: 1 }} />
      <div className="relative z-10 w-full flex flex-col items-center">
        <Card
          className="rounded-2xl shadow-2xl border-0 bg-white/90 mx-auto"
          style={{
            width: "100%",
            maxWidth: "420px",
            minWidth: 0,
            padding: "2.3rem 2rem 1.8rem 2rem",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <div className="flex items-center justify-center w-full mb-6 mt-[-10px]">
            <img
              src={NovaChainLogo}
              alt="NovaChain Logo"
              style={{
                width: "93%",
                maxWidth: 210,
                minWidth: 120,
                height: "auto",
                objectFit: "contain"
              }}
              className="block select-none pointer-events-none"
              draggable={false}
            />
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-5 items-center w-full">
            <div className="w-full flex flex-col items-center">
              <label
                htmlFor="email"
                className="block text-lg font-bold text-[#232836] mb-1 text-left w-full"
                style={{ letterSpacing: 0.2 }}
              >
                Username/Email
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your username"
                className="w-full h-12 rounded-xl px-4 bg-[#eaf1fb] text-base font-medium border border-[#c9e3fc] focus:border-[#1f2fff] focus:ring-2 focus:ring-[#00eaff33] outline-none transition"
                autoFocus
                style={{
                  maxWidth: 320,
                  fontSize: "1.06rem"
                }}
              />
            </div>
            <div className="w-full flex flex-col items-center">
              <label
                htmlFor="password"
                className="block text-lg font-bold text-[#232836] mb-1 text-left w-full"
                style={{ letterSpacing: 0.2 }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full h-12 rounded-xl px-4 bg-[#eaf1fb] text-base font-medium border border-[#c9e3fc] focus:border-[#1f2fff] focus:ring-2 focus:ring-[#ffd70022] outline-none transition"
                style={{
                  maxWidth: 320,
                  fontSize: "1.06rem"
                }}
              />
            </div>
            {error && (
              (error.toLowerCase().includes("maintain") || error.toLowerCase().includes("database")) ? (
                <DatabaseErrorCard />
              ) : (
                <div className="bg-red-50 border border-red-200 text-red-500 rounded-md px-3 py-2 text-center text-base w-full max-w-[320px]">
                  {error}
                </div>
              )
            )}
            <button
              className="h-12 rounded-xl font-extrabold text-lg tracking-wide shadow-md transition-all block mx-auto"
              type="submit"
              style={{
                width: "100%",
                maxWidth: 320,
                minWidth: 120,
                background: "linear-gradient(90deg,#00eaff 0%,#1f2fff 53%,#ffd700 100%)",
                color: "#232836",
                letterSpacing: 1.2,
                boxShadow: "0 2px 16px #1f2fff14, 0 1.5px 0 #ffd70044",
                border: "none",
                outline: "none",
                fontSize: "1.17rem"
              }}
              onMouseDown={e => { e.target.style.filter = "brightness(0.93)"; }}
              onMouseUp={e => { e.target.style.filter = ""; }}
              onMouseLeave={e => { e.target.style.filter = ""; }}
            >
              Login
            </button>
          </form>
          <div className="flex flex-col gap-2 mt-7 items-center w-full">
            <Link
              to="/forgot"
              className="block mx-auto py-2 w-full max-w-[220px] rounded-xl font-semibold text-base text-[#00b7e6] bg-[#e8fafd] hover:bg-[#00b7e6] hover:text-white shadow-sm transition-all duration-150 text-center"
              style={{
                fontSize: "1rem"
              }}
            >
              Forgot password?
            </Link>
            <Link
              to="/signup"
              className="block mx-auto py-2 w-full max-w-[220px] rounded-xl font-semibold text-base text-[#ffd700] bg-[#fffbe9] hover:bg-[#ffd700] hover:text-[#232836] shadow-sm transition-all duration-150 text-center"
              style={{
                fontSize: "1rem"
              }}
            >
              Sign up
            </Link>
          </div>
          <div className="mt-7 w-full flex justify-center">
            <div className="w-full max-w-[220px] rounded-xl bg-[#f4f7fb] border border-[#e0e4ef] px-2 py-2 flex flex-col items-center shadow-sm">
              <div className="flex flex-row gap-2 w-full">
                <a
                  href="https://wa.me/66642822983"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-2 py-2 rounded font-semibold text-sm bg-[#25D366] text-white hover:bg-[#22b95f] transition text-center"
                  style={{ minWidth: 0 }}
                >
                  WhatsApp
                </a>
                <a
                  href="https://t.me/novachainsingapore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-2 py-2 rounded font-semibold text-sm bg-[#229ED9] text-white hover:bg-[#178fca] transition text-center"
                  style={{ minWidth: 0 }}
                >
                  Telegram
                </a>
              </div>
              <div className="text-xs text-gray-500 text-center mt-1">
                Support: WhatsApp or Telegram
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* Logo Glow Animation */}
      <style>
        {`
        @media (max-width: 480px) {
          .responsive-card {
            max-width: 340px !important;
            padding-left: 1.1rem !important;
            padding-right: 1.1rem !important;
          }
          .responsive-input {
            max-width: 210px !important;
            font-size: 0.98rem !important;
          }
          .responsive-button {
            max-width: 210px !important;
            font-size: 1rem !important;
          }
        }
        @keyframes logoGlow {
          0% { filter: drop-shadow(0 0 16px #00eaff99); }
          48% { filter: drop-shadow(0 0 52px #00eaff66); }
          100% { filter: drop-shadow(0 0 16px #00eaff99); }
        }
        img[alt="NovaChain Logo"] {
          animation: logoGlow 2.8s ease-in-out infinite alternate;
        }
        `}
      </style>
    </div>
  );
}
