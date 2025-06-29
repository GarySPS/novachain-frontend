import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import NovaChainLogo from "../components/NovaChainLogo.svg";
import { MAIN_API_BASE } from '../config';
import Card from "../components/card";
import Field from "../components/field";
import Tooltip from "../components/tooltip";
import Icon from "../components/icon";
import TimerBar from "../components/TimerBar";
import OrderBTC from "../components/orderbtc";


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

export default function TradePage() {
  const [btcPrice, setBtcPrice] = useState(null);
  const [amount, setAmount] = useState(100);
  const [duration, setDuration] = useState(30);
  const [direction, setDirection] = useState("BUY");
  const [timerActive, setTimerActive] = useState(false);
  const [tradeResult, setTradeResult] = useState(null);
  const [tradeDetail, setTradeDetail] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [tradeState, setTradeState] = useState(null);
  const [timerKey, setTimerKey] = useState(0);
  const [waitingResult, setWaitingResult] = useState(false);


  // Restore active trade if exists
  useEffect(() => {
    const saved = loadTradeState();
    if (saved && saved.endAt > Date.now()) {
  const remaining = Math.ceil((saved.endAt - Date.now()) / 1000);
  const adjustedTradeState = { ...saved, duration: remaining }; // ⬅️ override with remaining time

  setTradeState(adjustedTradeState);
  setTimerActive(true);
  setTradeDetail(null);
  setTradeResult(null);
  setTimerKey(Math.random()); // ✅ still ok
}
  }, []);

  // BTC price polling
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await axios.get(`${MAIN_API_BASE}/price/BTC`);
        setBtcPrice(res.data.price);
        setFetchError(false);
      } catch {
        setBtcPrice(null);
        setFetchError(true);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, []);

  // Chart embed
