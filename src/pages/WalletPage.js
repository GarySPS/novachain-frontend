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
import { useTranslation } from "react-i18next";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zgnefojwdijycgcqngke.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnbmVmb2p3ZGlqeWNnY3FuZ2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTc3MjcsImV4cCI6MjA2NTczMzcyN30.RWPMuioeBKt_enKio-Z-XIr6-bryh3AEGSxmyc7UW7k";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Upload file to Supabase and return the FLAT filename (not URL)
async function uploadDepositScreenshot(file, userId) {
  if (!file) return null;
  const filePath = `${userId}-${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from('deposit').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  return filePath;
}

// --- Helper to get signed URL from Supabase if needed ---
async function getSignedUrl(path, bucket) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const filename = path.split('/').pop();
  const res = await axios.get(`${MAIN_API_BASE}/upload/${bucket}/signed-url/${filename}`);
  return res.data.url;
}

const coinSymbols = ["USDT", "BTC", "ETH", "SOL", "XRP", "TON"];
const depositNetworks = {
  USDT: "TRC20", BTC: "BTC", ETH: "ERC20", SOL: "SOL", XRP: "XRP", TON: "TON",
};

export default function WalletPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
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
  const [historyScreenshots, setHistoryScreenshots] = useState({});
  const [totalUsd, setTotalUsd] = useState(0);

  // --- HISTORY LOGIC ---
  const userDepositHistory = depositHistory.filter(d => userId && Number(d.user_id) === Number(userId));
  const userWithdrawHistory = withdrawHistory.filter(w => userId && Number(w.user_id) === Number(userId));
  const allHistory = [
    ...userDepositHistory.map(d => ({ ...d, type: "Deposit" })),
    ...userWithdrawHistory.map(w => ({ ...w, type: "Withdraw" })),
  ].sort((a, b) =>
    new Date(b.created_at || b.date) - new Date(a.created_at || a.date)
  );

  useEffect(() => {
  if (!balances.length || !Object.keys(prices).length) {
    setTotalUsd(0);
    return;
  }
  let sum = 0;
  balances.forEach(({ symbol, balance }) => {
    const coinPrice = prices[symbol] || (symbol === "USDT" ? 1 : 0);
    sum += Number(balance) * coinPrice;
  });
  setTotalUsd(sum);
}, [balances, prices]);

  useEffect(() => {
    async function fetchHistoryScreenshots() {
      let shots = {};
      for (let row of allHistory) {
        if (row.screenshot) {
          if (!row.screenshot.includes("/")) {
            shots[row.id] = `https://zgnefojwdijycgcqngke.supabase.co/storage/v1/object/public/deposit/${encodeURIComponent(row.screenshot)}`;
          } else if (row.screenshot.startsWith("/uploads/")) {
            shots[row.id] = `${MAIN_API_BASE}${row.screenshot}`;
          } else if (row.screenshot.startsWith("http")) {
            shots[row.id] = row.screenshot;
          }
        }
      }
      setHistoryScreenshots(shots);
    }
    fetchHistoryScreenshots();
  }, [JSON.stringify(allHistory)]);

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
    setAuthChecked(true);
  }, [token]);

  useEffect(() => {
    if (!authChecked) return;
    if (!token || token === "undefined" || !userId || userId === "undefined") {
      setIsGuest(true);
    }
  }, [authChecked, token, userId]);

  useEffect(() => {
    if (!authChecked) return;
    if (isGuest) {
      navigate("/login", { replace: true });
    }
  }, [authChecked, isGuest, navigate]);

