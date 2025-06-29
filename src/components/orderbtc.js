import React, { useEffect, useState } from "react";

// --- Replace with your CoinGecko/CMC Pro API URL and API KEY ---
const COIN_API_URL = "https://pro-api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
const API_KEY = "YOUR_COIN_GECKO_PRO_API_KEY"; // <-- insert your actual Pro API key

function generateOrderBook(midPrice) {
  // Generate mock order book with real price as center
  const bids = Array.from({ length: 5 }).map((_, i) => ({
    price: (midPrice - 20 - i * 30).toLocaleString(),
    amount: (Math.random() * 0.25 + 0.03).toFixed(2),
  }));
  const asks = Array.from({ length: 5 }).map((_, i) => ({
    price: (midPrice + 20 + i * 30).toLocaleString(),
    amount: (Math.random() * 0.25 + 0.03).toFixed(2),
  }));
  return { bids, asks };
}

export default function OrderBTC() {
  const [btcPrice, setBtcPrice] = useState(null);
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real-time price
  useEffect(() => {
    let timer;
    const fetchPrice = async () => {
      setLoading(true);
      try {
        const res = await fetch(COIN_API_URL, {
          headers: { "x-cg-pro-api-key": API_KEY }
        });
        const data = await res.json();
        const price = data.bitcoin.usd;
        setBtcPrice(price);
        const { bids, asks } = generateOrderBook(price);
        setBids(bids);
        setAsks(asks);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchPrice();
    timer = setInterval(fetchPrice, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="w-full max-w-3xl mx-auto mb-10 px-6 py-8 rounded-[32px] shadow-[0_4px_36px_0_rgba(38,40,64,0.10)] border"
      style={{
        background: "linear-gradient(140deg, #f9fafc 70%, #f8f6ee 100%)",
        border: "1px solid #f0f3f7"
      }}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <span className="text-[1.5rem] font-extrabold text-neutral-800">Order Book</span>
          <div className="text-xs text-gray-400 mt-1">BTC/USDT</div>
        </div>
        <span className="text-[13px] bg-yellow-100 px-3 py-1 rounded-xl font-bold text-yellow-700 shadow ml-2">Neutrade</span>
      </div>

      <div className="flex flex-row justify-between gap-10 py-2">
        {/* BIDS */}
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
            <span className="font-bold text-green-600 text-base">BIDS</span>
          </div>
          {loading ? (
            <div className="text-gray-400 text-xs pl-4">Loading...</div>
          ) : (
            bids.map((row, i) => (
              <div key={i} className="flex items-center justify-between px-1 py-1.5 font-mono">
                <span className="text-green-700 text-lg">{row.price}</span>
                <span className="text-gray-500 text-xs ml-4">{row.amount} BTC</span>
              </div>
            ))
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center">
          <div className="w-px h-40 bg-[#e7eaf2]" />
        </div>

        {/* ASKS */}
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
            <span className="font-bold text-red-600 text-base">ASKS</span>
          </div>
          {loading ? (
            <div className="text-gray-400 text-xs pl-4">Loading...</div>
          ) : (
            asks.map((row, i) => (
              <div key={i} className="flex items-center justify-between px-1 py-1.5 font-mono">
                <span className="text-red-600 text-lg">{row.price}</span>
                <span className="text-gray-500 text-xs ml-4">{row.amount} BTC</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Center Price */}
      <div className="w-full text-center my-2">
        <span className="inline-block text-[15px] font-bold text-blue-700 bg-blue-50 px-5 py-1.5 rounded-lg shadow-sm">
          {btcPrice ? `Live Price: $${btcPrice.toLocaleString()}` : "Loading..."}
        </span>
      </div>

      {/* Footer */}
      <div className="text-right pt-2 text-[13px] text-gray-400 font-medium tracking-wide opacity-80">
        Live order book demo • NovaChain
      </div>
    </div>
  );
}