useEffect(() => {
  const oldScript = document.getElementById("tradingview-widget-script");
  if (oldScript) oldScript.remove();
  const script = document.createElement("script");
  script.id = "tradingview-widget-script";
  script.src = "https://s3.tradingview.com/tv.js";
  script.async = true;
  script.onload = () => {
    if (window.TradingView) {
      new window.TradingView.widget({
        container_id: "tradingview_btcusdt_chart",
        width: "100%",
        height: 400,
        symbol: "BINANCE:BTCUSDT",
        interval: "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#0f0f16",
        backgroundColor: "#101726",   // <-- ADD THIS LINE
        enable_publishing: false,
        allow_symbol_change: false,
        hide_top_toolbar: false,
        hide_legend: false,
        hide_side_toolbar: true,
        withdateranges: true,
        details: false,
        studies: [],
      });
    }
  };
  document.body.appendChild(script);
  return () => {
    const container = document.getElementById("tradingview_btcusdt_chart");
    if (container) container.innerHTML = "";
    const sc = document.getElementById("tradingview-widget-script");
    if (sc) sc.remove();
  };
}, []);


  // When timer ends: poll trade result
  async function pollResult(trade_id, user_id) {
    let tries = 0, trade = null;
    const token = localStorage.getItem("token");
    while (tries < 6 && (!trade || trade.result === "PENDING")) {
      try {
        const his = await axios.get(`${MAIN_API_BASE}/trade/history/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        trade = his.data.find(t => t.id === trade_id);
        if (trade && trade.result !== "PENDING") break;
      } catch {}
      await new Promise(r => setTimeout(r, 1500));
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
      alert("Trade result not ready, please check history!");
    }
  }

  const onTimerComplete = async () => {
  setWaitingResult(true); // show spinner/message
  if (!tradeState) return;
  await pollResult(tradeState.trade_id, tradeState.user_id);
  setTradeState(null);
  setTimerActive(false);
  setWaitingResult(false); // hide spinner/message when result shows
  setTimerKey(Math.random());
  return { shouldRepeat: false, delay: 0 };
};


  // Start new trade (and persist)
  const executeTrade = async () => {
    if (!btcPrice || timerActive) return;
    setTimerActive(true);
    setTradeResult(null);
    setTradeDetail(null);
    let token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to trade.");
      setTimerActive(false);
      return;
    }
    function parseJwt(token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return {};
      }
    }
    const payload = parseJwt(token);
    const user_id = payload.id;
    try {
      const res = await axios.post(
        `${MAIN_API_BASE}/trade`,
        {
          user_id,
          direction: direction.toUpperCase(),
          amount: Number(amount),
          duration: Number(duration)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.data.trade_id) throw new Error("Failed to start trade");
      const { trade_id } = res.data;
      const endAt = Date.now() + duration * 1000;
      const newTradeState = { trade_id, user_id, duration, endAt };
      persistTradeState(newTradeState);
      setTradeState(newTradeState);
      setTimerActive(true);
      setTimerKey(Math.random());
    } catch (err) {
      setTimerActive(false);
      setTradeResult(null);
      setTradeDetail(null);
      persistTradeState(null);
      alert("Trade failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-full min-h-screen bg-theme-n-8 flex flex-col items-center px-2 pt-4 pb-8 overflow-x-hidden"
    >
      <div className="w-full max-w-[1300px] mx-auto flex flex-col lg:flex-row lg:items-start gap-7 lg:gap-10 overflow-x-hidden">
        {/* Chart */}
        <Card
  className="w-full lg:w-[70%] 2xl:w-[75%] p-0 rounded-2xl shadow-lg overflow-hidden mb-5 lg:mb-0 min-h-[420px] 2xl:min-h-[480px] border border-[#23283a]/60"
  style={{ backgroundColor: "#fff" }}
>
  <div id="tradingview_btcusdt_chart" className="w-full" style={{ height: "420px" }} />
</Card>
        {/* Trade box */}
        <Card className="w-full max-w-[410px] mx-auto px-4 py-6 rounded-2xl shadow-lg border border-[#f6e8ff]/80 bg-gradient-to-tr from-[#f0f3ff] to-[#fafffa] flex flex-col lg:w-[360px] 2xl:w-[360px]">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-5">
           <span
  className="font-extrabold text-[1.6rem] md:text-2xl tracking-wide"
  style={{
    background: "linear-gradient(92deg, #00eaff 0%, #1f2fff 60%, #ffd700 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.04em",
    fontFamily: "'Plus Jakarta Sans', 'Inter', Arial, sans-serif",
    lineHeight: 1.15,
    textShadow: "0 2px 18px #1f2fff22"
  }}
>
  BTC/USDT
</span>

            <img src={NovaChainLogo} alt="NovaChain" className="h-9 w-auto ml-4" />
          </div>
          {/* TRADE DIRECTION */}
          <div className="mb-3">
            <span className="font-semibold text-theme-secondary">
              Trade Direction <Tooltip title="Buy = price up. Sell = price down." />
            </span>
            <div className="flex gap-3 mt-2">
              <button
                className={`btn-primary flex-1 h-11 text-base rounded-full shadow ${direction === "BUY" ? "!bg-theme-green !text-white !shadow-lg scale-105" : ""}`}
                disabled={timerActive}
                onClick={() => setDirection("BUY")}
              >
                <Icon name="arrow-up" className="mr-2" /> Buy
              </button>
              <button
                className={`btn-secondary flex-1 h-11 text-base rounded-full shadow ${direction === "SELL" ? "!bg-theme-red !text-white !shadow-lg scale-105" : ""}`}
                disabled={timerActive}
                onClick={() => setDirection("SELL")}
              >
                <Icon name="arrow-down" className="mr-2" /> Sell
              </button>
            </div>
          </div>
          {/* PRICE */}
          <div className="mb-4 flex items-center gap-2 text-theme-tertiary font-semibold text-base">
            <Icon name="dollar-sign" className="w-5 h-5" />
            Current Price:&nbsp;
            {typeof btcPrice === "number" && !isNaN(btcPrice)
              ? <span className="text-theme-primary font-bold text-lg">${btcPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              : fetchError
                ? "API Error"
                : "Loading..."}
          </div>
          {/* AMOUNT */}
          <div className="mb-3">
            <Field
              label="Amount (USDT)"
              type="number"
              min={1}
              value={amount}
              disabled={timerActive}
              onChange={e => setAmount(Number(e.target.value))}
              required
              icon="dollar-sign"
            />
          </div>
         {/* DURATION */}
{/* DURATION (slider and number in one horizontal row) */}
<div className="flex items-center gap-3 mb-5">
  <label className="font-semibold text-theme-tertiary mr-2 whitespace-nowrap">
    Duration (sec)
  </label>
  <input
    type="range"
    min={5}
    max={120}
    step={1}
    value={duration}
    disabled={timerActive}
    onChange={e => setDuration(Number(e.target.value))}
    className="flex-1 accent-theme-primary"
    style={{ minWidth: "120px", maxWidth: "200px" }}
  />
  <span className="ml-2 text-lg font-bold text-theme-primary w-12 text-right">{duration}s</span>
</div>


          {/* INVEST BUTTON */}
          <button
  className={`btn-primary w-full h-12 mt-2 rounded-full font-extrabold text-lg shadow transition-all duration-200
    ${timerActive ? "cursor-not-allowed opacity-80" : "hover:scale-[1.03]"}
  `}
  disabled={timerActive || !btcPrice}
  onClick={executeTrade}
>
  {timerActive ? (
    <span className="flex items-center justify-center gap-2">
      {/* Beautiful animated spinner */}
      <svg className="animate-spin" width="22" height="22" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="20" stroke="#2474ff44" strokeWidth="4"/>
        <path d="M42 22a20 20 0 1 1-40 0" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
      </svg>
      Investing
    </span>
  ) : (
    "Invest"
  )}
</button>

          {/* RESULT / COUNTDOWN */}
          <AnimatePresence>
  {/* Show TIMER BAR first */}
  {timerActive && tradeState && !waitingResult && (
    <motion.div
      key="timer"
      initial={{ opacity: 0, scale: 0.97, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 24 }}
      transition={{ duration: 0.32, type: "spring" }}
      className="flex flex-col items-center mt-7 w-full"
    >
      <TimerBar
        duration={tradeState.duration}
        onComplete={onTimerComplete}
      />
    </motion.div>
  )}

  {/* Show PROCESSING spinner/message after timer */}
  {waitingResult && (
    <motion.div
      key="waiting"
      initial={{ opacity: 0, scale: 0.97, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 24 }}
      transition={{ duration: 0.32, type: "spring" }}
      className="flex flex-col items-center mt-7 w-full"
    >
      <div className="flex flex-col items-center justify-center min-h-[130px]">
        <svg className="animate-spin mb-4" width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="20" stroke="#2474ff44" strokeWidth="4"/>
          <path d="M42 22a20 20 0 1 1-40 0" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <div className="text-lg font-bold text-theme-primary">
          Processing your trade and updating your balance...
        </div>
        <div className="text-theme-tertiary mt-1 text-base font-medium text-center">
          Please wait while your trade settles and funds update in your wallet.
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

          {/* RESULT BOX */}
          <AnimatePresence>
            {tradeDetail && !timerActive && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 32, scale: 0.97 }}
                transition={{ duration: 0.36, type: "spring" }}
              >
                <Card
                  className={`mt-6 px-8 py-7 rounded-2xl shadow-xl border-2 transition-all duration-300
                  flex flex-col items-center justify-center
                  ${tradeDetail.result === "WIN"
                    ? "bg-gradient-to-br from-[#eaffec] to-[#d2ffd9] border-green-400"
                    : "bg-gradient-to-br from-[#fff1f1] to-[#ffe4e4] border-red-400"
                  }`}
                  style={{
                    minWidth: "290px",
                    maxWidth: "370px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2 w-full">
                    {tradeDetail.result === "WIN" ? (
                      <span className="bg-green-500/90 text-white rounded-full px-6 py-2 text-lg font-extrabold shadow text-center">
                        WIN
                      </span>
                    ) : (
                      <span className="bg-red-500/90 text-white rounded-full px-6 py-2 text-lg font-extrabold shadow text-center">
                        LOSS
                      </span>
                    )}
                    <Icon
                      name={tradeDetail.result === "WIN" ? "check" : "close"}
                      className={`w-7 h-7 ${tradeDetail.result === "WIN" ? "text-green-600" : "text-red-600"}`}
                    />
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-neutral-800 text-center">
                    {tradeDetail.result === "WIN"
                      ? `+ $${Math.abs(tradeDetail.profit).toFixed(2)}`
                      : `- $${Math.abs(tradeDetail.profit).toFixed(2)}`}
                  </div>
                  <div className="mt-2 w-full flex flex-col items-center justify-center">
                    <div className="text-base font-medium text-neutral-600 text-center">
                      Entry:&nbsp;
                      <span className="font-bold text-neutral-900">
                        ${!isNaN(Number(tradeDetail.start_price)) ? Number(tradeDetail.start_price).toFixed(2) : "—"}
                      </span>
                    </div>
                    <div className="text-base font-medium text-neutral-600 text-center">
                      Result:&nbsp;
                      <span className="font-bold text-neutral-900">
                        ${!isNaN(Number(tradeDetail.result_price)) ? Number(tradeDetail.result_price).toFixed(2) : "—"}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-neutral-400 font-semibold tracking-wide text-center">
                      Duration: {tradeDetail.duration}s
                    </div>
                    <div className="mt-1 text-xs text-neutral-400 text-center">
                      {tradeDetail.result === "WIN"
                        ? "Profit credited to your wallet"
                        : "Loss deducted from your wallet"}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      <div className="w-full max-w-5xl mt-8">
         <OrderBTC />
         </div>

    </motion.div>
  );
}
