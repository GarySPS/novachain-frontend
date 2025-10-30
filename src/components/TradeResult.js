// src/components/TradeResult.js
import React from "react";
import { motion } from "framer-motion";
import Card from "./card";
import Icon from "./icon";

export default function TradeResult({ tradeDetail, t }) {
  if (!tradeDetail) return null;

  const isWin = tradeDetail.result === "WIN";

  return (
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
          ${
            isWin
              ? "bg-gradient-to-br from-[#F0FFF4] to-[#E6FEE9] border-green-300"
              : "bg-gradient-to-br from-[#FFF5F5] to-[#FEEBEB] border-red-300"
          }`}
        style={{ minWidth: "290px", maxWidth: "370px", marginLeft: "auto", marginRight: "auto" }}
      >
        <div className="flex items-center justify-center gap-2 mb-2 w-full">
          {isWin ? (
            <span className="bg-green-500/90 text-white rounded-full px-6 py-2 text-lg font-extrabold shadow text-center">
              {t("win", "WIN")}
            </span>
          ) : (
            <span className="bg-red-500/90 text-white rounded-full px-6 py-2 text-lg font-extrabold shadow text-center">
              {t("loss", "LOSS")}
            </span>
          )}
          <Icon name={isWin ? "check" : "close"} className={`w-7 h-7 ${isWin ? "text-green-600" : "text-red-600"}`} />
        </div>

        <div className="mt-1 text-3xl font-extrabold text-slate-800 text-center">
          {isWin
            ? `+ $${Math.abs(tradeDetail.profit).toFixed(2)}`
            : `- $${Math.abs(tradeDetail.profit).toFixed(2)}`}
        </div>

        <div className="mt-2 w-full flex flex-col items-center justify-center">
          <div className="text-base font-medium text-slate-600 text-center">
            {t("entry", "Entry")}:{" "}
            <span className="font-bold text-slate-900">
              {!isNaN(Number(tradeDetail.start_price))
                ? `$${Number(tradeDetail.start_price).toLocaleString(undefined, { maximumFractionDigits: 6 })}`
                : "—"}
            </span>
          </div>
          <div className="text-base font-medium text-slate-600 text-center">
            {t("result", "Result")}:{" "}
            <span className="font-bold text-slate-900">
              {!isNaN(Number(tradeDetail.result_price))
                ? `$${Number(tradeDetail.result_price).toLocaleString(undefined, { maximumFractionDigits: 6 })}`
                : "—"}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 font-semibold tracking-wide text-center">
            {t("duration")}: {tradeDetail.duration}
            {t("seconds_short", "s")}
          </div>
          <div className="mt-1 text-xs text-slate-500 text-center">
            {isWin
              ? t("profit_credited", "Profit credited to your wallet")
              : t("loss_deducted", "Loss deducted from your wallet")}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}