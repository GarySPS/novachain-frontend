import React, { useEffect, useRef, useState } from "react";

export default function TimerBar({ duration, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []); // empty deps: only run once

  const percent = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="w-full max-w-[290px]">
      <div className="mb-2 text-4xl font-extrabold text-theme-primary text-center">
        {timeLeft}s
      </div>
      <div className="relative w-full h-6 bg-theme-n-5 rounded-full overflow-hidden shadow-inner border border-theme-stroke">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFD700] via-[#00ffcc] to-[#2474ff] rounded-full shadow-lg transition-all duration-300"
          style={{
            width: `${percent}%`,
            filter: "blur(0.5px)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-semibold text-theme-primary text-lg" style={{ letterSpacing: "1px" }}>
          Trading...
        </div>
      </div>
    </div>
  );
}
