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
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#15192a] px-4 py-8">
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

        {/* Customer Support Button */}
        <div className="mt-4 flex flex-col md:flex-row gap-3 justify-center w-full">
  <a
    href="https://wa.me/66642822983"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full px-6 py-3 rounded-xl font-bold text-lg bg-[#25D366] text-white border-2 border-[#25D366] hover:bg-white hover:text-[#25D366] flex items-center justify-center transition-all"
    style={{
      maxWidth: 180,
      boxShadow: "0 2px 10px #25D36622"
    }}
  >
    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 32 32">
      <path d="M16 3C9.383 3 4 8.383 4 15c0 2.485.811 4.782 2.174 6.666L4 29l7.53-2.05C13.273 27.616 14.617 28 16 28c6.617 0 12-5.383 12-13S22.617 3 16 3zm0 23c-1.272 0-2.523-.247-3.683-.732l-.262-.11-4.484 1.22 1.2-4.377-.169-.276C6.723 20.083 6 17.594 6 15 6 9.477 10.477 5 16 5s10 4.477 10 10-4.477 11-10 11zm5.367-7.433c-.246-.123-1.453-.718-1.678-.799-.225-.082-.389-.123-.553.124-.163.246-.633.798-.776.963-.143.163-.286.184-.532.062-.246-.123-1.037-.382-1.977-1.217-.73-.652-1.224-1.457-1.368-1.703-.143-.246-.015-.379.108-.501.112-.111.246-.286.369-.429.123-.143.164-.246.246-.409.082-.163.041-.307-.02-.429-.062-.123-.553-1.337-.758-1.833-.199-.48-.402-.413-.553-.42l-.47-.008a.896.896 0 0 0-.652.307c-.225.245-.86.84-.86 2.047s.88 2.375 1.003 2.539c.123.163 1.73 2.66 4.194 3.625.587.202 1.044.323 1.402.413.59.15 1.129.129 1.555.078.474-.058 1.453-.593 1.659-1.166.205-.573.205-1.065.143-1.167-.062-.102-.225-.163-.47-.286z"/>
    </svg>
    WhatsApp
  </a>
  <a
    href="https://t.me/novachainsingapore"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full px-6 py-3 rounded-xl font-bold text-lg bg-[#229ED9] text-white border-2 border-[#229ED9] hover:bg-white hover:text-[#229ED9] flex items-center justify-center transition-all"
    style={{
      maxWidth: 180,
      boxShadow: "0 2px 10px #229ED922"
    }}
  >
    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 32 32">
      <path d="M16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13S8.82 3 16 3zm6.545 9.087c-0.137 0.052-0.275 0.101-0.413 0.148-2.042 0.684-4.083 1.367-6.126 2.05-0.174 0.059-0.349 0.117-0.521 0.18-0.364 0.128-0.566 0.362-0.605 0.75-0.019 0.187-0.027 0.376-0.027 0.564v5.554c0 0.496 0.215 0.758 0.708 0.851 0.192 0.036 0.381 0.089 0.573 0.14 0.32 0.081 0.449 0.025 0.554-0.297 0.092-0.286 0.188-0.572 0.276-0.86 0.06-0.19 0.148-0.232 0.339-0.183 0.663 0.173 1.319 0.357 1.98 0.51 0.302 0.072 0.438 0.219 0.445 0.538 0.019 0.808 0.033 1.615 0.045 2.423 0.006 0.353 0.113 0.484 0.462 0.488 0.4 0.005 0.8 0.005 1.201 0 0.325-0.004 0.433-0.137 0.441-0.463 0.027-1.122 0.058-2.244 0.076-3.367 0.006-0.399 0.112-0.518 0.503-0.521 0.497-0.004 0.995-0.007 1.492-0.011 0.336-0.002 0.472-0.138 0.477-0.471 0.003-0.23 0.003-0.46 0-0.69-0.003-0.329-0.141-0.465-0.474-0.467-0.516-0.004-1.031-0.008-1.547-0.011-0.389-0.002-0.507-0.121-0.507-0.513 0.001-0.993 0.001-1.985 0-2.978-0.001-0.402 0.124-0.518 0.521-0.517 0.461 0.002 0.922 0.002 1.383 0 0.363-0.002 0.497-0.139 0.493-0.494-0.003-0.224-0.004-0.447-0.002-0.671 0.002-0.345-0.128-0.477-0.472-0.475-0.305 0.002-0.61 0-0.916 0.001z"/>
    </svg>
    Telegram
  </a>
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
