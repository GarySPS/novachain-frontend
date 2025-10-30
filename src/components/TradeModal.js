// src/components/TradeModal.js
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "./icon";

export default function TradeModal({
  isOpen,
  onClose,
  direction,
  duration,
  setDuration,
  amount,
  setAmount,
  profitMap,
  onSubmit,
  t,
}) {
  const handleConfirm = () => {
    onSubmit();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-sm m-4 p-6 rounded-2xl shadow-2xl bg-[#1e293b] text-white border border-slate-700"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-2xl font-bold">
                {direction === "BUY"
                  ? t("buy_long_up", "Buy Long (Up)")
                  : t("sell_short_down", "Sell Short (Down)")}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <Icon name="close" className="w-6 h-6" />
              </button>
            </div>

            {/* Duration / Period */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {t("select_period", "Select Period")}
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { d: 30, p: "+30%" },
                  { d: 60, p: "+50%" },
                  { d: 90, p: "+70%" },
                  { d: 120, p: "+100%" },
                ].map(({ d, p }) => {
                  const active = duration === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`px-2 py-3 rounded-lg text-center transition ${
                        active
                          ? "bg-cyan-500 text-white font-bold shadow-lg"
                          : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                      }`}
                    >
                      <span className="block text-lg font-bold">{d}s</span>
                      <span className="block text-xs text-white/80">{p}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="modal-amount" className="block text-sm font-semibold text-slate-300">
                  {t("amount") + " (USDT)"}
                </label>
                <span className="text-sm font-medium text-green-400">
                  {t("profit", "Profit")}: +${(amount * (profitMap[duration] || 0.3)).toFixed(2)}
                </span>
              </div>

              <div className="relative">
                <input
                  id="modal-amount"
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  className="w-full h-12 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white text-lg font-bold focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="dollar-sign" />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-5 gap-2">
                {[25, 50, 100, 250, 500].map((v) => {
                  const active = amount === v;
                  return (
                    <button
                      key={v}
                      label={`$${v}`}
                      onClick={() => setAmount(v)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                        active ? "bg-slate-900 text-white ring-2 ring-cyan-500" : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                      }`}
                      type="button"
                    >
                      ${v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirm Button */}
            <button
              className="w-full h-12 mt-4 rounded-xl font-extrabold text-lg shadow-lg transition-all bg-green-500 text-white hover:bg-green-600 disabled:bg-slate-600"
              onClick={handleConfirm}
            >
              {t("confirm", "Confirm")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}