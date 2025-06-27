import React from "react";

const icons = {
  "arrow-bottom": "M13 5a1 1 0 1 0-2 0v11.586l-5.293-5.293a1 1 0 0 0-1.414 1.414l7 7a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0-1.414-1.414L13 16.586V5z",
  "arrow-left": "M10.707 6.707a1 1 0 0 0-1.414-1.414l-6 6a1 1 0 0 0 0 1.414l6 6a1 1 0 0 0 1.414-1.414L6.414 13H20a1 1 0 1 0 0-2H6.414l4.293-4.293z",
  // Add all your icons here, following the same pattern:
  // "arrow-right": "M...", "toggle": "M...", etc.
};

export default function Icon({ className = "", name, size = 24, title }) {
  const path = icons[name];

  if (!path) return null; // If icon name doesn't exist, render nothing

  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor" // Allow Tailwind fill- classes to work
      aria-hidden={title ? undefined : "true"}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <path d={path} />
    </svg>
  );
}
