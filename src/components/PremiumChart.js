// src/components/PremiumChart.js
import React, { useRef, useEffect } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";

const CHART_API = "http://localhost:5000/api/chart/btcusdt"; // Change if deployed!

export default function PremiumChart() {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: 640,
      height: 360,
      layout: {
        background: { type: "solid", color: "#171b24" },
        textColor: "#e9eaf0",
        fontFamily: "'Sora', 'Montserrat', sans-serif",
      },
      grid: {
        vertLines: { color: "#23243a" },
        horzLines: { color: "#23243a" },
      },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: "#33384e" },
      timeScale: { borderColor: "#33384e" },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#00e3b8",
      downColor: "#ff7676",
      borderUpColor: "#11f9c8",
      borderDownColor: "#ff7e5f",
      wickUpColor: "#11f9c8",
      wickDownColor: "#ff7676",
    });

    // Fetch real candle data from backend
    axios.get(CHART_API)
      .then(res => {
        if (res.data && Array.isArray(res.data.candles)) {
          candleSeries.setData(res.data.candles);
        }
      })
      .catch(() => {
        // fallback: show nothing or demo data
        candleSeries.setData([]);
      });

    // Responsive resize
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div className="rounded-2xl shadow-xl bg-gradient-to-br from-[#23243a] via-[#171b24] to-[#11151c] p-3 relative border border-[#23243a]">
      <div className="absolute top-3 left-5 flex items-center gap-2 z-10">
        <span className="font-bold text-xl text-gradient bg-gradient-to-r from-[#15e3d6] to-[#a4ffef] bg-clip-text text-transparent tracking-wide">
          BTC/USDT
        </span>
        <img src="/novachain-avatar.svg" className="h-6 w-6 opacity-90" alt="Novachain Logo" />
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
