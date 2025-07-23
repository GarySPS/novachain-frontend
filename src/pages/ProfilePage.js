import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MAIN_API_BASE } from '../config';
import Card from "../components/card";
import Field from "../components/field";
import Modal from "../components/modal";
import Tooltip from "../components/tooltip";
import Icon from "../components/icon";
import Chart from "../components/chart";
import AssetsDonut from "../components/assetsdonut";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

// Remove all balance logic from user table, only use assets array from API

function isIOSSafari() {
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isWebkit = /WebKit/.test(ua);
  const isNotChrome = !/CriOS/.test(ua);
  return isIOS && isWebkit && isNotChrome;
}

function isAndroidChrome() {
  const ua = window.navigator.userAgent;
  return /android/i.test(ua) && /chrome/i.test(ua);
}

function bustCache(url) {
  if (!url) return url;
  return url + (url.includes('?') ? '&bust=' : '?bust=') + Date.now();
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [prices, setPrices] = useState({});
  const [totalUsd, setTotalUsd] = useState(0);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState("unverified");
  const [kycSelfie, setKycSelfie] = useState(null);
  const [kycId, setKycId] = useState(null);
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [showEditPic, setShowEditPic] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/logo192_new.png");
  const [avatarFile, setAvatarFile] = useState(null);
  const pw1 = useRef("");
  const pw2 = useRef("");
  const pwCurrent = useRef("");
  const [pwErr, setPwErr] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [kycSelfiePreview, setKycSelfiePreview] = useState(null);
  const [kycIdPreview, setKycIdPreview] = useState(null);
  const [avatarSuccess, setAvatarSuccess] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // For install PWA
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Fetch prices
  useEffect(() => {
    axios.get(`${MAIN_API_BASE}/prices`).then(res => {
      const priceObj = {};
      (res.data.data || []).forEach(c => {
        priceObj[c.symbol] = c.quote.USD.price;
      });
      setPrices(priceObj);
    });
  }, []);

  // Fetch balance history for chart
  useEffect(() => {
    async function fetchBalanceHistory() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${MAIN_API_BASE}/balance/history`, { headers });
        const history = (res.data.history || []).map(row => ({
          time: row.date,
          value: Number(row.total_usd)
        }));
        setBalanceHistory(history);
      } catch {}
    }
    fetchBalanceHistory();
  }, []);

  // Always fetch profile and balances from backend
  useEffect(() => {
    async function fetchProfileAndAssets() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        // User info
        const res = await axios.get(`${MAIN_API_BASE}/profile`, { headers });
        setUser(res.data.user);
        // Balances per coin
        const balRes = await axios.get(`${MAIN_API_BASE}/balance`, { headers });
        setAssets(balRes.data.assets || []);
        // KYC
        const kycRes = await axios.get(`${MAIN_API_BASE}/kyc/status`, { headers });
        setKycStatus((kycRes.data.status || "unverified").toLowerCase());
        setLoading(false);
      } catch (err) {
        navigate("/login", { replace: true });
      }
    }
    fetchProfileAndAssets();
    setAuthChecked(true);
  }, [navigate]);

  // Calculate totalUsd (exactly as wallet page)
  useEffect(() => {
    if (!assets.length || !Object.keys(prices).length) {
      setTotalUsd(0);
      return;
    }
    let sum = 0;
    assets.forEach(({ symbol, balance }) => {
      const coinPrice = prices[symbol] || (symbol === "USDT" ? 1 : 0);
      sum += Number(balance) * coinPrice;
    });
    setTotalUsd(sum);
  }, [assets, prices]);

  useEffect(() => {
    if (!user || !user.avatar) {
      setAvatarUrl("/logo192_new.png");
      return;
    }
    setAvatarUrl(user.avatar);
  }, [user]);

  useEffect(() => {
    if (!authChecked) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [authChecked, navigate]);

  // KYC polling (optional)
  useEffect(() => {
    if (kycStatus !== "pending") return;
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${MAIN_API_BASE}/kyc/status`, { headers });
        setKycStatus((res.data.status || "unverified").toLowerCase());
      } catch { }
    }, 10000);
    return () => clearInterval(interval);
  }, [kycStatus]);

  // --- Actions ---
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function handleKycSubmit(e) {
    e.preventDefault();
    if (!kycSelfie || !kycId) return;
    try {
      setKycSubmitted(true);
      const formData = new FormData();
      formData.append("selfie", kycSelfie);
      formData.append("id_card", kycId);
      const token = localStorage.getItem("token");
      await axios.post(`${MAIN_API_BASE}/kyc`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      setKycStatus("pending");
    } catch (err) {
      alert("Failed to submit KYC. Try again.");
    }
    setKycSubmitted(false);
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(file));
  }

  async function saveAvatar() {
    if (!avatarFile || !user?.id) return;
    setAvatarSuccess("");
    setAvatarError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      await axios.post(
        `${MAIN_API_BASE}/profile/avatar`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      // Fetch profile again
      const updated = await axios.get(`${MAIN_API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(updated.data.user);
      setAvatarFile(null);
      setAvatarSuccess(t('profile_avatar_updated'));
      setTimeout(() => {
        setAvatarSuccess("");
        setShowEditPic(false);
      }, 1700);
    } catch (err) {
      setAvatarError(t('profile_avatar_failed'));
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwErr("");
    setPwSuccess("");
    if (pw1.current.value !== pw2.current.value) {
      setPwErr(t('Password Unmatch'));
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${MAIN_API_BASE}/profile/change-password`, {
        old_password: pwCurrent.current.value,
        new_password: pw1.current.value,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      pwCurrent.current.value = "";
      pw1.current.value = "";
      pw2.current.value = "";
      setPwSuccess(t('Successful'));
      setTimeout(() => {
        setPwSuccess("");
        setShowChangePw(false);
      }, 1800);
    } catch (err) {
      setPwErr(t('Failed'));
    }
  }

  if (!authChecked) return null;
  if (loading || !user) {
    return (
      <div className="bg-gradient-to-br from-[#181b25] via-[#191e29] to-[#181b25] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin text-[#ffd700] mb-3" size={48} />
          <span className="text-[#ffd700] text-xl font-semibold tracking-tight">{t('Refreshing Balance')}</span>
        </div>
      </div>
    );
  }

  // --- UI ---
  return (
  <div className="min-h-screen py-10 px-2 flex flex-col items-center" style={{
    background: "rgba(24,29,47,0.86)"
  }}>

      {/* 1. Profile and Balance Top */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Profile Card */}
        <Card className="md:col-span-2 flex flex-col items-center bg-gradient-to-tr from-[#fff9e6] to-[#f1f8ff] border-0 shadow-lg rounded-2xl py-10 px-8">
          <div className="relative flex flex-col items-center">
            <img
  src={
    avatarFile
      ? URL.createObjectURL(avatarFile)
      : bustCache(avatarUrl) || "/logo192_new.png"
  }
  alt="Profile Preview"
              className="rounded-full border-4 border-yellow-400 shadow-xl object-cover bg-white"
              style={{ width: 120, height: 120, objectFit: "cover" }}
              onError={e => {
                e.target.onerror = null;
                e.target.src = "/logo192_new.png";
              }}
            />
            <div className="mt-4 text-xs tracking-wider text-gray-400 font-mono select-none">
              {user.id ? `NC-${String(user.id).padStart(7, "0")}` : "NC-USER"}
            </div>
            <div className="flex items-center gap-2 mt-1 text-2xl md:text-3xl font-bold text-gray-900">
              {user.username}
              {kycStatus === "approved" && (
                <span className="inline-flex items-center">
                  <svg width="30" height="30" viewBox="0 0 26 26" className="ml-1">
                    <circle cx="13" cy="13" r="13" fill="#1877F2" />
                    <path d="M19.25 9.25L11.75 16.75L7.75 12.75" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
            <div className={`inline-flex items-center px-4 py-1.5 mt-2 rounded-xl text-base font-semibold
              ${kycStatus === "Verified" ? "bg-green-100 text-green-600" :
                kycStatus === "Pending" ? "bg-yellow-100 text-yellow-600" :
                  kycStatus === "Rejected" ? "bg-red-100 text-red-600" :
                    "bg-gray-200 text-gray-600"}`}>
              {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
            </div>
            <button
      className="mt-8 px-7 py-3 font-semibold text-base rounded-2xl shadow bg-black text-white hover:bg-gray-800 transition"
      onClick={handleLogout}
      >
      {t('profile_logout')}
      </button>
          </div>
        </Card>
        {/* Balance/Action Card */}
        <Card className="flex flex-col items-center justify-center bg-gradient-to-tr from-[#f0f3ff] to-[#fafffa] border-0 shadow-lg rounded-2xl py-10 px-8">
          <div className="flex flex-col items-center w-full">
            <div className="text-xl text-gray-400 font-bold mb-1 text-center">{t('profile_total_assets')}</div>
            <div className="font-extrabold text-3xl md:text-4xl text-[#222] mb-7 drop-shadow-sm tracking-tight text-center">
              {typeof totalUsd === "number"
                ? `$${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "--"}
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <button
              className="btn-primary w-full text-lg rounded-xl py-3 font-bold"
              onClick={() => navigate(`/wallet?action=deposit&coin=USDT`)}
            >
              <Icon name="wallet" className="mr-2" /> {t('profile_deposit')}
            </button>
            <button
              className="btn-secondary w-full text-lg rounded-xl py-3 font-bold"
              onClick={() => navigate(`/wallet?action=withdraw&coin=BTC`)}
            >
              <Icon name="arrow-up-right" className="mr-2" /> {t('profile_withdraw')}
            </button>
            <button
              className="btn-primary w-full text-lg rounded-xl py-3 font-bold"
              onClick={() => navigate(`/wallet?action=convert`)}
            >
              <Icon name="swap" className="mr-2" /> {t('profile_convert')}
            </button>
          </div>
        </Card>
      </div>
      {/* 2. Chart and Donut (NO CARD/NO HEADER/NO BOX) */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="flex flex-col justify-center items-center py-3">
          <Chart data={balanceHistory} />
        </div>
        <div className="flex flex-row gap-4 items-center py-3 w-full">
          <div className="flex-1 flex justify-center">
            <AssetsDonut assets={assets} prices={prices} />
          </div>
          <div className="flex-1 flex flex-col justify-center items-center pl-4 w-full">
            <div className="text-lg font-bold mb-4 text-[#f8fafc] drop-shadow text-center">{t('profile_assets')}</div>
            <div className="w-full max-w-xs">
              {assets.filter(a => a.balance > 0).map((a, i) => {
                const price = prices[a.symbol] || (a.symbol === "USDT" ? 1 : 0);
                const usd = Number(a.balance) * price;
                const percent = totalUsd ? (usd / totalUsd * 100) : 0;
                return (
                  <div
                    key={a.symbol}
                    className="flex flex-row items-center justify-between py-1 px-2 rounded-lg hover:bg-[#22282f] transition-all group"
                  >
                    <div className="flex flex-row items-center gap-3">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{
                          background: [
                            "#ffd600", // USDT (yellow)
                            "#00e676", // BTC (green)
                            "#2979ff", // ETH (blue)
                            "#ff6f00", // SOL (orange)
                            "#e040fb", // XRP (pink)
                            "#ff1744"  // TON (red)
                          ][i % 6]
                        }}
                      ></span>
                      <span className="w-14 font-semibold text-[16px] text-[#f8fafc] drop-shadow-sm tracking-wide">
                        {a.symbol}
                      </span>
                    </div>
                    <span className="font-bold text-[16px] text-[#ffffffcc] drop-shadow text-right w-14">
                      {percent.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* 3. KYC + Settings */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* KYC */}
        <Card className="relative bg-white/50 backdrop-blur-md border-0 shadow-xl rounded-2xl p-8 flex flex-col items-center transition-all hover:shadow-2xl">
          <div className="flex flex-col items-center mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="shield-check" className="w-7 h-7 text-theme-primary" />
              <span className="text-2xl font-black tracking-tight text-gray-800">{t('Verification')}</span>
            </div>
            <div className="flex items-center mt-2 mb-1">
              <span className={`w-3 h-3 rounded-full mr-2 ${kycStatus === "Verified"
                ? "bg-green-500"
                : kycStatus === "Pending"
                  ? "bg-yellow-400"
                  : kycStatus === "Rejected"
                    ? "bg-red-400"
                    : "bg-gray-400"
                }`}></span>
              <span className="text-lg font-bold capitalize text-gray-600">
        {kycStatus === "approved"
        ? t('KYC Approved')
        : kycStatus === "Pending"
        ? t('Verification Pending')
        : kycStatus === "Rejected"
        ? t('KYC Rejected')
        : t('KYC Unverified')}
        </span>
            </div>
          </div>
          {(kycStatus === "Unverified" || kycStatus === "Rejected") && (
            <form
              className="w-full max-w-lg mx-auto mt-5 mb-3 flex flex-col gap-5"
              onSubmit={handleKycSubmit}
            >
              <div className="flex flex-col md:flex-row gap-5 w-full">
                {/* Selfie Upload */}
                <div className="flex-1">
                  <label className="mb-2 block font-semibold flex items-center gap-2">
                    <Icon name="user" className="w-5 h-5 text-theme-primary" />
                    {t('profile_upload_selfie')}
                    <Tooltip text={t('profile_tooltip_selfie')} />
                  </label>
                  <div className="bg-white/60 border-2 border-dashed border-theme-primary/30 rounded-xl px-3 py-6 flex flex-col items-center justify-center transition hover:border-theme-primary">
                    <input
                      type="file"
                      accept="image/*"
                      id="selfie"
                      className="hidden"
                      disabled={kycStatus === "pending" || kycStatus === "approved"}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setKycSelfie(file);
                          setKycSelfiePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <label htmlFor="selfie" className="cursor-pointer flex flex-col items-center">
                      <Icon name="upload-cloud" className="w-8 h-8 text-theme-primary mb-1" />
                      <span className="text-sm text-theme-primary font-semibold">{t('profile_click_to_upload')}</span>
                    </label>
                    {kycSelfiePreview && (
                      <img
                        src={kycSelfiePreview}
                        alt="Selfie Preview"
                        className="rounded-lg mt-3 border-2 border-green-400 shadow"
                        style={{ maxWidth: 90 }}
                      />
                    )}
                  </div>
                </div>
               
                {/* ID Upload */}
<div className="flex-1">
  <label className="mb-2 block font-semibold flex items-center gap-2">
    <Icon name="id-card" className="w-5 h-5 text-yellow-500" />
    {t('profile_upload_id')}
    <Tooltip text={t('profile_tooltip_id')} />
  </label>
  <div className="bg-white/60 border-2 border-dashed border-yellow-400/30 rounded-xl px-3 py-6 flex flex-col items-center justify-center transition hover:border-yellow-400">
    <input
      type="file"
      accept="image/*"
      id="id-card"
      className="hidden"
      disabled={kycStatus === "pending" || kycStatus === "approved"}
      onChange={e => {
        const file = e.target.files[0];
        if (file) {
          setKycId(file);
          setKycIdPreview(URL.createObjectURL(file));
        }
      }}
    />
    <label htmlFor="id-card" className="cursor-pointer flex flex-col items-center">
      <Icon name="upload-cloud" className="w-8 h-8 text-yellow-500 mb-1" />
      <span className="text-sm text-yellow-500 font-semibold">{t('profile_click_to_upload')}</span>
    </label>
    {kycIdPreview && (
      <img
        src={kycIdPreview}
        alt="ID Preview"
        className="rounded-lg mt-3 border-2 border-yellow-400 shadow"
        style={{ maxWidth: 90 }}
      />
    )}
  </div>
</div>

              </div>
              <div className="flex w-full justify-center">
                <button
                  type="submit"
                  className="btn-primary h-12 px-10 font-bold rounded-xl shadow-lg w-full md:w-72"
                  disabled={!kycSelfie || !kycId || kycStatus === "pending"}
                >
                  {kycStatus === "rejected" ? t('profile_resubmit_kyc') : t('profile_submit_kyc')}
                </button>
              </div>
              {kycSubmitted && (
                <div className="mt-2 text-green-600 font-semibold text-center transition-opacity animate-fade-in">
                  {t('profile_kyc_submitted')}
                </div>
              )}
            </form>
          )}
          <div className="text-sm text-gray-500 mt-2 text-center">
            {kycStatus === "approved"
        ? t('Verified')
        : kycStatus === "pending"
        ? t('Peviewing')
        : kycStatus === "rejected"
        ? t('Rekected')
        : t('Instruction')}
          </div>
        </Card>

        {/* Settings */}
        <Card className="bg-gradient-to-tr from-[#f9f7e6] to-[#f4f8ff] rounded-2xl shadow px-8 py-7 flex flex-col items-center">
  <div className="font-bold text-lg text-gray-700 mb-3 text-center">{t('Settings')}</div>
  <div className="grid grid-cols-2 gap-4 w-full max-w-md">
    <button className="btn-stroke px-4 py-4 rounded-xl font-bold flex flex-col items-center justify-center"
      onClick={() => setShowChangePw(true)}>
      <Icon name="lock" className="mb-1 w-7 h-7" />
      {t('profile_change_password')}
    </button>
    <button className="btn-stroke px-4 py-4 rounded-xl font-bold flex flex-col items-center justify-center"
      onClick={() => setShowEditPic(true)}>
      <Icon name="edit" className="mb-1 w-7 h-7" />
      {t('profile_change_profile')}
    </button>
    <div className="flex flex-col items-center justify-center">
      <Icon name="globe" className="mb-1 w-7 h-7 text-theme-primary" />
      <LanguageSwitcher />
      <span className="text-xs mt-1 text-gray-600">{t('Language')}</span>
    </div>
    {/* Unified Install Button */}
{(isIOSSafari() || (deferredPrompt && isAndroidChrome())) && (
  <button
    className="btn-stroke px-4 py-4 rounded-xl font-bold flex flex-col items-center justify-center"
    onClick={async () => {
      if (isIOSSafari()) {
        // For iOS Safari, open guide page
        navigate('/guide');
      } else if (deferredPrompt && isAndroidChrome()) {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      }
    }}
  >
    <Icon name="download" className="mb-1 w-7 h-7" />
    Install App
  </button>
)}
{!(isIOSSafari() || (deferredPrompt && isAndroidChrome())) && (
  <div className="text-gray-500 text-center text-sm">
    Install is available on iOS and Android.
  </div>
)}

  </div>
</Card>

      </div>
      {/* 4. Referral + Support */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        {/* Referral */}
        <Card className="bg-gradient-to-tr from-[#ecf1fc] to-[#fff5f5] rounded-2xl shadow px-8 py-7 flex flex-col items-center">
  <div className="font-bold text-lg text-gray-700 mb-2 text-center">{t('profile_referral_code')}</div>
  <div className="flex items-center mb-2 justify-center">
    <span className="text-xl font-extrabold text-black mr-3">{user.referral || "NC-INVITE-8437"}</span>
    <button
      className="bg-black text-white font-bold py-1 px-4 rounded-xl hover:bg-gray-800 transition ml-2"
      onClick={() => {
        navigator.clipboard.writeText(user.referral || "NC-INVITE-8437");
        alert(t('profile_copied_clipboard'));
      }}
    >
      <Icon name="copy" className="mr-1" /> {t('profile_copy')}
    </button>
  </div>
  <div className="text-sm text-gray-500 text-center">
    {t('profile_referral_invite')}
  </div>
</Card>
        {/* Support */}
        <Card className="bg-gradient-to-tr from-[#f7eefd] to-[#eafffc] rounded-2xl shadow px-8 py-7 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center">
  <button
    className="w-full max-w-xs h-12 rounded-xl font-bold text-lg bg-[#25D366] text-white border-2 border-[#25D366] hover:bg-white hover:text-[#25D366] transition flex items-center justify-center"
    onClick={() => window.open('https://wa.me/66642822983', '_blank')}
  >
    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 32 32">
      <path d="M16 3C9.383 3 4 8.383 4 15c0 2.485.811 4.782 2.174 6.666L4 29l7.53-2.05C13.273 27.616 14.617 28 16 28c6.617 0 12-5.383 12-13S22.617 3 16 3zm0 23c-1.272 0-2.523-.247-3.683-.732l-.262-.11-4.484 1.22 1.2-4.377-.169-.276C6.723 20.083 6 17.594 6 15 6 9.477 10.477 5 16 5s10 4.477 10 10-4.477 11-10 11zm5.367-7.433c-.246-.123-1.453-.718-1.678-.799-.225-.082-.389-.123-.553.124-.163.246-.633.798-.776.963-.143.163-.286.184-.532.062-.246-.123-1.037-.382-1.977-1.217-.73-.652-1.224-1.457-1.368-1.703-.143-.246-.015-.379.108-.501.112-.111.246-.286.369-.429.123-.143.164-.246.246-.409.082-.163.041-.307-.02-.429-.062-.123-.553-1.337-.758-1.833-.199-.48-.402-.413-.553-.42l-.47-.008a.896.896 0 0 0-.652.307c-.225.245-.86.84-.86 2.047s.88 2.375 1.003 2.539c.123.163 1.73 2.66 4.194 3.625.587.202 1.044.323 1.402.413.59.15 1.129.129 1.555.078.474-.058 1.453-.593 1.659-1.166.205-.573.205-1.065.143-1.167-.062-.102-.225-.163-.47-.286z"/>
    </svg>
    WhatsApp
  </button>
  <button
    className="w-full max-w-xs h-12 rounded-xl font-bold text-lg bg-[#229ED9] text-white border-2 border-[#229ED9] hover:bg-white hover:text-[#229ED9] transition flex items-center justify-center"
    onClick={() => window.open('https://t.me/novachainsingapore', '_blank')}
  >
    Telegram
  </button>
</div>

  <div className="text-sm text-gray-500 text-center mt-3">
    You can contact support via WhatsApp or Telegram, 9-5 office hours.
  </div>
</Card>

      </div>
    
      {/* Modals */}
<Modal visible={showChangePw} onClose={() => setShowChangePw(false)}>
  <h3 className="text-title-2 font-semibold mb-4">{t('profile_change_password')}</h3>
  <form onSubmit={handleChangePassword} className="space-y-3">
    <Field type="password" placeholder={t('profile_current_password')} inputRef={pwCurrent} />
    <Field type="password" placeholder={t('profile_new_password')} inputRef={pw1} />
    <Field type="password" placeholder={t('profile_confirm_new_password')} inputRef={pw2} />
    {pwErr && <div className="text-theme-red mb-2">{pwErr}</div>}
    {pwSuccess && (
      <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg px-4 py-2 text-center mb-2 transition">
        {pwSuccess}
      </div>
    )}
    <div className="flex justify-center gap-4 mt-4">
      <button type="submit" className="btn-primary" disabled={!!pwSuccess}>{t('profile_save')}</button>
      <button type="button" onClick={() => setShowChangePw(false)} className="btn-secondary">{t('profile_cancel')}</button>
    </div>
  </form>
</Modal>

<Modal visible={showEditPic} onClose={() => setShowEditPic(false)}>
  <h3>{t('profile_change_picture')}</h3>
  <div className="flex flex-col items-center gap-4">
    <img
      src={
        avatarFile
          ? URL.createObjectURL(avatarFile)
          : bustCache(avatarUrl) || "/logo192_new.png"
      }
      alt="Profile Preview"
      className="rounded-full border-4 border-yellow-400 shadow-xl object-cover bg-white"
      style={{ width: 120, height: 120, objectFit: "cover" }}
      onError={e => {
        e.target.onerror = null;
        e.target.src = "/logo192_new.png";
      }}
    />
    <input
      type="file"
      accept="image/*"
      className="hidden"
      id="profile-pic-input"
      onChange={handleAvatarChange}
    />
    <label htmlFor="profile-pic-input" className="w-full">
      <span className="btn-primary mt-2 block text-center cursor-pointer">
        {t('profile_choose_new_photo')}
      </span>
    </label>
    {avatarSuccess && (
      <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg px-4 py-2 text-center mb-2 transition">
        {avatarSuccess}
      </div>
    )}
    {avatarError && (
      <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-2 text-center mb-2 transition">
        {avatarError}
      </div>
    )}
    <div className="flex flex-row gap-4 mt-4">
      <button
        className="btn-primary"
        onClick={saveAvatar}
        disabled={!avatarFile}
      >
        {t('profile_save')}
      </button>
      <button
        className="btn-secondary"
        onClick={() => setShowEditPic(false)}
      >
        {t('profile_cancel')}
      </button>
    </div>
  </div>
</Modal>


    </div>
  );
}
