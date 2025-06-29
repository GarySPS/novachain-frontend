// src/components/navbar.js

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as NovaChainLogo } from './NovaChainLogo.svg';

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Trade", to: "/trade" },
  { label: "History", to: "/trade-history" },
  { label: "Wallet", to: "/wallet" },
  { label: "Profile", to: "/profile" },
  { label: "About Us", to: "/about" }, 
];


export default function NavBar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-theme-stroke shadow-md w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-2 w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
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
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}