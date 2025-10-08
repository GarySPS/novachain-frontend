import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MAIN_API_BASE } from "../config";
import NovaChainLogo from "../components/NovaChainLogo.svg";
import DatabaseErrorCard from "../components/DatabaseErrorCard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
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
      navigate("/wallet");
    } catch {
      setError("Platform is under scheduled maintenance. Please try again soon.");
    }
  };

return (
    // ---- UPDATED: Main background is now an image ----
    <div
      className="min-h-screen w-full relative flex items-center justify-center px-4 py-10 md:py-14"
      style={{
        backgroundImage: 'url("/login.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* The <video> element has been removed. */}
      
      {/* overlay */}
      <div className="absolute inset-0 bg-[#0c1022e6] backdrop-blur-[2px]" />

      <div className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-[480px] rounded-3xl bg-[#10162F]/80 backdrop-blur-xl shadow-2xl border border-sky-500/30 px-6 py-8 md:px-10 md:py-10">
          {/* logo */}
          <div className="flex justify-center">
            <img
              src={NovaChainLogo}
              alt="NovaChain Logo"
              className="w-40 md:w-48 select-none pointer-events-none"
              draggable={false}
            />
          </div>

          <div className="mt-8 w-full h-36 md:h-40 rounded-2xl overflow-hidden shadow-inner border border-sky-400/20">
              <video
                  src="/login.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
              />
          </div>
          
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm md:text-base font-semibold text-slate-300">
                Username or Email
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="yourname or you@email.com"
                className="w-full h-12 rounded-xl px-4 bg-slate-800/60 text-slate-100 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-400/20 focus:border-sky-400 transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm md:text-base font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full h-12 rounded-xl px-4 pr-12 bg-slate-800/60 text-slate-100 placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-400/20 focus:border-sky-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-slate-300 bg-slate-700/50 border border-slate-600 hover:bg-slate-700"
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  to="/forgot"
                  className="text-xs md:text-sm font-semibold text-sky-400 hover:text-sky-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error &&
              (error.toLowerCase().includes("maintain") || error.toLowerCase().includes("database") ? (
                <DatabaseErrorCard />
              ) : (
                <div className="w-full rounded-lg border border-red-400/50 bg-red-500/20 px-3 py-2 text-sm md:text-base text-red-200">
                  {error}
                </div>
              ))}

            <button
              type="submit"
              className="w-full h-12 md:h-12 rounded-xl font-extrabold text-base md:text-lg tracking-wide shadow-lg border-0 outline-none transition active:scale-[.99]"
              style={{
                background:
                  "linear-gradient(90deg,#00eaff 0%,#1f2fff 55%,#ffd700 100%)",
                color: "#141726",
                letterSpacing: "0.02em",
                boxShadow: "0 10px 24px rgba(0, 234, 255, 0.15)",
              }}
            >
              Login
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://wa.me/16627053615"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-3 py-2 text-center text-sm md:text-base font-bold text-white bg-[#25D366] hover:bg-[#22b95f] transition shadow"
            >
              WhatsApp
            </a>
            <a
              href="https://t.me/novachainsingapore"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-3 py-2 text-center text-sm md:text-base font-bold text-white bg-[#229ED9] hover:bg-[#178fca] transition shadow"
            >
              Telegram
            </a>
          </div>

          <div className="mt-5 flex justify-center">
            <Link
              to="/signup"
              className="text-sm md:text-base font-bold text-sky-400 hover:text-sky-300 hover:underline"
            >
              New here? Create an account
            </Link>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes logoGlow {
            0% { filter: drop-shadow(0 0 12px rgba(0,234,255,.55)); }
            50% { filter: drop-shadow(0 0 36px rgba(0,234,255,.35)); }
            100% { filter: drop-shadow(0 0 12px rgba(0,234,255,.55)); }
          }
          img[alt="NovaChain Logo"] { animation: logoGlow 3s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}
