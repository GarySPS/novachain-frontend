import CurrencyInput from "react-currency-input-field";
import Option from "./option"; // Adjust path if necessary
import Icon from "./icon";     // Adjust path if necessary

export default function Sell() {
  return (
    <>
      {/* Amount Input */}
      <CurrencyInput
        className="input-caret-color w-full h-[6.75rem] mb-6 bg-theme-on-surface-2/90 border-2 border-theme-stroke rounded-3xl text-center text-h1 outline-none transition-all shadow focus:border-theme-brand placeholder:text-theme-primary"
        name="price"
        prefix="Ξ"
        placeholder="Ξ0.00"
        decimalsLimit={3}
        decimalSeparator="."
        groupSeparator=","
        onValueChange={(value, name, values) =>
          console.log(value, name, values)
        }
      />

      {/* Sell Options */}
      <div className="space-y-3">
        {/* Coin to Sell */}
        <Option classTitle="2xl:!mr-3" title="Sell" stroke>
          <span className="font-semibold text-theme-primary">
            Ethereum
            <span className="ml-2 text-theme-tertiary font-normal">ETH</span>
          </span>
        </Option>
        {/* Payment Method (USDT) */}
        <Option classTitle="2xl:!mr-3" title="For" color="bg-theme-green" stroke>
          <span className="font-semibold text-theme-primary">USDT</span>
          <button className="btn-square ml-auto rounded-full shadow hover:bg-theme-on-surface-3 transition">
            <Icon name="arrow-down" />
          </button>
        </Option>
        {/* Sale Summary */}
        <Option classTitle="2xl:!mr-3" image="/images/crypto-icon-7.png" stroke>
          <div className="text-theme-secondary text-base-2">
            You get <span className="text-theme-primary font-bold">0.014701 ETH</span>
            <br />
            for <span className="text-theme-primary font-bold">US$48.16</span>
          </div>
        </Option>
        {/* ETH Balance */}
        <Option classTitle="2xl:!mr-3" title="ETH" color="bg-theme-red" stroke>
          <span className="font-mono text-theme-primary">3.99904874</span>
        </Option>
      </div>

      {/* Sell Button */}
      <button className="btn btn-primary w-full h-14 mt-7 rounded-full shadow-lg text-lg font-bold transition">
        Sell ETH
      </button>
    </>
  );
}
