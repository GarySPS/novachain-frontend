import React, { useState } from "react";

export default function Image({ className = "", ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      className={`inline-block align-top opacity-0 transition-opacity ${loaded ? "opacity-100" : ""} ${className}`}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  );
}
