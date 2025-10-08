import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/card";
import NewsTicker from "../components/newsticker";
import { MAIN_API_BASE } from "../config";

/* ---------- helpers ---------- */
function formatBigNum(number) {
  if (!number || isNaN(number)) return "--";
  if (number >= 1e12) return "$" + (number / 1e12).toFixed(2) + "T";
  if (number >= 1e9) return "$" + (number / 1e9).toFixed(2) + "B";
  if (number >= 1e6) return "$" + (number / 1e6).toFixed(2) + "M";
  if (number >= 1e3) return "$" + (number / 1e3).toFixed(2) + "K";
  return "$" + Number(number).toLocaleString();
}
const pctClass = (v) =>
  v > 0
    ? "text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200"
    : v < 0
    ? "text-rose-600 bg-rose-50 ring-1 ring-rose-200"
    : "text-slate-600 bg-slate-50 ring-1 ring-slate-200";

export default function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsHeadlines, setNewsHeadlines] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("mcap"); // mcap | volume | change | price | name

  /* ---------- prices (fetch >= 100) ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nc_coins");
      if (raw) setCoins(JSON.parse(raw));
    } catch {}

    const fetchPrices = async () => {
      try {
        // ask backend for lots (most CoinMarketCap-style proxies accept limit)
        const urls = [
          `${MAIN_API_BASE}/prices?limit=200`,
          `${MAIN_API_BASE}/prices?limit=150`,
          `${MAIN_API_BASE}/prices?limit=100`,
          `${MAIN_API_BASE}/prices`, // final fallback
        ];
        let freshCoins = [];
        for (const u of urls) {
          try {
            const r = await fetch(u);
            const j = await r.json();
            const arr = j?.data || [];
            if (arr.length > freshCoins.length) freshCoins = arr;
            if (freshCoins.length >= 100) break;
          } catch {}
        }

        if (freshCoins.length) {
          setCoins(() => {
            try {
              localStorage.setItem("nc_coins", JSON.stringify(freshCoins));
            } catch {}
            return freshCoins;
          });
        }
      } catch {
        /* keep last cache */
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 12000);
    return () => clearInterval(interval);
  }, []);

  /* ---------- news ---------- */
  useEffect(() => {
    async function fetchHeadlines() {
      try {
        const rssUrl = "https://cointelegraph.com/rss";
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
          rssUrl
        )}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setNewsHeadlines(
          (data.items || [])
            .slice(0, 10)
            .map((item) =>
              item.title.replace(/&#(\d+);/g, (m, code) =>
                String.fromCharCode(code)
              )
            )
        );
      } catch {
        setNewsHeadlines([]);
      }
    }
    fetchHeadlines();
  }, []);

  /* ---------- computed ---------- */
  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = coins.slice();
    if (q) {
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.symbol?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const au = a.quote?.USD || {};
      const bu = b.quote?.USD || {};
      switch (sortBy) {
        case "price":
          return (bu.price || 0) - (au.price || 0);
        case "change":
          return (
            (bu.percent_change_24h || 0) - (au.percent_change_24h || 0)
          );
        case "volume":
          return (bu.volume_24h || 0) - (au.volume_24h || 0);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          // mcap
          return (bu.market_cap || 0) - (au.market_cap || 0);
      }
    });
    return list;
  }, [coins, query, sortBy]);

  // Always show up to 100 in the table
  const display = useMemo(
    () => filteredSorted.slice(0, 100),
    [filteredSorted]
  );

  const totalMcap = useMemo(
    () =>
      display.reduce(
        (sum, c) => sum + (c.quote?.USD?.market_cap || 0),
        0
      ),
    [display]
  );
  const totalVol = useMemo(
    () =>
      display.reduce(
        (sum, c) => sum + (c.quote?.USD?.volume_24h || 0),
        0
      ),
    [display]
  );

  /* ---------- skeleton ---------- */
  const SkeletonRow = ({ i }) => (
    <tr key={`sk-${i}`} className="animate-pulse border-b border-slate-100">
      <td className="py-4 px-3">
        <div className="w-8 h-8 rounded-full bg-slate-200" />
      </td>
      <td className="py-4 px-3">
        <div className="h-4 w-32 bg-slate-200 rounded" />
      </td>
      <td className="py-4 px-3">
        <div className="h-4 w-14 bg-slate-200 rounded" />
      </td>
      <td className="py-4 px-3 text-right">
        <div className="h-4 w-24 bg-slate-200 rounded ml-auto" />
      </td>
      <td className="py-4 px-3">
        <div className="h-6 w-20 bg-slate-200 rounded" />
      </td>
      <td className="py-4 px-3 text-right">
        <div className="h-4 w-24 bg-slate-200 rounded ml-auto" />
      </td>
      <td className="py-4 px-3 text-right">
        <div className="h-4 w-24 bg-slate-200 rounded ml-auto" />
      </td>
    </tr>
  );

return (
    <div className="w-full flex flex-col items-center bg-slate-50">
      {/* ---- Hero Video Section ---- */}
      <div className="relative w-full h-56 md:h-72 overflow-hidden">
        <video
          src="/novachainvd.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10"></div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-7xl mx-auto space-y-6 px-4 pb-6 -mt-16">
        
        {/* ---- Market Overview Card ---- */}
        <Card className="p-4 md:p-6 rounded-2xl shadow-lg border border-slate-200/80 bg-white/80 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Stat: Market Cap */}
                <div className="border-r border-slate-200 pr-6">
                    <div className="text-slate-500 text-sm font-medium">Global Market Cap</div>
                    <div className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800">
                        {formatBigNum(totalMcap)}
                    </div>
                </div>

                {/* Stat: 24h Volume */}
                <div className="lg:border-r border-slate-200 pr-6">
                    <div className="text-slate-500 text-sm font-medium">24h Volume</div>
                    <div className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800">
                        {formatBigNum(totalVol)}
                    </div>
                </div>
                
                {/* Controls */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                        className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white bg-no-repeat px-4 py-2.5 outline-none transition-all focus:ring-2 focus:ring-sky-400"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="mcap">Sort by Market Cap</option>
                        <option value="volume">Sort by 24h Volume</option>
                        <option value="change">Sort by 24h Change</option>
                        <option value="price">Sort by Price</option>
                        <option value="name">Sort by Name</option>
                    </select>

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-slate-400" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <input
                            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 outline-none transition-all focus:ring-2 focus:ring-sky-400"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </Card>

        {/* ---- Main Crypto Table Card ---- */}
        <Card className="p-0 overflow-hidden rounded-2xl shadow-lg border border-slate-200/80">
          <div className="w-full overflow-x-auto">
            {/* ... table code starts here ... */}
            <table className="w-full text-sm md:text-base">
              {/* ... table content ... */}
            </table>
          </div>
        </Card>

        {/* ---- News Ticker ---- */}
        <Card className="p-0 rounded-2xl shadow-lg border border-slate-200/80">
          <div className="px-3 md:px-4 py-4">
            <NewsTicker
              news={
                newsHeadlines.length
                  ? newsHeadlines
                  : ["Loading latest crypto headlines..."]
              }
            />
          </div>
        </Card>
      </div>
    </div>
  );
}