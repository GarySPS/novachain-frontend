import React from "react";
import Image from "./image"; // Adjust import if needed
import Icon from "./icon";   // Adjust import if needed

export default function Transaction({ item }) {
  return (
    <div className="flex items-center h-14 px-4 rounded-xl hover:bg-theme-n-8 transition-colors md:px-2 mb-1">
      {/* Avatar/icon */}
      <div className="shrink-0 mr-4 md:mr-3">
        <Image
          className="w-9 h-9 rounded-full opacity-100 object-cover"
          src={item.avatar || `/images/crypto-icon-${item.asset?.toLowerCase() || '1'}.png`}
          width={36}
          height={36}
          alt={item.asset || "asset"}
        />
      </div>
      {/* Main info */}
      <div className="flex flex-col grow min-w-0">
        <div className="font-semibold text-theme-primary truncate">
          {item.asset}
        </div>
        <div className="text-theme-tertiary text-caption-2 truncate">
          {item.time}
        </div>
      </div>
      {/* Amount */}
      <div className="text-right min-w-[70px] text-base-1s font-medium text-theme-green px-3">
        {item.amount}
      </div>
      {/* Status / Action */}
      {item.status && (
        <div
          className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
            item.status === "Pending"
              ? "bg-theme-yellow-100 text-theme-yellow"
              : "bg-theme-green-100 text-theme-green"
          }`}
        >
          {item.status}
        </div>
      )}
      {/* External link or action */}
      <button className="ml-3 p-2 rounded-full bg-theme-brand-100 hover:bg-theme-brand transition-all">
        <Icon
          className="!w-4 !h-4 fill-theme-brand group-hover:rotate-45"
          name="arrow-up-right"
        />
      </button>
    </div>
  );
}
