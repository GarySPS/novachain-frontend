import React, { useEffect, useRef, useState } from "react";

export default function NewsTicker({ news }) {
  const tickerRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const ticker = tickerRef.current;
    let animation;
    let start = 0;

    function animate() {
      if (!paused) {
        start -= 1;
        // For infinite scroll illusion, reset when halfway through
        if (Math.abs(start) > ticker.scrollWidth / 2) {
          start = 0;
        }
        ticker.style.transform = `translateX(${start}px)`;
      }
      animation = requestAnimationFrame(animate);
    }
    animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, [paused, news]);

  // Concatenate news for smooth scroll
  const content = [...news, ...news].join("   |   ");

  return (
    <div
      className="w-full bg-gradient-to-r from-yellow-400/30 via-yellow-200/20 to-yellow-300/40 py-2 pl-5 pr-3 rounded-xl shadow mb-6 overflow-hidden border border-yellow-500/20 flex items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      style={{
        cursor: "pointer",
        minHeight: 44,
      }}
      aria-label="Crypto news ticker"
      role="region"
    >
      <div
        ref={tickerRef}
        className="whitespace-nowrap font-semibold text-yellow-800 text-base md:text-lg"
        style={{ willChange: "transform", display: "inline-block" }}
      >
        {content}
      </div>
    </div>
  );
}
