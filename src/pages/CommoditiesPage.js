// src/pages/CommoditiesPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import NovaChainLogo from "../components/NovaChainLogo.svg";
import { MAIN_API_BASE } from "../config";
import Card from "../components/card";
import Icon from "../components/icon";
import OrderXAU from "../components/OrderXAU"
import { useTranslation } from "react-i18next";

// Import our new components
import TradeModal from "../components/TradeModal";
import TradeResult from "../components/TradeResult";
import ActiveTradeTimer from "../components/ActiveTradeTimer";

/* ---------------- Commodities Definition ---------------- */
const COMMODITIES = [
  { symbol: "XAU/USD", name: "Gold", tv: "OANDA:XAUUSD", api: "xau" },
  { symbol: "XAG/USD", name: "Silver", tv: "OANDA:XAGUSD", api: "xag" },
  { symbol: "WTI/USD", name: "WTI Oil", tv: "OANDA:WTICOUSD", api: "wti" },
  { symbol: "GAS/USD", name: "Natural Gas", tv: "OANDA:NATGASUSD", api: "natgas" },
  { symbol: "XCU/USD", name: "Copper", tv: "OANDA:XCUUSD", api: "xcu" },
];
const profitMap = { 30: 0.3, 60: 0.5, 90: 0.7, 120: 1.0 };

/* ---------------- Local storage helpers (unchanged) ---------------- */
function persistTradeState(tradeState) {
  if (tradeState) localStorage.setItem("activeTrade", JSON.stringify(tradeState));
  else localStorage.removeItem("activeTrade");
}
function loadTradeState() {
  try {
    return JSON.parse(localStorage.getItem("activeTrade") || "null");
  } catch {
    return null;
  }
}
function createTradeState(trade_id, user_id, duration) {
  const endAt = Date.now() + duration * 1000;
  return { trade_id, user_id, duration, endAt };
}

