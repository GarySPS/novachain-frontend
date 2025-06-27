import React from "react";

export default function TopGainers({ prices }) {
  // Convert prices object to array and sort by 24h % change (descending)
  const priceArr = Object.entries(prices).map(([id, info]) => ({
    id,
    ...info,
  }));
  const gainers = priceArr
    .filter(c => typeof c.usd_24h_change === "number")
    .sort((a, b) => b.usd_24h_change - a.usd_24h_change)
    .slice(0, 5);

  return (
    <div className="my-8">
      <div
        className="bg-[#181e2e] rounded-2xl shadow-md border border-gray-700/60 px-6 py-4"
        style={{
          display: "inline-block",        // Only as wide as its content
          minWidth: "180px",              // Don't collapse too much
          maxWidth: "240px",              // Never stretch too far
        }}
      >
        <h3 className="font-bold text-green-100 mb-3 text-left text-lg">
          Top Gainers 🚀 LIVE
        </h3>
        <ul className="w-full text-left">
          {gainers.map((coin) => (
            <li
              key={coin.id}
              className="text-green-100 font-semibold text-base py-0.5"
            >
              {coin.id.toUpperCase()}&nbsp;
              {coin.usd_24h_change > 0 && "+"}
              {coin.usd_24h_change?.toFixed(2)}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
