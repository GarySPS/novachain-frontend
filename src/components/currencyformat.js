// src/components/currencyformat.js

export default function CurrencyFormat({
  className = "",
  value = 0,
  currency = "$",
  sameColor = false,
  compact = false,  // Optional: show compact form if true (eg. $12.3K)
}) {
  let num = Number(value);
  let displayValue = "";
  let decimals = 2;

  // Compact notation, if desired (optional feature)
  if (compact && Math.abs(num) >= 1000) {
    const suffixes = ["", "K", "M", "B", "T"];
    let i = 0;
    while (Math.abs(num) >= 1000 && i < suffixes.length - 1) {
      num /= 1000;
      i++;
    }
    displayValue = num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + suffixes[i];
    return (
      <span className={`font-mono ${className}`}>
        {currency}
        <span className={sameColor ? "" : "text-theme-tertiary"}>
          {displayValue}
        </span>
      </span>
    );
  }

  // Standard display (eg. $12,345.67)
  const parts = Number(value)
    .toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    .split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] || "00";

  return (
    <span className={`font-mono text-h5 tracking-wide ${className}`}>
      {currency}
      {integerPart}
      <span className={sameColor ? "" : "text-theme-tertiary"}>.
        {decimalPart}
      </span>
    </span>
  );
}
