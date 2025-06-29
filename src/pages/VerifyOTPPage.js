import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MAIN_API_BASE } from '../config';
import Card from "../components/card";
import NovaChainLogo from "../components/NovaChainLogo.svg";
import ReactCodesInput from "react-codes-input";

export default function VerifyOTPPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const pinWrapperRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) setEmail(location.state.email);
  }, [location]);

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
    // eslint-disable-next-line
  }, [otp]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || otp.length < 6) {
      setError("Enter your email and the 6-digit code.");
      return;
    }
    try {
      const res = await fetch(`${MAIN_API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }
      setSuccess(data.message || "Email verified!");
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError("Verification failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-n-8 px-4 py-8">
      <Card className="w-full max-w-md mx-auto p-8 rounded-3xl shadow-2xl border-0 bg-white/90" style={{overflow: "visible"}}>
        {/* Logo with Glow */}
        <div
          className="w-full flex items-center justify-center"
          style={{
            marginBottom: 36,
            marginTop: -10,
            userSelect: "none",
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
        {/* Subtitle and info */}
        <div className="mb-1 text-2xl font-extrabold text-center text-[#232836]" style={{ letterSpacing: 1.1 }}>
          Check your email to verify
        </div>
        <p className="text-base text-[#1f2fff] text-center mb-6 font-medium tracking-wide" style={{ opacity: 0.74 }}>
          Enter the 6-digit code sent to your email below.
        </p>

        <form onSubmit={handleVerify}>
          {/* Email input */}
          <input
            className="mb-4 w-full py-3 px-4 rounded-xl border-2 border-[#bee3f8] bg-[#eaf1fb] text-base font-semibold text-[#232836] focus:outline-none focus:border-[#1f2fff] transition"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={!!location.state?.email}
          />

          {/* OTP/Pin code input */}
          <ReactCodesInput
            classNameComponent="react-codes-custom mb-3"
            classNameWrapper="flex justify-center gap-2"
            classNameCodeWrapper="w-12 h-14 flex-none border-0"
            classNameEnteredValue="text-2xl font-bold text-[#1f2fff] tracking-widest"
            classNameCode="border-2 border-[#bee3f8] bg-[#f9fbfd] rounded-xl text-center text-2xl focus:border-[#00eaff] transition"
            classNameCodeWrapperFocus="shadow-[0_0_0_2px_#00eaff88]"
            initialFocus={true}
            wrapperRef={pinWrapperRef}
            placeholder="______"
            id="pin"
            codeLength={6}
            type="number"
            hide={false}
            value={otp}
            onChange={setOtp}
            inputMode="numeric"
            autoFocus
          />

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

          <button
            className="w-full h-14 rounded-xl font-extrabold text-2xl tracking-wider shadow-lg"
            type="submit"
            style={{
              background: "linear-gradient(90deg,#00eaff 0%,#1f2fff 53%,#ffd700 100%)",
              color: "#232836",
              letterSpacing: 1.1,
              boxShadow: "0 2px 24px #1f2fff22, 0 1.5px 0 #ffd700",
              border: "none",
              outline: "none",
              transition: "filter 0.23s, box-shadow 0.16s, background 0.4s",
            }}
            disabled={otp.length < 6 || !email}
            onMouseDown={e => { e.target.style.filter = "brightness(0.93)"; e.target.style.boxShadow = "0 1px 10px #00eaff44"; }}
            onMouseUp={e => { e.target.style.filter = ""; e.target.style.boxShadow="0 2px 24px #1f2fff22, 0 1.5px 0 #ffd700"; }}
            onMouseLeave={e => { e.target.style.filter = ""; e.target.style.boxShadow="0 2px 24px #1f2fff22, 0 1.5px 0 #ffd700"; }}
          >
            Verify
          </button>
        </form>
        <div className="flex justify-center items-center mt-8 text-base text-[#1f2fff] font-bold">
          <Link to="/login" className="hover:underline hover:text-[#00eaff] transition">Back to login</Link>
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
