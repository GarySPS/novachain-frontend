import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MAIN_API_BASE } from '../config';

import Card from "../components/card";
import NovaChainLogo from "../components/NovaChainLogo.svg"; // SVG logo

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
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-n-8 px-4 py-8">
      <Card className="w-full max-w-md mx-auto p-7 rounded-3xl shadow-2xl border-0 bg-white/90" style={{ overflow: "visible" }}>
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

          {error && (
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
        <div className="flex justify-between items-center mt-10">
          <Link
            to="/forgot"
            className="px-6 py-3 rounded-xl font-bold text-lg text-[#00eaff] bg-[#eaf8fc] hover:bg-[#00eaff] hover:text-white shadow-md transition-all duration-150"
            style={{
              boxShadow: "0 1.5px 0 #00eaff33, 0 2.5px 12px #00eaff11"
            }}
          >
            Forgot password?
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 rounded-xl font-bold text-lg text-[#ffd700] bg-[#fff8e1] hover:bg-[#ffd700] hover:text-[#232836] shadow-md transition-all duration-150"
            style={{
              boxShadow: "0 1.5px 0 #ffd70033, 0 2.5px 12px #ffd70011"
            }}
          >
            Sign up
          </Link>
        </div>
      </Card>

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
