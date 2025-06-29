// Neutrade OrderBook component for BTC/USDT
function OrderBook({ bids = [], asks = [] }) {
  // Fallback demo data if not provided
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
    <div className="w-full max-w-2xl mx-auto bg-[#101726] rounded-2xl p-6 shadow-lg border border-[#23283a]/60 mt-8">
      <div className="flex items-center justify-between mb-4">
        <span className="font-extrabold text-lg tracking-wide text-white">Order Book</span>
        <span className="text-xs text-gray-400 font-medium">BTC/USDT</span>
      </div>
      <div className="flex flex-row gap-6">
        {/* Bids (Buy orders) */}
        <div className="flex-1">
          <div className="text-green-400 text-xs font-semibold mb-1">Bids</div>
          <div className="space-y-1">
            {bids.map((row, i) => (
              <div key={i} className="flex items-center justify-between px-2 py-1 rounded bg-green-400/5 hover:bg-green-400/10 transition">
                <span className="font-mono text-green-300 text-sm">{row.price.toLocaleString()}</span>
                <span className="font-mono text-white/80 text-xs">{row.amount} BTC</span>
              </div>
            ))}
          </div>
        </div>
        {/* Asks (Sell orders) */}
        <div className="flex-1">
          <div className="text-red-400 text-xs font-semibold mb-1">Asks</div>
          <div className="space-y-1">
            {asks.map((row, i) => (
              <div key={i} className="flex items-center justify-between px-2 py-1 rounded bg-red-400/5 hover:bg-red-400/10 transition">
                <span className="font-mono text-red-300 text-sm">{row.price.toLocaleString()}</span>
                <span className="font-mono text-white/80 text-xs">{row.amount} BTC</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
