import React, { useState } from "react";
import { MAIN_API_BASE } from '../config';
import { useNavigate } from "react-router-dom";
import NovaChainLogo from "../components/NovaChainLogo.svg";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: otp+password, 3: done
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async e => {
    e.preventDefault();
    setMsg(""); setErr(""); setLoading(true);
    try {
      const res = await fetch(`${MAIN_API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setStep(2);
        setMsg("OTP sent to your email.");
      } else {
        setErr(data.error || "Failed to send OTP.");
      }
    } catch (err) {
      setLoading(false);
      setErr("Network error.");
    }
  };

  // Step 2: Reset password with OTP
  const handleResetPw = async e => {
    e.preventDefault();
    setMsg(""); setErr(""); setLoading(true);
    try {
      const res = await fetch(`${MAIN_API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: newPw })
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setStep(3);
        setMsg("Password changed! You can now log in.");
      } else {
        setErr(data.error || "Failed to reset password.");
      }
    } catch {
      setLoading(false);
      setErr("Network error.");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setMsg(""); setErr(""); setLoading(true);
    try {
      const res = await fetch(`${MAIN_API_BASE}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setMsg("OTP resent to your email.");
      } else {
        setErr(data.error || "Failed to resend OTP.");
      }
    } catch {
      setLoading(false);
      setErr("Network error.");
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
        <div className="bg-white/90 rounded-3xl shadow-xl w-full p-8">
          <div className="flex items-center justify-center mb-4 mt-[-16px] select-none">
            <img
              src={NovaChainLogo}
              alt="NovaChain Logo"
              className="block pointer-events-none"
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
          <h2 className="font-extrabold text-2xl mb-5 text-blue-700 text-center">Reset Password</h2>

          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="font-semibold mb-1 block">Email</label>
                <input
                  type="email"
                  className="w-full h-12 rounded-xl px-4 border border-blue-200 bg-blue-50 focus:border-blue-400"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-400 via-blue-500 to-yellow-400 text-white shadow disabled:opacity-70"
              >
                {loading ? "Sending OTP..." : "Request OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPw} className="space-y-5">
              <div>
                <label className="font-semibold mb-1 block">OTP Code</label>
                <input
                  type="text"
                  className="w-full h-12 rounded-xl px-4 border border-blue-200 bg-blue-50 focus:border-blue-400"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  placeholder="Enter OTP sent to email"
                  autoFocus
                />
                <button
                  type="button"
                  className="mt-2 text-sm text-blue-600 hover:underline"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>
              <div>
                <label className="font-semibold mb-1 block">New Password</label>
                <input
                  type="password"
                  className="w-full h-12 rounded-xl px-4 border border-blue-200 bg-blue-50 focus:border-blue-400"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-400 via-blue-500 to-yellow-400 text-white shadow disabled:opacity-70"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="text-green-600 font-bold text-lg">{msg}</div>
              <button
                className="w-full h-12 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-400 via-blue-500 to-yellow-400 text-white shadow"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </button>
            </div>
          )}

          {(msg || err) && step !== 3 && (
            <div className={`mt-5 text-center rounded-lg py-2 px-4 ${msg ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{msg || err}</div>
          )}
        </div>
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
