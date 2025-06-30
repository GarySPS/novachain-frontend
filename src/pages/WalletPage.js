import { MAIN_API_BASE, ADMIN_API_BASE } from '../config';
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import Card from "../components/card";
import Field from "../components/field";
import Modal from "../components/modal";
import Icon from "../components/icon";
import { useNavigate } from "react-router-dom";


const coinSymbols = ["USDT", "BTC", "ETH", "SOL", "XRP", "TON"];
const depositNetworks = {
  USDT: "TRC20", BTC: "BTC", ETH: "ERC20", SOL: "SOL", XRP: "XRP", TON: "TON",
};

export default function WalletPage() {
  const navigate = useNavigate()
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState(null);
  const [prices, setPrices] = useState({});
  const [balances, setBalances] = useState([]);
  const [depositHistory, setDepositHistory] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [modal, setModal] = useState({ open: false, type: "", coin: "" });
  const [toast, setToast] = useState("");
  const [selectedDepositCoin, setSelectedDepositCoin] = useState("USDT");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositScreenshot, setDepositScreenshot] = useState(null);
  const fileInputRef = useRef();
  const [selectedWithdrawCoin, setSelectedWithdrawCoin] = useState("USDT");
  const [withdrawForm, setWithdrawForm] = useState({ address: "", amount: "" });
  const [withdrawMsg, setWithdrawMsg] = useState("");
  const [fromCoin, setFromCoin] = useState("USDT");
  const [toCoin, setToCoin] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [walletAddresses, setWalletAddresses] = useState({});
  const [walletQRCodes, setWalletQRCodes] = useState({});
  const [fileLocked, setFileLocked] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

// 1. Parse the token and set userId
useEffect(() => {
  if (token) {
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    } catch {
      setUserId(null);
    }
  } else {
    setUserId(null);
  }
  setAuthChecked(true); // Mark that we have checked authentication
}, [token]);

