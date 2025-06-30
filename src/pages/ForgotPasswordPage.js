import React, { useState } from "react";
import { MAIN_API_BASE } from '../config';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: request OTP, 2: reset password
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Step 1: Request OTP
  const handleRequestOtp = async e => {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      const res = await fetch(`${MAIN_API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        setMsg("OTP sent to your email.");
      } else {
        setErr(data.error || "Failed to send OTP.");
      }
    } catch {
      setErr("Network error.");
    }
  };

  // Step 2: Reset password
  const handleResetPw = async e => {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      const res = await fetch(`${MAIN_API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: newPw })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Password changed! You can now login.");
      } else {
        setErr(data.error || "Failed to reset password.");
      }
    } catch {
      setErr("Network error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#15192a] px-4 py-8">
      <div className="bg-white/90 rounded-3xl shadow-xl max-w-md w-full p-8">
        <h2 className="font-extrabold text-2xl mb-5 text-blue-700">Reset Password</h2>
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
              className="w-full h-12 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-400 via-blue-500 to-yellow-400 text-white shadow"
            >
              Request OTP
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
              />
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
              className="w-full h-12 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-400 via-blue-500 to-yellow-400 text-white shadow"
            >
              Change Password
            </button>
          </form>
        )}
        {(msg || err) && (
          <div className={`mt-5 text-center rounded-lg py-2 px-4 ${msg ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{msg || err}</div>
        )}
      </div>
    </div>
  );
}
