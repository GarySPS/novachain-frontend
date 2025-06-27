import CurrencyInput from "react-currency-input-field";
import Option from "./option"; // Adjust path if necessary

export default function Buy() {
  return (
    <>
      {/* Amount Input */}
      <CurrencyInput
        className="input-caret-color w-full h-[6.75rem] mb-6 bg-theme-on-surface-2/90 border-2 border-theme-stroke rounded-3xl text-center text-h1 outline-none transition-all shadow focus:border-theme-brand placeholder:text-theme-primary"
        name="price"
        prefix="$"
        placeholder="$0.00"
        decimalsLimit={2}
        decimalSeparator="."
        groupSeparator=","
        onValueChange={(value, name, values) =>
          console.log(value, name, values)
        }
      />

      {/* Buy Options */}
      <div className="space-y-3">
        {/* Coin to Buy */}
        <Option classTitle="2xl:!mr-3" title="Buy" stroke>
          <span className="font-semibold text-theme-primary">
            Ethereum
            <span className="ml-2 text-theme-tertiary font-normal">ETH</span>
          </span>
        </Option>
        {/* Purchase Info */}
        <Option classTitle="2xl:!mr-3" image="/images/crypto-icon-2.png" stroke>
          <div className="text-theme-secondary text-base-2">
            You get <span className="text-theme-primary font-bold">0.014701 ETH</span>
            <br />
            for <span className="text-theme-primary font-bold">US$48.16</span>
          </div>
        </Option>
        {/* Payment Method */}
        <Option classTitle="2xl:!mr-3" title="Pay with" color="bg-theme-green" stroke>
          <span className="font-semibold text-theme-primary">USD Balance</span>
        </Option>
        {/* ETH Balance */}
        <Option classTitle="2xl:!mr-3" title="ETH" color="bg-[#FD8965]" stroke>
          <span className="font-mono text-theme-primary">3.99904874</span>
        </Option>
      </div>

      {/* Buy Button */}
      <button className="btn btn-primary w-full h-14 mt-7 rounded-full shadow-lg text-lg font-bold transition">
        Buy ETH
      </button>
    </>
  );
}
