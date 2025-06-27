import React, { useState } from "react";
import ButtonBack from "./buttonback";
import Icon from "./icon";
import Image from "./image";

// Example asset list; replace or import your real list here
const selectAsset = [
  { id: "1", currency: "Bitcoin", currencyShort: "BTC", logo: "/images/bitcoin.svg" },
  { id: "2", currency: "Ethereum", currencyShort: "ETH", logo: "/images/ethereum.svg" },
  { id: "3", currency: "Tether", currencyShort: "USDT", logo: "/images/usdt.svg" },
  // ...add more as needed
];

export default function SelectAsset({ onBack }) {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState("2");

  return (
    <>
      <ButtonBack title="Select asset" onClick={onBack} />
      <div className="relative mb-4">
        <input
          className="w-full h-14 pl-14 pr-4 bg-transparent border border-theme-stroke text-base-1s text-theme-primary outline-none rounded-xl transition-colors placeholder:text-theme-tertiary focus:border-theme-brand md:text-[1rem]"
          type="text"
          placeholder="Search for asset"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          required
          data-autofocus
        />
        <div className="absolute top-1/2 left-4 flex justify-center items-center w-9 h-9 -translate-y-1/2">
          <Icon className="fill-theme-tertiary" name="search" />
        </div>
      </div>
      <div className="space-y-1">
        {selectAsset
          .filter(asset =>
            asset.currency.toLowerCase().includes(search.toLowerCase()) ||
            asset.currencyShort.toLowerCase().includes(search.toLowerCase())
          )
          .map((asset) => (
            <div
              className={`flex items-center h-16 pl-3 pr-6 rounded-2xl cursor-pointer transition-colors hover:bg-theme-n-8 ${
                asset.id === activeId ? "bg-theme-n-8" : ""
              }`}
              key={asset.id}
              onClick={() => setActiveId(asset.id)}
            >
              <div className="mr-3">
                <Image
                  className="crypto-logo w-8"
                  src={asset.logo}
                  width={32}
                  height={32}
                  alt=""
                />
              </div>
              <div className="grow">
                <div className="text-base-1s">{asset.currency}</div>
                <div className="text-caption-2 font-bold opacity-75 text-theme-secondary dark:opacity-100">
                  {asset.currencyShort}
                </div>
              </div>
              {asset.id === activeId && (
                <Icon
                  className="shrink-0 !w-4 !h-4 ml-6 fill-theme-primary"
                  name="check"
                />
              )}
            </div>
          ))}
      </div>
    </>
  );
}
