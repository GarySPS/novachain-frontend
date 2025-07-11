// src/components/NavBar.js

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as NovaChainLogo } from './NovaChainLogo.svg';
import { useTranslation } from "react-i18next"; // <-- ADD THIS

// Use translation keys for nav items
const navItems = [
  { label: "dashboard", to: "/" },
  { label: "trade", to: "/trade" },
  { label: "history", to: "/trade-history" },
  { label: "wallet", to: "/wallet" },
  { label: "profile", to: "/profile" },
  { label: "news", to: "/news" },      
  { label: "about_us", to: "/about" },
];

export default function NavBar() {
  const location = useLocation();
  const { t } = useTranslation(); // <-- ADD THIS

  return (
    <header
      className="sticky top-0 z-30 border-b border-theme-stroke shadow-md w-full"
      style={{
        background: "linear-gradient(120deg, #fdfcff 0%, #f8fafd 100%)",
        backdropFilter: "blur(8px)"
      }}
    >
      <div className="w-full flex items-center justify-between h-16 px-2 md:max-w-7xl md:mx-auto md:px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <NovaChainLogo className="h-12 md:h-10 w-auto drop-shadow-lg" />
        </Link>
        {/* Nav Links */}
        <nav className="flex gap-2 md:gap-1 overflow-x-auto no-scrollbar max-w-[70vw] sm:max-w-[60vw]">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "px-4 py-2 rounded-full font-semibold transition-all text-base-1s whitespace-nowrap " +
                  (active
                    ? "bg-theme-brand text-theme-white-fixed shadow-sm"
                    : "text-theme-secondary hover:bg-theme-on-surface-2 hover:text-theme-primary")
                }
              >
                {t(item.label)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
