import React, { useState } from "react";
import { Link } from "react-router-dom"; // Adjust if not using Next.js
import Image from "./image"; // Adjust import path
import Icon from "./icon"; // Adjust import path

export default function UpgradeToPro() {
  const [visible, setVisible] = useState(true);

  return visible ? (
    <div className="shrink-0 rounded-2xl overflow-hidden mt-4 bg-theme-on-surface-2 md:hidden">
      <div className="relative">
        <Image
          className="w-full h-32 object-cover opacity-100"
          src="/images/bg-upgrade.jpg"
          width={292}
          height={128}
          alt="Upgrade to Pro"
        />
        <button
          className="group absolute right-2 top-2 w-6 h-6 rounded-full bg-theme-on-surface-1 text-0 transition-colors hover:bg-theme-primary"
          onClick={() => setVisible(false)}
        >
          <Icon
            className="!w-4 !h-4 fill-theme-primary transition-colors group-hover:fill-theme-on-surface-1"
            name="close"
          />
        </button>
      </div>
      <div className="p-6">
        <div className="mb-2 text-h5 2xl:text-title-1s">
          Trade smarter with NovaChain Pro
        </div>
        <div className="-mr-1 text-body-2s text-theme-secondary">
          Automate trades based on user-defined criteria, using advanced algorithms.
        </div>
        <Link className="btn-secondary w-full mt-6" to="/pricing">
          Upgrade to Pro
        </Link>
      </div>
    </div>
  ) : null;
}
