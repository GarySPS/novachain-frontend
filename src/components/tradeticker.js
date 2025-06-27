import React, { useEffect, useState } from "react";

// Fake data
const usernames = ['User123', 'Satoshi21', 'CryptoQueen', 'ElonX', 'Whale9', 'GaryBTC', 'NovaVIP'];
const coins = ['BTC', 'ETH', 'SOL', 'XRP', 'TON'];

export default function TradeTicker() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const generateMessage = () => {
      const user = usernames[Math.floor(Math.random() * usernames.length)];
      const coin = coins[Math.floor(Math.random() * coins.length)];
      const amount = (Math.random() * 1000 + 100).toFixed(2);

      setMessages(prev => [
        { id: Date.now() + Math.random(), user, amount, coin },
        ...prev.slice(0, 5)
      ]);
    };
    generateMessage();
    const interval = setInterval(generateMessage, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-theme-on-surface-2 rounded-xl shadow-md border border-theme-stroke my-2">
      <div className="flex animate-marquee whitespace-nowrap py-3 px-6">
        {messages.map(({ id, user, amount, coin }) => (
          <span key={id} className="flex items-center mx-6 font-medium text-base-2">
            <span className="mr-2">⚡</span>
            <span className="text-theme-yellow font-bold">{user}</span>
            <span className="mx-1">won</span>
            <span className="text-theme-green font-semibold">${amount}</span>
            <span className="mx-1">on</span>
            <span className="text-theme-brand font-bold">{coin}/USDT</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Add to your globals.css or tailwind.css (for animation)
 /*
@layer utilities {
  .animate-marquee {
    animation: marquee 24s linear infinite;
  }
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-50%); }
  }
}
*/
