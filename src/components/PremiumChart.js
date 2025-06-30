// src/components/PremiumChart.js
import React, { useRef, useEffect } from "react";
import { createChart } from "lightweight-charts";

export default function PremiumChart() {
  const chartContainerRef = useRef();

  useEffect(() => {
    // NovaChain theme colors
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

    // Sample demo data (replace with real BTC/USDT data)
    candleSeries.setData([
      { time: "2024-06-24", open: 106500, high: 107000, low: 106300, close: 106900 },
      { time: "2024-06-25", open: 106900, high: 107300, low: 106700, close: 107200 },
      { time: "2024-06-26", open: 107200, high: 107800, low: 107000, close: 107500 },
      { time: "2024-06-27", open: 107500, high: 107900, low: 107100, close: 107300 },
      { time: "2024-06-28", open: 107300, high: 107600, low: 106900, close: 107100 },
      // ...load more data
    ]);

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
      {/* Pair label and logo overlay */}
      <div className="absolute top-3 left-5 flex items-center gap-2 z-10">
        <span className="font-bold text-xl text-gradient bg-gradient-to-r from-[#15e3d6] to-[#a4ffef] bg-clip-text text-transparent tracking-wide">
          BTC/USDT
        </span>
        <img src="/novachain-avatar.svg" className="h-6 w-6 opacity-90" alt="Novachain Logo" />
      </div>
      {/* Chart area */}
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
