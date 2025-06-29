import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MAIN_API_BASE } from '../config';
import Card from "../components/card";
import NovaChainLogo from "../components/NovaChainLogo.svg"; // SVG logo

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${MAIN_API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }
      setSuccess("OTP code sent to your email. Please verify to complete sign up.");
      setTimeout(() => navigate("/verify-otp", { state: { email } }), 1400);
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa] px-4 py-8">
      <Card className="w-full max-w-md mx-auto p-8 rounded-3xl shadow-2xl border-0 bg-white/90" style={{overflow: "visible"}}>
        {/* Animated Logo */}
        <div
          className="w-full flex items-center justify-center"
          style={{
            marginBottom: 36,
            marginTop: -14,
            userSelect: "none"
          }}
        >
          <img
            src={NovaChainLogo}
            alt="NovaChain Logo"
            className="block select-none pointer-events-none"
            style={{
              width: "90%",
              maxWidth: 340,
              minWidth: 170,
              height: "auto",
              objectFit: "contain"
            }}
            draggable={false}
          />
        </div>
        <h2 className="text-2xl font-extrabold mb-8 text-center tracking-tight text-[#232836]">
          Create Account
        </h2>

        {/* Signup Form */}
        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Username */}
          <label
            htmlFor="username"
            className="block text-lg font-bold text-[#232836] mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            placeholder="Create your username"
            className="w-full h-14 rounded-xl px-5 bg-[#eaf1fb] text-lg font-semibold border-2 border-[#bee3f8] focus:border-[#00eaff] focus:ring-2 focus:ring-[#1f2fff22] transition outline-none mb-3"
          />

          {/* Email */}
          <label
            htmlFor="email"
            className="block text-lg font-bold text-[#232836] mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full h-14 rounded-xl px-5 bg-[#eaf1fb] text-lg font-semibold border-2 border-[#bee3f8] focus:border-[#00eaff] focus:ring-2 focus:ring-[#00eaff22] transition outline-none mb-3"
          />

          {/* Password */}
          <label
            htmlFor="password"
            className="block text-lg font-bold text-[#232836] mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Create a password"
            className="w-full h-14 rounded-xl px-5 bg-[#eaf1fb] text-lg font-semibold border-2 border-[#bee3f8] focus:border-[#ffd700] focus:ring-2 focus:ring-[#ffd70044] transition outline-none mb-3"
          />

          {/* Error / Success */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 rounded-lg px-4 py-2 text-center mb-2">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-center mb-2">
              {success}
            </div>
          )}

          {/* Register Button */}
          <button
            className="w-full h-14 rounded-xl font-extrabold text-2xl tracking-wider shadow-lg"
            type="submit"
            style={{
              background: "linear-gradient(90deg,#00eaff 0%,#1f2fff 53%,#ffd700 100%)",
              color: "#232836",
              letterSpacing: 1.2,
              boxShadow: "0 2px 24px #1f2fff22, 0 1.5px 0 #ffd700",
              border: "none",
              outline: "none",
              transition: "filter 0.23s, box-shadow 0.16s, background 0.4s",
            }}
            onMouseDown={e => { e.target.style.filter = "brightness(0.93)"; e.target.style.boxShadow = "0 1px 10px #00eaff44"; }}
            onMouseUp={e => { e.target.style.filter = ""; e.target.style.boxShadow = "0 2px 24px #1f2fff22, 0 1.5px 0 #ffd700"; }}
            onMouseLeave={e => { e.target.style.filter = ""; e.target.style.boxShadow = "0 2px 24px #1f2fff22, 0 1.5px 0 #ffd700"; }}
          >
            Register
          </button>
        </form>

        {/* Terms */}
        <div className="mt-10 mb-1 text-xs text-gray-500 text-center font-semibold">
          By signing up, you agree to the&nbsp;
          <a className="text-[#00eaff] hover:underline transition" href="/" target="_blank" rel="noopener noreferrer">
            Terms of Use
          </a>
          ,&nbsp;
          <a className="text-[#00eaff] hover:underline transition" href="/" target="_blank" rel="noopener noreferrer">
            Privacy Notice
          </a>
          , and&nbsp;
          <a className="text-[#00eaff] hover:underline transition" href="/" target="_blank" rel="noopener noreferrer">
            Cookie Notice
          </a>
          .
        </div>
        <div className="flex justify-center items-center mt-3 text-base text-[#1f2fff] font-bold">
          <Link to="/login" className="hover:underline hover:text-[#00eaff] transition">Already have an account? Login</Link>
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