useEffect(() => {
  axios.get(`${MAIN_API_BASE}/prices`).then(res => {
    if (res.data?.prices) {
      setPrices(res.data.prices);
    } else {
      const priceObj = {};
      (res.data.data || []).forEach(c => {
        priceObj[c.symbol] = c.quote?.USD?.price;
      });
      setPrices(priceObj);
    }
  }).catch(() => setPrices({}));
}, []);

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
    setToast(t("submitting_deposit"));
    try {
      let screenshotUrl = null;
      if (depositScreenshot) {
        screenshotUrl = await uploadDepositScreenshot(depositScreenshot, userId);
      }
      await axios.post(`${MAIN_API_BASE}/deposit`, {
        coin: selectedDepositCoin,
        amount: depositAmount,
        address: walletAddresses[selectedDepositCoin],
        screenshot: screenshotUrl,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setToast(t("deposit_submitted"));
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
      setToast(t("deposit_failed"));
      console.error(err);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawMsg(t("submitting_withdraw"));
    try {
      const res = await axios.post(`${MAIN_API_BASE}/withdraw`, {
        user_id: userId,
        coin: selectedWithdrawCoin,
        amount: withdrawForm.amount,
        address: withdrawForm.address,
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data && res.data.success) {
        setWithdrawMsg(t("withdraw_submitted"));
        axios.get(`${MAIN_API_BASE}/withdrawals`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => setWithdrawHistory(res.data));
        fetchBalances();
      } else {
        setWithdrawMsg(t("withdraw_failed"));
      }
    } catch (err) {
      setWithdrawMsg(err.response?.data?.error || t("withdraw_failed"));
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
        setSuccessMsg(t("Convert Successful", {
          amount: amount,
          fromCoin,
          received: Number(res.data.received).toLocaleString(undefined, { maximumFractionDigits: 6 }),
          toCoin,
        }));
        fetchBalances();
      } else {
        setSuccessMsg(t("Convert Failed"));
      }
    } catch (err) {
      setSuccessMsg(err.response?.data?.error || t("convert_failed"));
    }
    setTimeout(() => setSuccessMsg(""), 1800);
    setAmount("");
    setResult("");
  };

  // --- MAIN RENDER ---

  if (!authChecked) return null;
  if (isGuest) return null;

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
              <span className="font-extrabold text-2xl tracking-wide text-theme-primary">{t('total_balance')}</span>
            </div>
            <div className="font-extrabold text-5xl text-theme-primary text-center tracking-tight drop-shadow-lg">
  {`$${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
</div>
            <div className="text-theme-tertiary mt-1 text-base font-semibold tracking-wide">{t('usd')}</div>
          </div>
        </Card>

        {/* -- Assets Table -- */}
        <Card className="flex-[2] rounded-3xl shadow-lg px-7 py-6 overflow-x-auto mb-8 border bg-gradient-to-tr from-[#fff9e6] to-[#f1f8ff] border-[#f6e8ff]/80">
          <div className="font-bold text-lg text-theme-secondary mb-3">{t('my_assets')}</div>
          <table className="w-full table-auto text-base md:text-lg">
            <thead>
              <tr className="text-left text-theme-tertiary border-b border-theme-stroke">
                <th className="py-3 px-2">{t('type')}</th>
                <th className="py-3 px-2">{t('amount')}</th>
                <th className="py-3 px-2">{t('coin')}</th>
                <th className="py-3 px-2">{t('Transfer')}</th>
               </tr>
            </thead>
              <tbody>
  {balances.map(({ symbol, icon, balance }) => (
    <tr
      key={symbol}
      className="border-b border-theme-stroke last:border-0 hover:bg-theme-on-surface-2/80 transition"
    >
      {/* Asset Name */}
      <td className="py-4 px-2">
        <div className="flex items-center gap-2">
          <Icon name={symbol?.toLowerCase() || "coin"} className="w-7 h-7" />
          <span className="font-extrabold text-xl md:text-2xl text-theme-primary">
            {symbol}
          </span>
        </div>
      </td>
      {/* Amount */}
      <td className="py-4 px-2">
        <span className="font-mono text-theme-green text-lg md:text-xl font-bold tracking-wide">
          {Number(balance).toLocaleString(undefined, { minimumFractionDigits: symbol === "BTC" ? 6 : 2 })}
        </span>
      </td>
      {/* USD Value */}
      <td className="py-4 px-2">
        <span className="font-extrabold text-theme-primary text-lg md:text-xl">
          {(prices[symbol] ? (
            "$" + (prices[symbol] * Number(balance)).toLocaleString(undefined, { maximumFractionDigits: 2 })
          ) : "--")}
        </span>
      </td>
      {/* Buttons */}
      <td className="py-4 px-2">
        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <button
            className="btn-primary px-4 py-2 rounded-xl font-bold wallet-btn w-full md:w-auto"
            onClick={() => {
              setSelectedDepositCoin(symbol);
              openModal("deposit", symbol);
            }}
          >
            <Icon name="download" className="mr-1" /> {t('deposit')}
          </button>
          <button
            className="btn-secondary px-4 py-2 rounded-xl font-bold wallet-btn w-full md:w-auto"
            onClick={() => openModal("withdraw", symbol)}
          >
            <Icon name="upload" className="mr-1" /> {t('withdraw')}
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
          <Icon name="swap" className="w-8 h-8" /> {t('convert_crypto')}
        </div>
        <form onSubmit={handleConvert} className="flex flex-col gap-5">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-theme-tertiary font-medium mb-1 block">{t('from')}</label>
              <select
                value={fromCoin}
                onChange={e => {
                  setFromCoin(e.target.value);
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
              <label className="text-theme-tertiary font-medium mb-1 block">{t('to')}</label>
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
            label={t('amount_with_coin', { coin: fromCoin })}
            type="number"
            min={0}
            step="any"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder={t('enter_amount_with_coin', { coin: fromCoin })}
            icon="dollar-sign"
          />
          <div className="mb-1 text-theme-tertiary text-lg">
            {t('you_will_receive')}: <span className="text-theme-primary font-semibold">{result ? `${result} ${toCoin}` : "--"}</span>
          </div>
          <button
            type="submit"
            className="btn-primary w-full h-14 rounded-xl text-xl font-bold"
            disabled={!amount || isNaN(amount) || fromCoin === toCoin || parseFloat(amount) <= 0}
          >
            {t('convert')}
          </button>
          {successMsg && <div className="mt-2 bg-theme-green-100 text-theme-green rounded-lg px-4 py-3 text-center text-lg">{successMsg}</div>}
        </form>
      </Card>

      {/* -- MODAL: DEPOSIT -- */}
      <Modal visible={modal.open && modal.type === "deposit"} onClose={closeModal}>
        <form onSubmit={handleDepositSubmit} className="space-y-5 p-2">
          <div className="text-2xl font-bold mb-3 flex items-center gap-2 text-theme-primary">
            <Icon name="download" className="w-7 h-7" /> {t('deposit')}
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
                  alt={t('deposit_qr')}
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
            {t('network')}: {depositNetworks[selectedDepositCoin]}
          </span>
          <div className="flex items-center gap-1 w-full justify-center">
  <span
    className="font-mono bg-theme-on-surface-2 px-2 py-1 rounded whitespace-nowrap text-base"
    style={{ maxWidth: "230px", overflowX: "auto" }}
  >
    {walletAddresses[selectedDepositCoin]}
  </span>
  <button
    type="button"
    className="btn-secondary px-3 py-1 rounded-xl ml-2"
    style={{ flexShrink: 0 }}
    onClick={() => {
      navigator.clipboard.writeText(walletAddresses[selectedDepositCoin]);
      setToast(t("copied"));
    }}
  >
    <Icon name="copy" className="mr-1" />{t('copy')}
  </button>
</div>

          <Field
            label={t('deposit_amount_with_coin', { coin: selectedDepositCoin })}
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
              {t('upload_screenshot')}
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
                {fileLocked ? t('screenshot_uploaded') : t('choose_file')}
              </div>
            </div>
          </div>
          <div className="text-caption-1 text-theme-tertiary bg-theme-on-surface-2 rounded px-3 py-2">
            {t('for_your_safety_submit_screenshot')}
            <span className="block text-theme-yellow">
              {t('proof_ensures_support')}
            </span>
          </div>
          <button type="submit" className="btn-primary w-full h-14 rounded-xl font-bold text-lg">
            {t('submit')}
          </button>
        </form>
      </Modal>

      {/* -- MODAL: WITHDRAW -- */}
      <Modal visible={modal.open && modal.type === "withdraw"} onClose={closeModal}>
        <form onSubmit={handleWithdraw} className="space-y-5 p-2">
          <div className="text-2xl font-bold mb-3 flex items-center gap-2 text-theme-primary">
            <Icon name="upload" className="w-7 h-7" /> {t('withdraw')}
          </div>
          <select
            className="w-full px-3 py-3 rounded-xl bg-theme-on-surface-2 text-theme-primary border border-theme-stroke text-lg"
            value={selectedWithdrawCoin}
            onChange={e => setSelectedWithdrawCoin(e.target.value)}
          >
            {coinSymbols.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="text-theme-tertiary font-medium text-lg">
            {t('network')}: {depositNetworks[selectedWithdrawCoin]}
          </span>
          <Field
            label={t('withdraw_to_address')}
            type="text"
            required
            placeholder={t('paste_recipient_address', { coin: selectedWithdrawCoin })}
            value={withdrawForm.address}
            onChange={e => setWithdrawForm(f => ({ ...f, address: e.target.value }))}
            icon="send"
          />
          <Field
            label={t('amount_with_coin', { coin: selectedWithdrawCoin })}
            type="number"
            min={0.0001}
            step="any"
            required
            placeholder={t('enter_amount_with_coin', { coin: selectedWithdrawCoin })}
            value={withdrawForm.amount}
            onChange={e => setWithdrawForm(f => ({ ...f, amount: e.target.value }))}
            icon="dollar-sign"
          />
          <div className="text-caption-1 text-theme-yellow bg-theme-on-surface-2 rounded px-3 py-2">
            {t('double_check_withdraw')}
          </div>
          <button
            type="submit"
            className="btn-primary w-full h-14 rounded-xl font-bold text-lg"
          >
            {t('submit_withdraw')}
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
          <Icon name="clock" className="w-7 h-7" /> {t('deposit_withdraw_history')}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-base md:text-lg">
            <thead>
              <tr className="text-left text-theme-tertiary border-b border-theme-stroke">
                <th className="py-3 px-2">{t('type')}</th>
                <th className="py-3 px-2">{t('amount')}</th>
                <th className="py-3 px-2">{t('coin')}</th>
                <th className="py-3 px-2">{t('date')}</th>
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
                      {t(row.type.toLowerCase())}
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
