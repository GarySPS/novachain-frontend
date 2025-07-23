import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MAIN_API_BASE } from '../config';
import Card from "../components/card";
import NovaChainLogo from "../components/NovaChainLogo.svg";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch(`${MAIN_API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await res.json();

      if (res.status === 409 && data.unverified) {
        setSuccess("You have already registered but not verified. Please check your email for the OTP code.");
        setTimeout(() => navigate("/verify-otp", { state: { email } }), 1400);
        return;
      }
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
              className="block select-none pointer-events-none"
              style={{
                width: "93%",
                maxWidth: 210,
                minWidth: 120,
                height: "auto",
                objectFit: "contain"
              }}
              draggable={false}
            />
          </div>
          <h2 className="text-2xl font-extrabold mb-7 text-center tracking-tight text-[#232836]">
            Create Account
          </h2>
          <form onSubmit={handleSignUp} className="flex flex-col gap-5 items-center w-full">
            <div className="w-full flex flex-col items-center">
              <label htmlFor="username" className="block text-lg font-bold text-[#232836] mb-1 w-full text-left">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Create your username"
                className="w-full h-12 rounded-xl px-4 bg-[#eaf1fb] text-base font-medium border border-[#c9e3fc] focus:border-[#00eaff] focus:ring-2 focus:ring-[#1f2fff22] outline-none transition"
                style={{
                  maxWidth: 320,
                  fontSize: "1.06rem"
                }}
              />
            </div>
            <div className="w-full flex flex-col items-center">
              <label htmlFor="email" className="block text-lg font-bold text-[#232836] mb-1 w-full text-left">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full h-12 rounded-xl px-4 bg-[#eaf1fb] text-base font-medium border border-[#c9e3fc] focus:border-[#00eaff] focus:ring-2 focus:ring-[#00eaff22] outline-none transition"
                style={{
                  maxWidth: 320,
                  fontSize: "1.06rem"
                }}
              />
            </div>
            <div className="w-full flex flex-col items-center">
              <label htmlFor="password" className="block text-lg font-bold text-[#232836] mb-1 w-full text-left">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Create a password"
                className="w-full h-12 rounded-xl px-4 bg-[#eaf1fb] text-base font-medium border border-[#c9e3fc] focus:border-[#ffd700] focus:ring-2 focus:ring-[#ffd70044] outline-none transition"
                style={{
                  maxWidth: 320,
                  fontSize: "1.06rem"
                }}
              />
            </div>
            <div className="w-full flex flex-col items-center">
              <label htmlFor="confirmPassword" className="block text-lg font-bold text-[#232836] mb-1 w-full text-left">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your password"
                className="w-full h-12 rounded-xl px-4 bg-[#eaf1fb] text-base font-medium border border-[#c9e3fc] focus:border-[#ffd700] focus:ring-2 focus:ring-[#ffd70044] outline-none transition"
                style={{
                  maxWidth: 320,
                  fontSize: "1.06rem"
                }}
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-500 rounded-md px-3 py-2 text-center text-base w-full max-w-[320px]">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-md px-3 py-2 text-center text-base w-full max-w-[320px]">
                {success}
              </div>
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
              Register
            </button>
          </form>
          <div className="mt-9 mb-1 text-xs text-gray-500 text-center font-semibold">
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
