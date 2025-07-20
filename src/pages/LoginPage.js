import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MAIN_API_BASE } from '../config';
import Card from "../components/card";
import NovaChainLogo from "../components/NovaChainLogo.svg"; // SVG logo
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

      // Handle NOT verified: redirect to OTP page with email pre-filled
      if (res.status === 403 && data.error && data.error.toLowerCase().includes("verify your email")) {
        navigate("/verify-otp", { state: { email } });
        return;
      }

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      // Navigate to wallet after login
      navigate('/wallet');
    } catch (err) {
      setError("Platform is under scheduled maintenance. Please try again soon.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 py-8"
      style={{
        backgroundImage: 'url("/novachainlogin.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-[#181c2cbb] backdrop-blur-[1.5px]" style={{ zIndex: 1 }}></div>
      {/* Centered Card */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full p-7 rounded-3xl shadow-2xl border-0 bg-white/90" style={{ overflow: "visible" }}>
          {/* Animated Glow Logo */}
          <div className="flex items-center justify-center w-full mb-7 mt-[-10px]">
            <img
              src={NovaChainLogo}
              alt="NovaChain Logo"
              className="block select-none pointer-events-none"
              style={{
                width: "90%",
                maxWidth: 320,
                minWidth: 170,
                height: "auto",
                objectFit: "contain"
              }}
              draggable={false}
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-7">
            <label
              htmlFor="email"
              className="block text-xl font-extrabold text-[#232836] mb-1 tracking-tight"
            >
              Username/Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your username or email"
              className="w-full h-14 rounded-xl px-5 bg-[#eaf1fb] text-lg font-semibold border-2 border-[#bee3f8] focus:border-[#1f2fff] focus:ring-2 focus:ring-[#00eaff55] transition outline-none mb-4"
              autoFocus
            />

            <label
              htmlFor="password"
              className="block text-xl font-extrabold text-[#232836] mb-1 tracking-tight"
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
              className="w-full h-14 rounded-xl px-5 bg-[#eaf1fb] text-lg font-semibold border-2 border-[#bee3f8] focus:border-[#1f2fff] focus:ring-2 focus:ring-[#ffd70044] transition outline-none"
            />

            {/* Error or Maintenance Card */}
            {error && error.toLowerCase().includes("maintain") ? (
              <DatabaseErrorCard />
            ) : error && (
              <div className="bg-red-50 border border-red-200 text-red-500 rounded-lg px-4 py-2 text-center mb-2">
                {error}
              </div>
            )}

            {/* Animated Login button */}
            <button
              className="w-full h-14 rounded-xl font-extrabold text-2xl tracking-wider shadow-lg"
              type="submit"
              style={{
                background: "linear-gradient(90deg,#00eaff 0%,#1f2fff 53%,#ffd700 100%)",
                color: "#232836",
                letterSpacing: 1.5,
                boxShadow: "0 2px 24px #1f2fff22, 0 1.5px 0 #ffd700",
                transition: "filter 0.23s, box-shadow 0.16s, background 0.4s",
                border: "none",
                outline: "none"
              }}
              onMouseDown={e => { e.target.style.filter = "brightness(0.93)"; e.target.style.boxShadow = "0 1px 10px #00eaff44"; }}
              onMouseUp={e => { e.target.style.filter = ""; e.target.style.boxShadow = "0 2px 24px #1f2fff22, 0 1.5px 0 #ffd700"; }}
              onMouseLeave={e => { e.target.style.filter = ""; e.target.style.boxShadow = "0 2px 24px #1f2fff22, 0 1.5px 0 #ffd700"; }}
            >
              Login
            </button>
          </form>

          {/* Extra links */}
          <div className="flex flex-col md:flex-row gap-3 mt-10 w-full">
            <Link
              to="/forgot"
              className="w-full px-6 py-3 rounded-xl font-bold text-lg text-[#00eaff] bg-[#eaf8fc] hover:bg-[#00eaff] hover:text-white shadow-md transition-all duration-150 text-center"
              style={{
                boxShadow: "0 1.5px 0 #00eaff33, 0 2.5px 12px #00eaff11"
              }}
            >
              Forgot password?
            </Link>
            <Link
              to="/signup"
              className="w-full px-6 py-3 rounded-xl font-bold text-lg text-[#ffd700] bg-[#fff8e1] hover:bg-[#ffd700] hover:text-[#232836] shadow-md transition-all duration-150 text-center"
              style={{
                boxShadow: "0 1.5px 0 #ffd70033, 0 2.5px 12px #ffd70011"
              }}
            >
              Sign up
            </Link>
          </div>

          {/* Customer Support - Smaller, inside a light box */}
          <div className="mt-6 w-full flex justify-center">
            <div className="w-full max-w-[340px] rounded-xl bg-[#f4f7fb] border border-[#e0e4ef] px-3 py-3 flex flex-col items-center shadow-sm">
              <div className="flex flex-row gap-2 w-full">
                <a
                  href="https://wa.me/66642822983"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-2 py-2 rounded-lg font-semibold text-base bg-[#25D366] text-white hover:bg-[#22b95f] transition text-center"
                  style={{ minWidth: 0 }}
                >
                  WhatsApp
                </a>
                <a
                  href="https://t.me/novachainsingapore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-2 py-2 rounded-lg font-semibold text-base bg-[#229ED9] text-white hover:bg-[#178fca] transition text-center"
                  style={{ minWidth: 0 }}
                >
                  Telegram
                </a>
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">
                Support: WhatsApp or Telegram, 24/7
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* Logo Glow Animation */}
      <style>
        {`
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
