import React from "react";

function OrderBTC({ bids = [], asks = [] }) {
  // Demo fallback data
  if (!bids.length || !asks.length) {
    bids = [
      { price: 107000, amount: 0.28 },
      { price: 106980, amount: 0.21 },
      { price: 106950, amount: 0.14 },
      { price: 106930, amount: 0.09 },
      { price: 106900, amount: 0.06 },
    ];
    asks = [
      { price: 107020, amount: 0.17 },
      { price: 107040, amount: 0.19 },
      { price: 107060, amount: 0.22 },
      { price: 107090, amount: 0.11 },
      { price: 107120, amount: 0.05 },
    ];
  }

  return (
    <div className="max-w-3xl mx-auto w-full mt-8 bg-[#101726]/80 rounded-2xl shadow-xl border border-[#23283a]/60 p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-1 border-b border-[#23283a]/60 bg-[#101726]/90">
        <div className="flex flex-col">
          <span className="font-extrabold text-xl text-white tracking-wide drop-shadow-lg">Order Book</span>
          <span className="text-xs text-theme-tertiary font-medium tracking-wide opacity-60">BTC/USDT</span>
        </div>
        <span className="rounded-lg px-3 py-1 text-xs font-mono font-bold text-[#FFD700] bg-[#23283a]/40 border border-[#1f2fff]/40">
          Neutrade
        </span>
      </div>
      {/* Content */}
      <div className="flex flex-row gap-5 p-6 bg-[#101726]/80">
        {/* Bids */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="block w-2 h-2 rounded-full bg-theme-green"></span>
            <span className="font-semibold text-theme-green text-sm uppercase tracking-wide">Bids</span>
          </div>
          <div className="space-y-1">
            {bids.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-2 py-1 rounded bg-theme-green/5 hover:bg-theme-green/10 transition"
              >
                <span className="font-mono text-green-300 text-sm">{row.price.toLocaleString()}</span>
                <span className="font-mono text-white/90 text-xs">{row.amount} BTC</span>
              </div>
            ))}
          </div>
        </div>
        {/* Divider */}
        <div className="w-[1px] bg-gradient-to-b from-[#1f2fff30] via-[#23283a] to-[#ffd70030] mx-2 rounded" />
        {/* Asks */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="block w-2 h-2 rounded-full bg-theme-red"></span>
            <span className="font-semibold text-theme-red text-sm uppercase tracking-wide">Asks</span>
          </div>
          <div className="space-y-1">
            {asks.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-2 py-1 rounded bg-theme-red/5 hover:bg-theme-red/10 transition"
              >
                <span className="font-mono text-red-300 text-sm">{row.price.toLocaleString()}</span>
                <span className="font-mono text-white/90 text-xs">{row.amount} BTC</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="px-6 pb-5 pt-2 text-right">
        <span className="text-xs font-mono text-theme-tertiary/80">Live order book demo • NovaChain</span>
      </div>
    </div>
  );
}

export default OrderBTC;
