import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Chart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="w-full h-56 flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#f3f4f6] to-[#f7fafc] border-2 border-dashed border-gray-200">
        <div className="text-gray-400 text-lg font-bold">No data</div>
      </div>
    );
  }
  return (
    <div className="w-full h-56 rounded-xl bg-gradient-to-tr from-[#eef1fd] to-[#f4faff] shadow px-4 py-2 flex flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#36a2ff" stopOpacity={0.6}/>
              <stop offset="90%" stopColor="#a6e3ff" stopOpacity={0.15}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
            width={50}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#22283b",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              boxShadow: "0 2px 12px #22283b20"
            }}
            labelStyle={{ color: "#36a2ff", fontWeight: 700 }}
            itemStyle={{ color: "#fff", fontWeight: 700 }}
            formatter={v => `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#36a2ff"
            fill="url(#chartColor)"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
