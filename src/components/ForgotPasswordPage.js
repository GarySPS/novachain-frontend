// src/pages/ForgotPasswordPage.js
import React, { useState } from "react";
import { MAIN_API_BASE } from "../config";
import Card from "../components/card";
import NovaChainLogo from "../components/NovaChainLogo.svg";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${MAIN_API_BASE}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP. Try again.");
      } else {
        setSuccess(data.message || "If your email exists, instructions have been sent.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#15192a] px-4 py-8">
      <Card className="w-full max-w-md mx-auto p-7 rounded-3xl shadow-2xl border-0 bg-white/90" style={{ overflow: "visible" }}>
        {/* Logo */}
        <div className="flex items-center justify-center w-full mb-7 mt-[-10px]">
          <img
            src={NovaChainLogo}
            alt="NovaChain Logo"
            className="block select-none pointer-events-none"
            style={{ width: "90%", maxWidth: 320, minWidth: 170, height: "auto", objectFit: "contain" }}
            draggable={false}
          />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-[#1f2fff] text-center">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-7">
          <label htmlFor="email" className="block text-lg font-bold mb-1">Email</label>
          <input
            id="email"
            type="email"
            className="w-full h-14 rounded-xl px-5 bg-[#eaf1fb] text-lg font-semibold border-2 border-[#bee3f8] focus:border-[#1f2fff] focus:ring-2 focus:ring-[#00eaff55] transition outline-none mb-2"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 rounded-lg px-4 py-2 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-4 py-2 text-center">
              {success}
            </div>
          )}

          <button
            className="w-full h-14 rounded-xl font-extrabold text-xl tracking-wider shadow-lg"
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(90deg,#00eaff 0%,#1f2fff 53%,#ffd700 100%)",
              color: "#232836",
              letterSpacing: 1.5,
              boxShadow: "0 2px 24px #1f2fff22, 0 1.5px 0 #ffd700",
              opacity: loading ? 0.7 : 1,
              border: "none",
              outline: "none"
            }}
          >
            {loading ? "Sending..." : "Request OTP"}
          </button>
        </form>
      </Card>
    </div>
  );
}