export default function CommoditiesPage() {
  const { t } = useTranslation();

  /* ---------------- State (unchanged) ---------------- */
  const [selectedCommodity, setSelectedCommodity] = useState(COMMODITIES[0]);
  const [coinPrice, setCoinPrice] = useState(null);
  const [loadingChart, setLoadingChart] = useState(true);
  const [coinStats, setCoinStats] = useState(null);

  const [amount, setAmount] = useState(100);
  const [duration, setDuration] = useState(30);
  const [direction, setDirection] = useState("BUY");

  const [timerActive, setTimerActive] = useState(false);
  const [tradeState, setTradeState] = useState(null);
  const [timerKey, setTimerKey] = useState(0);
  const [waitingResult, setWaitingResult] = useState(false);

  const [tradeResult, setTradeResult] = useState(null);
  const [tradeDetail, setTradeDetail] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- pretty toast ---
  const [toast, setToast] = useState(null); // { text, type, id }
  const showToast = (text, type = "error") => {
    const id = Math.random();
    setToast({ text, type, id });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2000);
  };

  /* ---------------- Restore active trade (unchanged) ---------------- */
  useEffect(() => {
    const saved = loadTradeState();
    if (saved && saved.endAt > Date.now()) {
      const remaining = Math.ceil((saved.endAt - Date.now()) / 1000);
      const adjustedTradeState = { ...saved, duration: remaining };
      setTradeState(adjustedTradeState);
      setTimerActive(true);
      setTradeDetail(null);
      setTradeResult(null);
      setTimerKey(Math.random());
    }
  }, []);

  /* ---------------- Price polling (unchanged) ---------------- */
  useEffect(() => {
    let interval;
    const fetchPrice = async () => {
      try {
        const res = await axios.get(`${MAIN_API_BASE}/prices/${selectedCommodity.api}`); // Use .api here
        
        // Set price
        setCoinPrice(Number(res.data?.price));
        
        // Set new stats
        setCoinStats({
          high: res.data?.high_24h || 0,
          low: res.data?.low_24h || 0,
          vol: res.data?.volume_24h || 0,
        });

        setFetchError(false);
      } catch {
        setCoinPrice(null);
        setCoinStats(null); // Clear stats on error
        setFetchError(true);
      }
    };
    fetchPrice();
    interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, [selectedCommodity]);

  /* ---------------- TradingView loader (Fixed) ---------------- */
  useEffect(() => {
    setLoadingChart(true);

    // This function creates the widget
    const createWidget = () => {
      // Make sure the container is ready and empty
      const container = document.getElementById("tradingview_chart_container");
      if (!container) {
        console.error("TradingView container not found");
        return;
      }
      container.innerHTML = ""; // Clear container before creating new widget

      // Check if TradingView library is loaded
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: "tradingview_chart_container",
          width: "100%",
          height: 420,
          symbol: selectedCommodity.tv,
          interval: "15",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#0f0f16",
          backgroundColor: "#101726",
          enable_publishing: false,
          allow_symbol_change: false,
          hide_top_toolbar: false,
          hide_legend: false,
          hide_side_toolbar: true,
          withdateranges: true,
          details: false,
          studies: [],
          overrides: {},
          loading_screen: { backgroundColor: "#101726", foregroundColor: "#ffd700" },
        });
        setTimeout(() => setLoadingChart(false), 1400);
      } else {
        console.error("TradingView library not loaded");
      }
    };

    // Check if script is already on the page
    if (document.getElementById("tradingview-widget-script")) {
      // If script is already loaded, just create the widget
      createWidget();
    } else {
      // If script is not loaded, create and load it
      const script = document.createElement("script");
      script.id = "tradingview-widget-script";
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => createWidget(); // Create widget *after* script loads
      document.body.appendChild(script);
    }

    // The new cleanup function
    return () => {
      const container = document.getElementById("tradingview_chart_container");
      if (container) {
        container.innerHTML = ""; // Just empty the container
      }
    };
  }, [selectedCommodity]);

  /* ---------------- Result polling (unchanged) ---------------- */
  async function pollResult(trade_id, user_id) {
    let tries = 0,
      trade = null;
    const token = localStorage.getItem("token");
    while (tries < 6 && (!trade || trade.result === "PENDING")) {
      try {
        const his = await axios.get(`${MAIN_API_BASE}/trade/history/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        trade = his.data.find((t) => t.id === trade_id);
        if (trade && trade.result !== "PENDING") break;
      } catch {}
      await new Promise((r) => setTimeout(r, 1500));
      tries++;
    }
    setTimerActive(false);
    setTradeState(null);
    persistTradeState(null);
    if (trade && trade.result !== "PENDING") {
      setTradeResult(trade.result === "WIN" ? trade.profit : -Math.abs(trade.profit));
      setTradeDetail(trade);
    } else {
      setTradeResult(null);
      setTradeDetail(null);
      showToast(t("trade_result_not_ready", "Trade result not ready, please check history!"), "info");
    }
  }

  const onTimerComplete = async () => {
    setWaitingResult(true);
    if (!tradeState) return;
    await pollResult(tradeState.trade_id, tradeState.user_id);
    setTradeState(null);
    setTimerActive(false);
    setWaitingResult(false);
    setTimerKey(Math.random());
    return { shouldRepeat: false, delay: 0 };
  };

  /* ---------------- Execute trade (unchanged) ---------------- */
  const executeTrade = async () => {
    if (!coinPrice || timerActive) return;
    setTimerActive(true);
    setTradeResult(null);
    setTradeDetail(null);

    const token = localStorage.getItem("token");
    if (!token) {
      showToast(t("please_login", "Please log in to trade."), "warning");
      setTimerActive(false);
      return;
    }

    function parseJwt(token) {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch {
        return {};
      }
    }

    const payload = parseJwt(token);
    const user_id = payload.id;

    const endAt = Date.now() + duration * 1000;
    const temp = { trade_id: "temp", user_id, duration, endAt };

    setTradeState(temp);
    setTimerKey(Math.random());

    try {
      const res = await axios.post(
        `${MAIN_API_BASE}/trade`,
        {
          user_id,
          direction: direction.toUpperCase(),
          amount: Number(amount),
          duration: Number(duration),
          symbol: selectedCommodity.api,
          client_price: Number(coinPrice) || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.trade_id) throw new Error("Failed to start trade");
      const { trade_id } = res.data;

      setTradeState((prev) => (prev ? { ...prev, trade_id } : createTradeState(trade_id, user_id, duration)));
      persistTradeState({ trade_id, user_id, duration, endAt });
    } catch (err) {
      setTimerActive(false);
      setTradeResult(null);
      setTradeDetail(null);
      persistTradeState(null);
      showToast(`${t("trade_failed", "Trade failed")}: ${err.response?.data?.error || err.message}`, "error");
    }
  };

  const openTradeModal = (dir) => {
    if (timerActive) return;
    setDirection(dir);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-full px-3 pt-5 overflow-x-hidden"
    >
      {/* soft overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: "linear-gradient(120deg, #0b1020f0 0%, #0d1220d8 60%, #0a101dd1 100%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }} className="w-full">
        <div className="w-full max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-7 lg:gap-8">
          {/* ---------------- Left: Chart & selectors ---------------- */}
          {/* This outer div should remain */}
          <div className="w-full">
            {/* The coin selector div inside was correctly removed */}

            {/* chart box - THIS is what needs to be here */}
            <div className="relative w-full rounded-2xl shadow-2xl bg-gradient-to-br from-[#141a2b] via-[#0f1424] to-[#0b1020] border border-[#1a2343] overflow-hidden">
              <div id="tradingview_chart_container" className="w-full h-[420px]" />
              {loadingChart && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0c1323e6] backdrop-blur-sm">
                  <svg className="animate-spin mb-4" width="54" height="54" viewBox="0 0 54 54" fill="none">
                    <circle cx="27" cy="27" r="24" stroke="#2474ff44" strokeWidth="5" />
                    <path d="M51 27a24 24 0 1 1-48 0" stroke="#FFD700" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                  <div className="text-lg font-bold text-sky-100">{t("refreshing_price", "Refreshing Price...")}</div>
                </div>
              )}

              {/* floating price pill */}
              <div className="absolute right-[88px] top-[46px] md:right-3 md:top-3 z-10">
                <div className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm ring-1 ring-white/10 text-white font-medium shadow-sm">
                  <div className="text-[9px] uppercase tracking-wide text-white/60 leading-none">
                    {selectedCommodity.symbol}
                  </div>
                  <div className="text-sm tabular-nums font-bold leading-tight">
                    {typeof coinPrice === "number" && !isNaN(coinPrice)
                      ? "$" + coinPrice.toLocaleString(undefined, { maximumFractionDigits: 3 })
                      : fetchError
                      ? t("api_error", "API Error")
                      : t("loading", "Loading...")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- Right: Trade panel ---------------- */}
          {/* This wrapper div holds the right column content */}
          <div className="w-full">
            <Card className="w-full px-5 py-6 rounded-2xl shadow-2xl bg-gradient-to-br from-[#FFFAF0] to-[#FDFBFB] border border-slate-200">
              {/* header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-500">{t("pair", "Pair")}</span>
                  <span
                    className="font-extrabold text-[1.6rem] tracking-wide"
                    style={{
                      background: "linear-gradient(92deg, #1e2fff 0%, #00eaff 60%, #ffd700 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {selectedCommodity.symbol}
                  </span>
                </div>
                <img src={NovaChainLogo} alt="NovaChain" className="h-9 w-auto ml-4" />
              </div>

              {/* NEW Price Stats & Selector */}
              <div className="mb-5 border-b border-slate-200 pb-5">
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-slate-900">
                    {typeof coinPrice === "number" && !isNaN(coinPrice)
                      ? "$" + coinPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })
                      : "Loading..."}
                  </div>
                  {/* Optional: 24h percentage change */}
                  {/* <span className="text-lg font-bold text-red-500">-0.68%</span> */}
                </div>

                {/* Stats */}
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-slate-500">24h High</span>
                    <span className="font-semibold text-slate-800">
                      {coinStats ? "$" + coinStats.high.toLocaleString() : "..."}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500">24h Low</span>
                    <span className="font-semibold text-slate-800">
                      {coinStats ? "$" + coinStats.low.toLocaleString() : "..."}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500">24h Vol</span>
                    <span className="font-semibold text-slate-800">
                      {coinStats ? coinStats.vol.toLocaleString() + "M" : "..."}
                    </span>
                  </div>
                </div>

                {/* New Commodity Selector */}
                <div className="mt-4">
                  <select
                    value={selectedCommodity.symbol}
                    disabled={timerActive}
                    onChange={(e) => {
                      const newCommodity = COMMODITIES.find(c => c.symbol === e.target.value);
                      if (newCommodity) setSelectedCommodity(newCommodity);
                    }}
                    className="w-full h-11 px-3 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 font-bold text-base focus:ring-2 focus:ring-blue-500"
                  >
                    {COMMODITIES.map(commodity => (
                      <option key={commodity.symbol} value={commodity.symbol}>
                        {commodity.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buy/Sell Buttons */}
              <AnimatePresence>
                {!timerActive && !waitingResult && !tradeDetail && (
                  <motion.div
                    key="trade-buttons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="grid grid-cols-2 gap-4 mt-5" // Removed redundant mt-5 here, added below
                  >
                    <button
                      onClick={() => openTradeModal("BUY")}
                      className="w-full h-12 rounded-lg bg-green-500 text-white text-lg font-bold shadow-lg transition hover:bg-green-600 flex items-center justify-center gap-2"
                    >
                      <Icon name="arrow-up" />
                      {t("buy_long", "Buy Long")}
                    </button>
                    <button
                      onClick={() => openTradeModal("SELL")}
                      className="w-full h-12 rounded-lg bg-red-500 text-white text-lg font-bold shadow-lg transition hover:bg-red-600 flex items-center justify-center gap-2"
                    >
                      <Icon name="arrow-down" />
                      {t("sell_short", "Sell Short")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Timer / Waiting Indicator */}
              {/* Ensure mt-5 or similar is applied here if needed */}
              <div className="mt-5"> {/* Added a wrapper div with margin-top */}
                <AnimatePresence>
                  <ActiveTradeTimer
                    timerActive={timerActive}
                    waitingResult={waitingResult}
                    tradeState={tradeState}
                    timerKey={timerKey}
                    onTimerComplete={onTimerComplete}
                    t={t}
                  />
                </AnimatePresence>
              </div>


              {/* Result Box */}
              <AnimatePresence>
                 <TradeResult tradeDetail={tradeDetail} t={t} />
              </AnimatePresence>

            </Card> {/* This is the closing Card tag (around 463/464) */}
          </div> {/* This is the closing div for the right column wrapper (around 465) */}

          {/* Orders strip beneath on small screens */}
          <div className="lg:col-span-2 mt-2">
            <div className="w-full flex justify-center">
              <div className="max-w-5xl w-full px-1 md:px-2">
                <OrderXAU />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW Trade Modal (Rendered at root level) */}
      <TradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        direction={direction}
        duration={duration}
        setDuration={setDuration}
        amount={amount}
        setAmount={setAmount}
        profitMap={profitMap}
        onSubmit={executeTrade}
        t={t}
      />

      {/* toast – always global */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
            role="status"
            aria-live="polite"
          >
      <div
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ring-1 ring-white/15 text-white backdrop-blur pointer-events-auto
      ${
        toast.type === "error"
          ? "bg-rose-600/90"
          : toast.type === "warning"
          ? "bg-amber-600/90"
          : "bg-slate-900/90"
      }`}
  >
    <Icon
      name={
        toast.type === "error" ? "alert-circle" : toast.type === "warning" ? "alert-triangle" : "check-circle"
      }
      className="w-6 h-6"
    />
    <span className="text-base font-semibold">{toast.text}</span>
  </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}