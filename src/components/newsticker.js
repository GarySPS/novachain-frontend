import React, { useEffect, useRef } from "react";

export default function NewsTicker({ news }) {
  const tickerRef = useRef(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    let animation;
    let start = 0;

    function animate() {
      start -= 1;
      if (Math.abs(start) > ticker.scrollWidth / 2) {
        start = 0;
      }
      ticker.style.transform = `translateX(${start}px)`;
      animation = requestAnimationFrame(animate);
    }
    animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, []);

  // Concatenate news for smooth scroll
  const content = [...news, ...news].join("   |   ");

  return (
    <div className="w-full bg-gradient-to-r from-yellow-400/30 via-yellow-200/20 to-yellow-300/40 py-2 rounded-xl shadow mb-6 overflow-hidden border border-yellow-500/20">
      <div
        ref={tickerRef}
        className="whitespace-nowrap font-semibold text-yellow-200 text-base px-4"
        style={{ willChange: "transform", display: "inline-block" }}
      >
        {content}
      </div>
    </div>
  );
}
