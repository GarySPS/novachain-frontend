import React, { useEffect, useState } from "react";
import axios from "axios";
import { MAIN_API_BASE } from "../config";
import Card from "../components/card";
import Tooltip from "../components/tooltip";
import Icon from "../components/icon";

export default function TradeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setHistory([]);
      setLoading(false);
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
    if (!user_id) {
      setHistory([]);
      setLoading(false);
      return;
    }
    axios
      .get(`${MAIN_API_BASE}/trade/history/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch(() => {
        setHistory([]);
        setLoading(false);
      });
  }, []);

  return (
    <div
  className="min-h-screen w-full flex flex-col items-center py-10 px-2"
  style={{
    background: "linear-gradient(120deg, #181D2F 0%, #181A20 100%)"
  }}
>
      <div className="w-full max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <Icon name="activity" className="w-7 h-7 text-theme-yellow" />
          <h1 className="text-2xl font-extrabold text-theme-primary tracking-wide">
            BTC/USDT Trade History
          </h1>
        </div>
        {loading ? (
  <div className="flex flex-col justify-center items-center min-h-[380px] py-12">
    <svg className="animate-spin h-14 w-14 mb-3 text-[#ffd700]" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#ffd700" strokeWidth="4" />
      <path className="opacity-85" fill="#ffd700" d="M4 12a8 8 0 018-8v8z" />
    </svg>
    <span className="text-[#ffd700] font-extrabold text-xl drop-shadow-lg mt-1 tracking-wide">
      Loading History
    </span>
  </div>
) : history.length === 0 ? (
          <Card className="max-w-xl mx-auto py-10 text-center text-lg text-theme-tertiary font-semibold bg-gradient-to-tr from-[#fff9e6] to-[#f1f8ff] rounded-2xl shadow-lg border border-[#f6e8ff]/80">
            No trade history yet.
          </Card>
        ) : (
          <Card className="max-w-5xl mx-auto mb-8 px-0 py-0 rounded-2xl shadow-lg border border-[#f6e8ff]/80 bg-gradient-to-tr from-[#fff9e6] to-[#f1f8ff]">
  <div className="w-full overflow-x-auto">
            <table className="w-full table-auto text-sm md:text-base border-separate border-spacing-y-0.5">
              <thead>
                <tr className="text-theme-tertiary border-b border-theme-stroke text-base font-semibold uppercase bg-theme-n-10/90">
                  <th className="py-4 px-3 rounded-tl-2xl">#</th>
                  <th className="py-4 px-3">Direction</th>
                  <th className="py-4 px-3">Amount</th>
                  <th className="py-4 px-3">Entry</th>
                  <th className="py-4 px-3">
                    Result <Tooltip title="Win: You gained profit. Lose: You lost your trade." />
                  </th>
                  <th className="py-4 px-3">Result Price</th>
                  <th className="py-4 px-3">Profit</th>
                  <th className="py-4 px-3">Duration</th>
                  <th className="py-4 px-3 rounded-tr-2xl">Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((t, idx) => (
                  <tr
                    key={`trade-${t.id || idx}`}
                    className={`transition
                      ${idx % 2 === 0 ? "bg-theme-on-surface-2/50" : "bg-theme-on-surface-2/90"}
                      hover:bg-theme-yellow/10 rounded-xl`}
                    style={{ height: 56 }}
                  >
                    {/* ID */}
                    <td className="py-3 px-3 font-mono text-theme-yellow text-center">{t.id}</td>
                    {/* Direction */}
                    <td className="py-3 px-3 capitalize font-bold text-center trade-history-direction">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full shadow
                        ${t.direction === "BUY"
                          ? "bg-theme-green/10 text-theme-green border border-theme-green/50"
                          : "bg-theme-red/10 text-theme-red border border-theme-red/50"
                        }
                      `}>
                        <Icon name={t.direction === "BUY" ? "arrow-up" : "arrow-down"} className="w-4 h-4" />
                        {t.direction}
                      </span>
                    </td>
                    {/* Amount */}
                    <td className="py-3 px-3 font-mono text-theme-primary text-center">${Number(t.amount).toFixed(2)}</td>
                    {/* Entry */}
                    <td className="py-3 px-3 text-theme-secondary text-center">
                      {(t.start_price !== null && t.start_price !== undefined && !isNaN(Number(t.start_price)))
                        ? `$${Number(t.start_price).toFixed(2)}`
                        : "--"}
                    </td>
                    {/* Result */}
                    <td className="py-3 px-3 font-extrabold text-lg text-center">
                      {t.result === "WIN" ? (
                        <span className="flex items-center gap-1 justify-center px-4 py-1 rounded-full bg-theme-green/20 text-theme-green font-extrabold">
                          <Icon name="check" className="w-5 h-5" /> WIN
                        </span>
                      ) : t.result === "LOSE" ? (
                        <span className="flex items-center gap-1 justify-center px-4 py-1 rounded-full bg-theme-red/20 text-theme-red font-extrabold">
                          <Icon name="close" className="w-5 h-5" /> LOSE
                        </span>
                      ) : (
                        <span className="text-theme-tertiary font-medium">{t.result}</span>
                      )}
                    </td>
                    {/* Result Price */}
                    <td className="py-3 px-3 text-theme-secondary text-center">
                      {(t.result_price !== null && t.result_price !== undefined && !isNaN(Number(t.result_price)))
                        ? `$${Number(t.result_price).toFixed(2)}`
                        : "--"}
                    </td>
                    {/* Profit */}
                    <td className={`py-3 px-3 font-mono text-lg text-center
                      ${t.profit > 0 ? "text-theme-green" : t.profit < 0 ? "text-theme-red" : "text-theme-primary"}`}>
                      {t.profit > 0 ? "+" : ""}
                      ${Number(t.profit).toFixed(2)}
                    </td>
                    {/* Duration */}
                    <td className="py-3 px-3 text-center text-theme-primary">{t.duration}s</td>
                    {/* Time */}
                    <td className="py-3 px-3 font-mono text-center text-theme-tertiary">
                      {t.timestamp
                        ? new Date(t.timestamp).toLocaleString()
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
                </table>
  </div>
</Card>

        )}
      </div>
    </div>
  );
}
