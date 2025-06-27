import React from "react";
import Icon from "./icon"; // Adjust import path if needed

export default function Percent({ className = "", value }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <Icon
        className={
          value > 0
            ? "fill-theme-green"
            : "fill-theme-red rotate-180"
        }
        name="triangle-up"
      />
      <div className={`ml-1 ${value > 0 ? "text-theme-green" : "text-theme-red"}`}>
        {value > 0 ? value : value.toString().slice(1)}%
      </div>
    </div>
  );
}
