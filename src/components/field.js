import React from "react";
import Icon from "./icon"; // Adjust import path if necessary

export default function Field({
  className = "",
  classInput = "",
  label,
  note,
  icon,
  textarea,
  type,
  success,
  error,
  ...inputProps
}) {
  // Calculate dynamic classes for input/textarea
  const baseInput =
    "w-full bg-theme-on-surface-2/80 border border-theme-stroke rounded-xl font-sans text-base-2 text-theme-primary placeholder:text-theme-tertiary transition-all duration-200 outline-none focus:bg-theme-on-surface-1 focus:border-theme-brand";
  const iconPadding = icon ? "pl-12" : "";
  const feedback =
    success
      ? "!border-green-500 !bg-theme-green-100 !text-green-600 placeholder:!text-green-600"
      : error
      ? "!border-red-500 !bg-theme-red-100 !text-theme-red placeholder:!text-theme-red"
      : "";

  return (
    <div className={className}>
      {label && <div className="mb-2 text-base-2 font-semibold">{label}</div>}
      <div className={`relative ${textarea ? "" : ""}`}>
        {icon && (
          <Icon
            className="absolute top-1/2 left-3 z-2 -translate-y-1/2 fill-theme-secondary pointer-events-none"
            name={icon}
          />
        )}
        {textarea ? (
          <textarea
            className={`h-[8.75rem] px-4 py-3 ${baseInput} resize-none ${classInput} ${iconPadding} ${feedback}`}
            {...inputProps}
          />
        ) : (
          <input
            className={`h-12 px-4 ${baseInput} ${classInput} ${iconPadding} ${feedback}`}
            type={type || "text"}
            {...inputProps}
          />
        )}
      </div>
      {note && (
        <div className="mt-2 text-caption-2m text-theme-tertiary">
          {note}
        </div>
      )}
    </div>
  );
}