// 2. Only redirect guests AFTER authChecked is true
useEffect(() => {
  if (!authChecked) return;
  if (!token || token === "undefined" || !userId || userId === "undefined") {
    setIsGuest(true); // Soft guest fallback
  }
}, [authChecked, token, userId]);


  // Use static prices for now
  useEffect(() => {
    setPrices({
      BTC: 107419.98, ETH: 2453.07, SOL: 143.66, XRP: 2.17, TON: 6.34, USDT: 1
    });
  }, []);

  // Fetch deposit addresses & QR PNGs (from main backend, but QR PNG always from admin backend)
  useEffect(() => {
    axios.get(`${MAIN_API_BASE}/deposit-addresses`)
      .then(res => {
        const addresses = {};
        const qrcodes = {};
        res.data.forEach(row => {
          addresses[row.coin] = row.address;
          if (row.qr_url && row.qr_url.startsWith("/uploads")) {
            qrcodes[row.coin] = `${ADMIN_API_BASE}${row.qr_url}`;
          } else if (row.qr_url) {
            qrcodes[row.coin] = row.qr_url;
          } else {
            qrcodes[row.coin] = null;
          }
        });
        setWalletAddresses(addresses);
        setWalletQRCodes(qrcodes);
      })
      .catch(() => {
        setWalletAddresses({});
        setWalletQRCodes({});
      });
  }, []);

  
  useEffect(() => {
    if (!token || !userId) return;
    fetchBalances();
    axios.get(`${MAIN_API_BASE}/deposits`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setDepositHistory(res.data)).catch(() => setDepositHistory([]));
    axios.get(`${MAIN_API_BASE}/withdrawals`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setWithdrawHistory(res.data)).catch(() => setWithdrawHistory([]));
  }, [token, userId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get("action");
    const coin = params.get("coin");
    if (action === "deposit" && coin) {
      setSelectedDepositCoin(coin);
      openModal("deposit", coin);
    }
    if (action === "withdraw" && coin) openModal("withdraw", coin);
    if (action === "convert") {
      const el = document.getElementById("convert-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 1200);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    if (!amount || isNaN(amount)) {
      setResult("");
      return;
    }
    if (fromCoin === toCoin) {
      setResult("");
      return;
    }
    if (!prices[fromCoin] || !prices[toCoin]) {
      setResult("");
      return;
    }
    const usdValue = parseFloat(amount) * prices[fromCoin];
    const receive = usdValue / prices[toCoin];
    setResult(receive.toFixed(toCoin === "BTC" ? 6 : toCoin === "ETH" ? 4 : 3));
  }, [fromCoin, toCoin, amount, prices]);

  // --- CORE FUNCTIONS ---
  function fetchBalances() {
    if (!token || !userId) return;
    axios.get(`${MAIN_API_BASE}/balance`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setBalances(res.data.assets || []))
      .catch(() => setBalances([]));
  }

  const openModal = (type, coin) => setModal({ open: true, type, coin });
  const closeModal = () => setModal({ open: false, type: "", coin: "" });

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setToast("Submitting deposit...");
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("coin", selectedDepositCoin);
      formData.append("amount", depositAmount);
      formData.append("address", walletAddresses[selectedDepositCoin]);
      if (depositScreenshot) formData.append("screenshot", depositScreenshot);

      await axios.post(`${MAIN_API_BASE}/deposit`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setToast("Deposit submitted!");
      setDepositAmount("");
      setDepositScreenshot(null);
      setFileLocked(false);

        setTimeout(() => {
        setToast("");
        closeModal();
      }, 1600);

      axios.get(`${MAIN_API_BASE}/deposits`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setDepositHistory(res.data));
    } catch (err) {
      setToast("Deposit failed!");
      console.error(err);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawMsg("Submitting withdraw...");
    try {
      const res = await axios.post(`${MAIN_API_BASE}/withdraw`, {
        user_id: userId,
        coin: selectedWithdrawCoin,
        amount: withdrawForm.amount,
        address: withdrawForm.address,
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data && res.data.success) {
        setWithdrawMsg("Withdraw request submitted!");
        axios.get(`${MAIN_API_BASE}/withdrawals`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => setWithdrawHistory(res.data));
        fetchBalances();
      } else {
        setWithdrawMsg("Withdraw failed.");
      }
    } catch (err) {
      setWithdrawMsg(err.response?.data?.error || "Withdraw failed!");
      console.error(err);
    }
    setTimeout(() => {
      setWithdrawMsg("");
      setWithdrawForm({ address: "", amount: "" });
      closeModal();
    }, 1500);
  };

  const swap = () => {
    setFromCoin(toCoin);
    setToCoin(fromCoin);
    setAmount("");
    setResult("");
  };

  const handleConvert = async e => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0 || fromCoin === toCoin) return;
    try {
      const res = await axios.post(`${MAIN_API_BASE}/convert`, {
        from_coin: fromCoin,
        to_coin: toCoin,
        amount: parseFloat(amount)
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data && res.data.success) {
        setSuccessMsg(`✅ Converted ${amount} ${fromCoin} ➔ ${Number(res.data.received).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toCoin}`);
        fetchBalances();
      } else {
        setSuccessMsg("❌ Conversion failed.");
      }
    } catch (err) {
      console.error(err);
      setSuccessMsg(err.response?.data?.error || "❌ Conversion failed.");
    }
    setTimeout(() => setSuccessMsg(""), 1800);
    setAmount("");
    setResult("");
  };

  // --- HISTORY LOGIC ---
  const userDepositHistory = depositHistory.filter(d => userId && Number(d.user_id) === Number(userId));
  const userWithdrawHistory = withdrawHistory.filter(w => userId && Number(w.user_id) === Number(userId));
  const allHistory = [
    ...userDepositHistory.map(d => ({ ...d, type: "Deposit" })),
    ...userWithdrawHistory.map(w => ({ ...w, type: "Withdraw" })),
  ].sort((a, b) =>
    new Date(b.created_at || b.date) - new Date(a.created_at || a.date)
  );

  // --- MAIN RENDER ---
if (!authChecked) return null;
if (isGuest) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 text-center">
      <div className="max-w-xl">
        <h2 className="text-3xl font-bold text-theme-primary mb-4">Wallet Access Restricted</h2>
        <p className="text-lg text-theme-tertiary mb-6">
          Please login to view your wallet, balances, and history.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="btn-primary px-6 py-3 rounded-xl text-lg font-bold"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

  
  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen py-10 px-2 flex flex-col items-center" style={{ background: "none" }}>
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">

        {/* -- Total Balance Card -- */}
        <Card
          className="flex flex-col items-center justify-center rounded-3xl shadow-lg border mx-auto w-full max-w-md min-h-[170px] my-5 bg-gradient-to-tr from-[#fff9e6] to-[#f1f8ff] border-[#f6e8ff]/80"
          style={{
            boxShadow: "0 4px 28px 0 #10101013, 0 2px 8px 0 #ffd70038",
            border: "1.5px solid #eee7",
          }}
        >
          <div className="flex flex-col items-center justify-center w-full py-7">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="wallet" className="w-8 h-8 text-theme-yellow drop-shadow" />
              <span className="font-extrabold text-2xl tracking-wide text-theme-primary">Total Balance</span>
            </div>
            <div className="font-extrabold text-5xl text-theme-primary text-center tracking-tight drop-shadow-lg">
              {`$${balances.reduce((acc, { symbol, balance }) =>
                acc + ((prices[symbol] || (symbol === "USDT" ? 1 : 0)) * Number(balance)), 0
              ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <div className="text-theme-tertiary mt-1 text-base font-semibold tracking-wide">USD</div>
          </div>
        </Card>

        {/* -- Assets Table -- */}
        <Card className="flex-[2] rounded-3xl shadow-lg px-7 py-6 overflow-x-auto mb-8 border bg-gradient-to-tr from-[#fff9e6] to-[#f1f8ff] border-[#f6e8ff]/80">
          <div className="font-bold text-lg text-theme-secondary mb-3">My Assets</div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-theme-tertiary border-b border-theme-stroke">
                <th className="py-3 px-2">Coin</th>
                <th className="py-3 px-2">Balance</th>
                <th className="py-3 px-2">Value (USD)</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {balances.map(({ symbol, icon, balance }) => (
                <tr
                  key={symbol}
                  className="border-b border-theme-stroke last:border-0 hover:bg-theme-on-surface-2/80 transition"
                >
                  <td className="py-3 px-2 text-lg font-bold">
                    <div className="flex items-center gap-2">
                      <Icon name={symbol?.toLowerCase() || "coin"} className="w-7 h-7" />
                      <span>{symbol}</span>
                    </div>
                  </td>
                  <td className="font-mono text-theme-green py-3 px-2 text-lg">
                    {Number(balance).toLocaleString(undefined, { minimumFractionDigits: symbol === "BTC" ? 6 : 2 })}
                  </td>
                  <td className="py-3 px-2 text-lg">
                    {(prices[symbol] ? (
                      "$" + (prices[symbol] * Number(balance)).toLocaleString(undefined, { maximumFractionDigits: 2 })
                    ) : "--")}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-3">
                      <button
                        className="btn-primary px-4 py-2 rounded-xl font-bold"
                        onClick={() => {
                          setSelectedDepositCoin(symbol);
                          openModal("deposit", symbol);
                        }}
                      >
                        <Icon name="download" className="mr-1" /> Deposit
                      </button>
                      <button
                        className="btn-secondary px-4 py-2 rounded-xl font-bold"
                        onClick={() => openModal("withdraw", symbol)}
                      >
                        <Icon name="upload" className="mr-1" /> Withdraw
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* -- Convert Section -- */}
      <Card id="convert-section" className="max-w-3xl w-full rounded-3xl shadow-lg px-7 py-8 mb-8 border bg-gradient-to-tr from-[#f9e6ff] to-[#e6f8ff] border-[#e8f6ff]/80">
        <div className="flex items-center gap-3 mb-5 text-theme-primary text-2xl font-bold">
          <Icon name="swap" className="w-8 h-8" /> Convert Crypto
        </div>
        <form onSubmit={handleConvert} className="flex flex-col gap-5">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-theme-tertiary font-medium mb-1 block">From</label>
              <select
                value={fromCoin}
                onChange={e => {
                  setFromCoin(e.target.value);
                  // Set To coin auto
                  if (e.target.value === "USDT") setToCoin("BTC");
                  else setToCoin("USDT");
                }}
                className="w-full px-3 py-3 rounded-xl bg-theme-on-surface-2 text-theme-primary border border-theme-stroke text-lg"
              >
                {coinSymbols.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={swap}
              className="btn-secondary h-14 mt-6 rounded-xl"
            >
              <Icon name="swap" />
            </button>
            <div className="flex-1">
              <label className="text-theme-tertiary font-medium mb-1 block">To</label>
              <select
                value={toCoin}
                onChange={e => setToCoin(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-theme-on-surface-2 text-theme-primary border border-theme-stroke text-lg"
              >
                {fromCoin === "USDT"
                  ? coinSymbols.filter(c => c !== "USDT").map(c =>
                      <option key={c} value={c}>{c}</option>
                    )
                  : <option value="USDT">USDT</option>
                }
              </select>
            </div>
          </div>
          <Field
            label={`Amount (${fromCoin})`}
            type="number"
            min={0}
            step="any"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder={`Enter ${fromCoin} amount`}
            icon="dollar-sign"
          />
          <div className="mb-1 text-theme-tertiary text-lg">
            You will receive: <span className="text-theme-primary font-semibold">{result ? `${result} ${toCoin}` : "--"}</span>
          </div>
          <button
            type="submit"
            className="btn-primary w-full h-14 rounded-xl text-xl font-bold"
            disabled={!amount || isNaN(amount) || fromCoin === toCoin || parseFloat(amount) <= 0}
          >
            Convert
          </button>
          {successMsg && <div className="mt-2 bg-theme-green-100 text-theme-green rounded-lg px-4 py-3 text-center text-lg">{successMsg}</div>}
        </form>
      </Card>

      {/* -- MODAL: DEPOSIT -- */}
      <Modal visible={modal.open && modal.type === "deposit"} onClose={closeModal}>
        <form onSubmit={handleDepositSubmit} className="space-y-5 p-2">
          <div className="text-2xl font-bold mb-3 flex items-center gap-2 text-theme-primary">
            <Icon name="download" className="w-7 h-7" /> Deposit
          </div>
          <select
            className="w-full px-3 py-3 rounded-xl bg-theme-on-surface-2 text-theme-primary border border-theme-stroke text-lg"
            value={selectedDepositCoin}
            onChange={e => setSelectedDepositCoin(e.target.value)}
          >
            {coinSymbols.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <div className="flex flex-col items-center justify-center">
  <div
    className="relative w-full max-w-[140px] aspect-square mb-3"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: "12px",
      border: "1.5px solid #ddd",
      background: "#fff",
    }}
  >
    {walletQRCodes[selectedDepositCoin] ? (
      <img
        src={
          walletQRCodes[selectedDepositCoin].startsWith("/uploads")
            ? `${ADMIN_API_BASE}${walletQRCodes[selectedDepositCoin]}`
            : walletQRCodes[selectedDepositCoin]
        }
        alt="Deposit QR"
        className="max-w-full max-h-full object-contain p-1"
        style={{ display: "block" }}
        onError={(e) => {
          e.target.style.display = "none";
          const fallback = e.target.nextSibling;
          if (fallback) fallback.style.display = "block";
        }}
      />
    ) : null}
    <div
      style={{
        display: walletQRCodes[selectedDepositCoin] ? "none" : "block",
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        padding: "8px",
      }}
    >
      <QRCodeCanvas
        value={walletAddresses[selectedDepositCoin] || ""}
        size={120}
        bgColor="#ffffff"
        fgColor="#000000"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  </div>
</div>

          <span className="text-theme-tertiary font-medium text-lg">
            Network: {depositNetworks[selectedDepositCoin]}
          </span>
          <div className="flex items-center gap-2 mt-2 w-full">
            <div className="flex-1 min-w-0">
              <span
                className="font-mono bg-theme-on-surface-2 px-2 py-1 rounded block overflow-x-auto whitespace-nowrap text-base"
                style={{ maxWidth: "290px" }}
              >
                {walletAddresses[selectedDepositCoin]}
              </span>
            </div>
            <button
              type="button"
              className="btn-secondary px-3 py-1 rounded-xl"
              onClick={() => {
                navigator.clipboard.writeText(walletAddresses[selectedDepositCoin]);
                setToast("Copied!");
              }}
            ><Icon name="copy" className="mr-1" />Copy</button>
          </div>
          <Field
            label={`Deposit Amount (${selectedDepositCoin})`}
            type="number"
            min={0}
            step="any"
            value={depositAmount}
            onChange={e => setDepositAmount(e.target.value)}
            required
            icon="dollar-sign"
          />
          <div className="w-full">
  <label className="block text-theme-tertiary font-medium mb-1">
    Upload Screenshot
  </label>
  <div className="relative">
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={e => {
        setDepositScreenshot(e.target.files[0]);
        setFileLocked(true);
      }}
      required
      className="absolute inset-0 opacity-0 z-50 cursor-pointer"
      disabled={fileLocked}
    />
    <div className={`truncate w-full text-sm text-white font-semibold text-center px-4 py-2 rounded-full ${
      fileLocked ? "bg-gray-500 cursor-not-allowed" : "bg-theme-primary hover:bg-theme-primary/90 cursor-pointer"
    }`}>
      {fileLocked ? "Screenshot Uploaded" : "Choose File"}
    </div>
  </div>
</div>


          <div className="text-caption-1 text-theme-tertiary bg-theme-on-surface-2 rounded px-3 py-2">
            For your safety, please submit your deposit screenshot.
            <span className="block text-theme-yellow">
              This proof ensures fast support or refund if anything goes wrong.
            </span>
          </div>
          <button type="submit" className="btn-primary w-full h-14 rounded-xl font-bold text-lg">
            Submit
          </button>
        </form>
      </Modal>

      {/* -- MODAL: WITHDRAW -- */}
      <Modal visible={modal.open && modal.type === "withdraw"} onClose={closeModal}>
        <form onSubmit={handleWithdraw} className="space-y-5 p-2">
          <div className="text-2xl font-bold mb-3 flex items-center gap-2 text-theme-primary">
            <Icon name="upload" className="w-7 h-7" /> Withdraw
          </div>
          <select
            className="w-full px-3 py-3 rounded-xl bg-theme-on-surface-2 text-theme-primary border border-theme-stroke text-lg"
            value={selectedWithdrawCoin}
            onChange={e => setSelectedWithdrawCoin(e.target.value)}
          >
            {coinSymbols.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="text-theme-tertiary font-medium text-lg">
            Network: {depositNetworks[selectedWithdrawCoin]}
          </span>
          <Field
            label="Withdraw To Address"
            type="text"
            required
            placeholder={`Paste recipient address (${selectedWithdrawCoin})`}
            value={withdrawForm.address}
            onChange={e => setWithdrawForm(f => ({ ...f, address: e.target.value }))}
            icon="send"
          />
          <Field
            label={`Amount (${selectedWithdrawCoin})`}
            type="number"
            min={0.0001}
            step="any"
            required
            placeholder={`Enter amount (${selectedWithdrawCoin})`}
            value={withdrawForm.amount}
            onChange={e => setWithdrawForm(f => ({ ...f, amount: e.target.value }))}
            icon="dollar-sign"
          />
          <div className="text-caption-1 text-theme-yellow bg-theme-on-surface-2 rounded px-3 py-2">
            Double-check network and address! Withdrawals processed by admin. Demo only.
          </div>
          <button
            type="submit"
            className="btn-primary w-full h-14 rounded-xl font-bold text-lg"
          >
            Submit Withdraw
          </button>
          {withdrawMsg && <div className="mt-2 bg-theme-green-100 text-theme-green rounded-lg px-4 py-2 text-center text-lg">{withdrawMsg}</div>}
        </form>
      </Modal>

      {/* -- TOAST -- */}
      {toast && (
        <div
          className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] bg-theme-primary text-theme-n-8 px-6 py-3 rounded-full shadow text-lg font-bold animate-pulse select-none pointer-events-none"
          style={{ userSelect: 'none' }}
        >
          {toast}
        </div>
      )}

      {/* -- HISTORY TABLE -- */}
      <Card className="max-w-3xl w-full rounded-3xl shadow-lg px-7 py-6 mb-10 border bg-gradient-to-tr from-[#fff9e6] to-[#f1f8ff] border-[#f6e8ff]/80">
        <div className="flex items-center gap-2 mb-3 text-theme-primary text-2xl font-bold">
          <Icon name="clock" className="w-7 h-7" /> Deposit & Withdraw History
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-lg">
            <thead>
              <tr className="text-left text-theme-tertiary border-b border-theme-stroke">
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Coin</th>
                <th className="py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(allHistory) ? allHistory : []).map((row, idx) => (
                <tr
                  key={
                    row.type === "Deposit"
                      ? `deposit-${row.id || idx}`
                      : row.type === "Withdraw"
                        ? `withdraw-${row.id || idx}`
                        : idx
                  }
                  className="border-b border-theme-stroke last:border-0 hover:bg-theme-on-surface-2 transition"
                >
                  <td className="py-3 px-2 text-lg font-bold">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full shadow 
                      ${row.type === "Deposit" ? "bg-theme-green/20 text-theme-green" : "bg-theme-yellow/20 text-theme-yellow"}`}>
                      <Icon name={row.type === "Deposit" ? "download" : "upload"} className="w-4 h-4" />
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-lg font-mono">
                    {row.amount}
                  </td>
                  <td className="py-3 px-2 text-lg font-bold">
                    <Icon name={row.coin?.toLowerCase() || "coin"} className="w-5 h-5 mr-1" />
                    {row.coin}
                  </td>
                  <td className="py-3 px-2 text-lg">
                    {row.created_at
                      ? new Date(row.created_at).toLocaleString()
                      : (row.date || "--")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
