import React, { useEffect, useState } from "react";
import Card from "../components/card";
import NewsTicker from "../components/newsticker";
import { MAIN_API_BASE } from "../config";

function formatBigNum(number) {
  if (!number || isNaN(number)) return "--";
  if (number >= 1e12) return "$" + (number / 1e12).toFixed(2) + "T";
  if (number >= 1e9) return "$" + (number / 1e9).toFixed(2) + "B";
  if (number >= 1e6) return "$" + (number / 1e6).toFixed(2) + "M";
  if (number >= 1e3) return "$" + (number / 1e3).toFixed(2) + "K";
  return "$" + number.toLocaleString();
}

export default function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsHeadlines, setNewsHeadlines] = useState([]);

  // Fetch prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(`${MAIN_API_BASE}/prices`);
        const response = await res.json();
        setCoins(response.data || []);
        setLoading(false);
      } catch (err) {
        setCoins([]);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 12000);
    return () => clearInterval(interval);
  }, []);

  // Fetch news headlines for the ticker
  useEffect(() => {
    async function fetchHeadlines() {
      try {
        const rssUrl = "https://cointelegraph.com/rss";
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Grab first 10 headlines, fallback if none
        setNewsHeadlines(
          (data.items || []).slice(0, 10).map(
            (item) =>
              item.title.replace(
                /&#(\d+);/g,
                (m, code) => String.fromCharCode(code)
              )
          )
        );
      } catch (e) {
        setNewsHeadlines([]);
      }
    }
    fetchHeadlines();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-1 pt-1 pb-2">
      <div className="w-full max-w-6xl mx-auto space-y-0">
        <Card className="w-full max-w-6xl mx-auto p-0 mt-0 mb-0 bg-gradient-to-tr from-[#fff9e6] to-[#f1f8ff] shadow-lg rounded-2xl border border-[#f6e8ff]/80">
          <div className="overflow-x-auto rounded-2xl">
            <table className="min-w-[700px] w-full text-sm md:text-base">
              <thead>
                <tr className="text-left text-theme-tertiary border-b border-theme-stroke">
                  <th className="py-3 px-3 md:px-4 font-semibold text-center whitespace-nowrap">Logo</th>
                  <th className="py-3 px-3 md:px-4 font-semibold whitespace-nowrap">Name</th>
                  <th className="py-3 px-3 md:px-4 font-semibold whitespace-nowrap">Symbol</th>
                  <th className="py-3 px-3 md:px-4 font-semibold whitespace-nowrap">Price (USD)</th>
                  <th className="py-3 px-3 md:px-4 font-semibold whitespace-nowrap">24h Change</th>
                  <th className="py-3 px-3 md:px-4 font-semibold whitespace-nowrap">24h Volume</th>
                  <th className="py-3 px-3 md:px-4 font-semibold whitespace-nowrap">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin) => {
                  const change = coin.quote?.USD?.percent_change_24h;
                  const vol = coin.quote?.USD?.volume_24h;
                  const mcap = coin.quote?.USD?.market_cap;
                  return (
                    <tr
                      key={coin.id}
                      className="border-b border-theme-stroke last:border-0 hover:bg-theme-on-surface-2 transition"
                      style={{ height: 56 }}
                    >
                      {/* Logo */}
                      <td className="py-3 px-3 md:px-4 text-center">
                        <img
                          src={`https://assets.coincap.io/assets/icons/${coin.symbol?.toLowerCase()}@2x.png`}
                          alt={coin.symbol}
                          className="w-8 h-8 rounded-full object-contain shadow mx-auto"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </td>
                      {/* Name */}
                      <td className="py-3 px-3 md:px-4 font-semibold text-theme-primary text-base md:text-lg">
                        {coin.name}
                      </td>
                      {/* Symbol */}
                      <td className="py-3 px-3 md:px-4 text-theme-yellow font-mono text-base bg-theme-n-8/70 rounded font-bold">
                        {coin.symbol}
                      </td>
                      {/* Price */}
                      <td className="py-3 px-3 md:px-4 font-mono font-bold text-black text-center text-base">
                        ${coin.quote?.USD?.price?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "--"}
                      </td>
                      {/* 24h Change */}
                      <td className="py-3 px-3 md:px-4 font-semibold">
                        {typeof change === "number" ? (
                          <span
                            className={
                              "inline-block w-[86px] px-2 py-1 rounded-lg font-bold text-base text-white text-center " +
                              (change > 0
                                ? "bg-green-500"
                                : change < 0
                                ? "bg-red-500"
                                : "bg-gray-500")
                            }
                          >
                            {change > 0 ? "+" : ""}
                            {change.toFixed(2)}%
                          </span>
                        ) : "--"}
                      </td>
                      {/* 24h Volume */}
                      <td className="py-3 px-3 md:px-4 font-mono font-bold text-black text-center text-base">
                        <span className="inline-block min-w-[78px] px-2 py-1 rounded-lg bg-theme-n-7/80 text-black text-center font-bold">
                          {vol ? formatBigNum(vol) : "--"}
                        </span>
                      </td>
                      {/* Market Cap */}
                      <td className="py-3 px-3 md:px-4 font-mono whitespace-nowrap">
                        <span className="inline-block w-[86px] px-2 py-1 rounded-lg font-bold text-base text-white text-center bg-green-500">
                          {mcap ? formatBigNum(mcap) : "--"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* News Ticker */}
          <div className="w-full px-2 md:px-4 py-5">
           <NewsTicker news={newsHeadlines.length ? newsHeadlines : ["Loading latest crypto headlines..."]} />
        </div>
        </Card>
      </div>
    </div>
  );
}
