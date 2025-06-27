import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#ffbe0b", "#0cf574", "#3a86ff", "#f3722c", "#b5179e", "#ff006e"];

export default function AssetsDonut({ assets = [], prices = {} }) {
  if (!assets.length || !Object.keys(prices).length) return null;

  // Compute USD value per coin
  const data = assets.map(a => ({
    name: a.symbol,
    value: Number(a.balance) * (prices[a.symbol] || (a.symbol === "USDT" ? 1 : 0)),
  })).filter(d => d.value > 0);
  const total = data.reduce((a, b) => a + b.value, 0);

  return (
    <div className="w-full h-56 bg-theme-on-surface-2 rounded-xl shadow p-4 flex flex-col items-center justify-center">
      {/* Donut chart only, no header, no legend, no labels */}
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={60}
            dataKey="value"
            nameKey="name"
            label={false}
            stroke="none"
            isAnimationActive={true}
          >
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-theme-secondary font-semibold text-center mt-2">
        Total: <span className="font-bold text-theme-primary">
          ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
