import React from "react";
import { Link } from "react-router-dom";
import Image from "./image";      // Adjust import if needed
import Percent from "./percent";  // Adjust import if needed

export default function Asset({ item }) {
  return (
    <Link
      to="/token"
      className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-theme-on-surface-2/80 hover:bg-theme-on-surface-2 transition-all shadow-sm
        group cursor-pointer"
      style={{ minHeight: "4.5rem" }}
    >
      {/* Logo */}
      <div className="shrink-0">
        <Image
          className="crypto-logo w-10 h-10"
          src={item.icon}
          width={40}
          height={40}
          alt={item.currencyFull}
        />
      </div>
      {/* Coin Name & Symbol */}
      <div className="flex flex-col grow min-w-0">
        <div className="flex items-center gap-2 truncate">
          <span className="font-inter-display font-semibold text-base-1s text-theme-primary truncate">
            {item.currencyFull}
          </span>
          <span className="text-theme-tertiary text-sm tracking-wide">
            {item.currencyShort}
          </span>
          <span className="ml-2 px-2 rounded bg-theme-on-surface-3 text-theme-tertiary text-xs">
            #{item.number}
          </span>
        </div>
      </div>
      {/* Price */}
      <div className="ml-auto min-w-[100px] text-right font-mono font-bold text-theme-primary">
        ${item.price}
      </div>
      {/* Percent */}
      <div className="flex justify-end w-20">
        <Percent value={item.percent} />
      </div>
    </Link>
  );
}
