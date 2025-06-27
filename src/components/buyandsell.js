import CurrencyInput from "react-currency-input-field";
import Icon from "./icon"; // Adjust path if needed

export default function BuyAndSell({ type, onSelect, onContinue }) {
  return (
    <>
      <div className="space-y-3">
        {/* Amount Input */}
        <CurrencyInput
          className="input-caret-color w-full h-[6.75rem] bg-theme-on-surface-2/90 border-2 border-theme-stroke rounded-3xl text-center text-h2 outline-none transition-all shadow focus:border-theme-brand placeholder:text-theme-primary"
          name="price"
          prefix="$"
          placeholder="$0.00"
          decimalsLimit={2}
          decimalSeparator="."
          groupSeparator=","
          onValueChange={(value, name, values) =>
            console.log(value, name, values)
          }
          data-autofocus
        />

        {/* Select Buy/Sell */}
        <div
          className="flex items-center h-20 px-5 bg-theme-on-surface-2/80 border border-theme-stroke rounded-2xl text-base-2 cursor-pointer shadow transition hover:bg-theme-on-surface-3"
          onClick={onSelect}
        >
          <div className="flex items-center shrink-0 w-24 mr-6 text-theme-secondary md:mr-3">
            <span className={`shrink-0 w-3 h-3 mr-2 rounded ${type === "buy" ? "bg-theme-yellow" : "bg-theme-red"}`}></span>
            {type === "buy" ? "Buy" : "Sell"}
          </div>
          Ethereum <span className="ml-2 text-theme-tertiary">ETH</span>
          <Icon className="ml-auto fill-theme-secondary" name="arrows" />
        </div>

        {/* Purchase Summary */}
        <div className="flex items-center min-h-[4rem] px-5 py-4 bg-theme-on-surface-2/80 border border-theme-stroke rounded-2xl text-base-2 shadow">
          <div className="flex items-center shrink-0 w-24 mr-6 text-theme-secondary md:mr-3">
            <span className="shrink-0 w-3 h-3 mr-2 rounded bg-theme-purple"></span>
            Purchase
          </div>
          <div className="text-theme-secondary">
            You get <span className="text-theme-primary font-bold">0,014701 ETH</span> for{" "}
            <span className="text-theme-primary font-bold">US$48.16</span>
          </div>
        </div>

        {/* Select Payment Method */}
        <div
          className="flex items-center h-20 px-5 bg-theme-on-surface-2/80 border border-theme-stroke rounded-2xl text-base-2 cursor-pointer shadow transition hover:bg-theme-on-surface-3"
          onClick={onSelect}
        >
          <div className="flex items-center shrink-0 w-24 mr-6 text-theme-secondary md:mr-3">
            <span className="shrink-0 w-3 h-3 mr-2 rounded bg-theme-green"></span>
            Pay with
          </div>
          USD Balance
          <Icon className="ml-auto fill-theme-secondary" name="arrows" />
        </div>
      </div>
      {/* Continue Button */}
      <button className="btn btn-primary w-full h-14 mt-6 rounded-full shadow-lg text-lg font-bold transition">
        Continue
      </button>
    </>
  );
}
