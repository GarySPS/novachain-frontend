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

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState("unverified");
  const [kycSelfie, setKycSelfie] = useState(null);
  const [kycId, setKycId] = useState(null);
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [showEditPic, setShowEditPic] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const pw1 = useRef("");
  const pw2 = useRef("");
  const [pwErr, setPwErr] = useState("");
  const fileInputRef = useRef();
  const [prices, setPrices] = useState({});
  const [totalUsd, setTotalUsd] = useState(null);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const pwCurrent = useRef("");
  const [pwSuccess, setPwSuccess] = useState("");


  // Fetch balance history for the chart
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

  useEffect(() => {
    axios.get(`${MAIN_API_BASE}/prices`).then(res => {
      const priceObj = {};
      (res.data.data || []).forEach(c => {
        priceObj[c.symbol] = c.quote.USD.price;
      });
      setPrices(priceObj);
    });
  }, []);

  useEffect(() => {
    if (!assets.length || !Object.keys(prices).length) return;
    let sum = 0;
    assets.forEach(({ symbol, balance }) => {
      const coinPrice = prices[symbol] || (symbol === "USDT" ? 1 : 0);
      sum += Number(balance) * coinPrice;
    });
    setTotalUsd(sum);
  }, [assets, prices]);

  useEffect(() => {
    setAuthChecked(true);
  }, []);

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

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${MAIN_API_BASE}/profile`, { headers });
        setUser(res.data.user);
        setAvatarUrl(
          res.data.user.avatar && res.data.user.avatar.startsWith("/uploads/")
            ? res.data.user.avatar
            : "/logo192.png"
        );
        const balRes = await axios.get(`${MAIN_API_BASE}/balance`, { headers });
        setBalance(balRes.data.total_usd);
        setAssets(balRes.data.assets);
        const kycRes = await axios.get(`${MAIN_API_BASE}/kyc/status`, { headers });
        setKycStatus((kycRes.data.status || "unverified").toLowerCase());
        setLoading(false);
      } catch (err) {
        navigate("/login", { replace: true });
      }
    }
    fetchProfile();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function handleKycSubmit(e) {
    e.preventDefault();
    if (!kycSelfie || !kycId) return;
    try {
      setKycSubmitted(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("selfie", kycSelfie);
      formData.append("id_card", kycId);
      await axios.post(`${MAIN_API_BASE}/kyc`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
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
    if (!avatarFile) return;
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const response = await axios.post(`${MAIN_API_BASE}/profile/avatar`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.avatar) {
        const updated = await axios.get(`${MAIN_API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(updated.data.user);
        setAvatarUrl(updated.data.user.avatar || "/logo192_new.png");
      }
      setShowEditPic(false);
    } catch {
      alert("Failed to update avatar.");
    }
  }

  async function handleChangePassword(e) {
  e.preventDefault();
  setPwErr("");
  setPwSuccess("");

  // ADD THIS CHECK:
  if (pw1.current.value !== pw2.current.value) {
    setPwErr("New passwords do not match.");
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
    setPwSuccess("Password changed successfully!");
    setTimeout(() => {
      setPwSuccess("");
      setShowChangePw(false);
    }, 1800);
  } catch (err) {
    setPwErr("Failed to change password. Make sure your current password is correct.");
  }
}

  // ----------------------------------------------------------------------

  useEffect(() => {
    if (!authChecked) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [authChecked, navigate]);

  if (!authChecked) return null;

  if (loading || !user) {
    return (
      <div className="bg-gradient-to-br from-[#181b25] via-[#191e29] to-[#181b25] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin text-[#ffd700] mb-3" size={48} />
          <span className="text-[#ffd700] text-xl font-semibold tracking-tight">Refreshing Balance</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-2 flex flex-col items-center" style={{
      background: "linear-gradient(120deg, #181D2F 0%, #181A20 100%)"
    }}>

      {/* 1. Profile and Balance Top */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Profile Card */}
        <Card className="md:col-span-2 flex flex-col items-center bg-gradient-to-tr from-[#fff9e6] to-[#f1f8ff] border-0 shadow-lg rounded-2xl py-10 px-8">
          <div className="relative flex flex-col items-center">
            <img
              src={user.avatar ? `${MAIN_API_BASE}${user.avatar}` : "/logo192_new.png"}
              alt="Profile"
              className="rounded-full border-4 border-yellow-400 shadow-2xl object-cover bg-white"
              style={{ width: 130, height: 130, objectFit: "cover", backgroundColor: "#fff", boxShadow: "0 2px 20px #ffd70044" }}
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
              ${kycStatus === "approved" ? "bg-green-100 text-green-600" :
                kycStatus === "pending" ? "bg-yellow-100 text-yellow-600" :
                  kycStatus === "rejected" ? "bg-red-100 text-red-600" :
                    "bg-gray-200 text-gray-600"}`}>
              {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
            </div>
            <button
              className="mt-8 px-7 py-3 font-semibold text-base rounded-2xl shadow bg-black text-white hover:bg-gray-800 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </Card>
        {/* Balance/Action Card */}
        <Card className="flex flex-col items-center justify-center bg-gradient-to-tr from-[#f0f3ff] to-[#fafffa] border-0 shadow-lg rounded-2xl py-10 px-8">
          <div className="flex flex-col items-center w-full">
            <div className="text-xl text-gray-400 font-bold mb-1 text-center">Total Assets</div>
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
              <Icon name="wallet" className="mr-2" /> Deposit
            </button>
            <button
              className="btn-secondary w-full text-lg rounded-xl py-3 font-bold"
              onClick={() => navigate(`/wallet?action=withdraw&coin=BTC`)}
            >
              <Icon name="arrow-up-right" className="mr-2" /> Withdraw
            </button>
            <button
              className="btn-primary w-full text-lg rounded-xl py-3 font-bold"
              onClick={() => navigate(`/wallet?action=convert`)}
            >
              <Icon name="swap" className="mr-2" /> Convert
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
            <div className="text-lg font-bold mb-4 text-[#f8fafc] drop-shadow text-center">Assets</div>
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
              <span className="text-2xl font-black tracking-tight text-gray-800">KYC Verification</span>
            </div>
            <div className="flex items-center mt-2 mb-1">
              <span className={`w-3 h-3 rounded-full mr-2 ${kycStatus === "approved"
                ? "bg-green-500"
                : kycStatus === "pending"
                  ? "bg-yellow-400"
                  : kycStatus === "rejected"
                    ? "bg-red-400"
                    : "bg-gray-400"
                }`}></span>
              <span className="text-lg font-bold capitalize text-gray-600">
                {kycStatus === "approved"
                  ? "KYC Approved"
                  : kycStatus === "pending"
                    ? "KYC Pending"
                    : kycStatus === "rejected"
                      ? "Rejected"
                      : "Unverified"}
              </span>
            </div>
          </div>
          {(kycStatus === "unverified" || kycStatus === "rejected") && (
            <form
              className="w-full max-w-lg mx-auto mt-5 mb-3 flex flex-col gap-5"
              onSubmit={handleKycSubmit}
            >
              <div className="flex flex-col md:flex-row gap-5 w-full">
                {/* Selfie Upload */}
                <div className="flex-1">
                  <label className="mb-2 block font-semibold flex items-center gap-2">
                    <Icon name="user" className="w-5 h-5 text-theme-primary" />
                    Upload Selfie
                    <Tooltip text="Photo showing your face holding your ID" />
                  </label>
                  <div className="bg-white/60 border-2 border-dashed border-theme-primary/30 rounded-xl px-3 py-6 flex flex-col items-center justify-center transition hover:border-theme-primary">
                    <input
                      type="file"
                      accept="image/*"
                      id="selfie"
                      className="hidden"
                      disabled={kycStatus === "pending" || kycStatus === "approved"}
                      onChange={e => { if (e.target.files[0]) setKycSelfie(e.target.files[0]); }}
                    />
                    <label htmlFor="selfie" className="cursor-pointer flex flex-col items-center">
                      <Icon name="upload-cloud" className="w-8 h-8 text-theme-primary mb-1" />
                      <span className="text-sm text-theme-primary font-semibold">Click to upload</span>
                    </label>
                    {kycSelfie && (
                      <img
                        src={URL.createObjectURL(kycSelfie)}
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
                    Upload ID
                    <Tooltip text="Photo of your government-issued ID card" />
                  </label>
                  <div className="bg-white/60 border-2 border-dashed border-yellow-400/30 rounded-xl px-3 py-6 flex flex-col items-center justify-center transition hover:border-yellow-400">
                    <input
                      type="file"
                      accept="image/*"
                      id="id-card"
                      className="hidden"
                      disabled={kycStatus === "pending" || kycStatus === "approved"}
                      onChange={e => { if (e.target.files[0]) setKycId(e.target.files[0]); }}
                    />
                    <label htmlFor="id-card" className="cursor-pointer flex flex-col items-center">
                      <Icon name="upload-cloud" className="w-8 h-8 text-yellow-500 mb-1" />
                      <span className="text-sm text-yellow-500 font-semibold">Click to upload</span>
                    </label>
                    {kycId && (
                      <img
                        src={URL.createObjectURL(kycId)}
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
                  {kycStatus === "rejected" ? "Resubmit KYC" : "Submit KYC"}
                </button>
              </div>
              {kycSubmitted && (
                <div className="mt-2 text-green-600 font-semibold text-center transition-opacity animate-fade-in">
                  KYC submitted!
                </div>
              )}
            </form>
          )}
          <div className="text-sm text-gray-500 mt-2 text-center">
            {kycStatus === "approved"
              ? "You are fully verified."
              : kycStatus === "pending"
                ? "Our team is reviewing your documents."
                : kycStatus === "rejected"
                  ? "Your KYC was rejected. Please upload new documents."
                  : "Upload a clear selfie holding your ID and a photo of your government-issued ID."}
          </div>
        </Card>
        {/* Settings */}
        <Card className="bg-gradient-to-tr from-[#f9f7e6] to-[#f4f8ff] rounded-2xl shadow px-8 py-7 flex flex-col items-center">
          <div className="font-bold text-lg text-gray-700 mb-3 text-center">Settings</div>
          <div className="flex flex-row gap-4 justify-center w-full">
            <button className="btn-stroke px-6 py-3 rounded-xl font-bold" onClick={() => setShowChangePw(true)}>
              <Icon name="lock" className="mr-2" /> Change Password
            </button>
            <button className="btn-stroke px-6 py-3 rounded-xl font-bold" onClick={() => setShowEditPic(true)}>
              <Icon name="edit" className="mr-2" /> Change Profile
            </button>
          </div>
        </Card>
      </div>
      {/* 4. Referral + Support */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        {/* Referral */}
        <Card className="bg-gradient-to-tr from-[#ecf1fc] to-[#fff5f5] rounded-2xl shadow px-8 py-7 flex flex-col items-center">
          <div className="font-bold text-lg text-gray-700 mb-2 text-center">Referral Code</div>
          <div className="flex items-center mb-2 justify-center">
            <span className="text-xl font-extrabold text-black mr-3">{user.referral || "NC-INVITE-8437"}</span>
            <button
              className="bg-black text-white font-bold py-1 px-4 rounded-xl hover:bg-gray-800 transition ml-2"
              onClick={() => {
                navigator.clipboard.writeText(user.referral || "NC-INVITE-8437");
                alert("Copied to clipboard!");
              }}
            >
              <Icon name="copy" className="mr-1" /> Copy
            </button>
          </div>
          <div className="text-sm text-gray-500 text-center">
            Invite your friends and earn rewards!
          </div>
        </Card>
        {/* Support */}
        <Card className="bg-gradient-to-tr from-[#f7eefd] to-[#eafffc] rounded-2xl shadow px-8 py-7 flex flex-col items-center justify-center">
          <button
            className="w-full max-w-xs h-12 rounded-xl font-bold text-lg bg-black text-white border-2 border-black hover:bg-white hover:text-black transition"
            onClick={() => window.open('https://t.me/novachainsingapore', '_blank')}
          >
            <Icon name="support" className="mr-2" /> Contact Support
          </button>
        </Card>
      </div>
      {/* Modals */}
      <Modal visible={showChangePw} onClose={() => setShowChangePw(false)}>
  <h3 className="text-title-2 font-semibold mb-4">Change Password</h3>
  <form onSubmit={handleChangePassword} className="space-y-3">
    <Field type="password" placeholder="Current Password" inputRef={pwCurrent} />
    <Field type="password" placeholder="New Password" inputRef={pw1} />
    <Field type="password" placeholder="Confirm New Password" inputRef={pw2} />
    {pwErr && <div className="text-theme-red mb-2">{pwErr}</div>}
    {pwSuccess && (
      <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg px-4 py-2 text-center mb-2 transition">
        {pwSuccess}
      </div>
    )}
    <div className="flex justify-center gap-4 mt-4">
      <button type="submit" className="btn-primary" disabled={!!pwSuccess}>Save</button>
      <button type="button" onClick={() => setShowChangePw(false)} className="btn-secondary">Cancel</button>
    </div>
  </form>
</Modal>
<Modal visible={showEditPic} onClose={() => setShowEditPic(false)}>
  <h3 className="text-title-2 font-semibold mb-4">Change Profile Picture</h3>
  <div className="flex flex-col items-center gap-4">
    <img
      src={
        avatarFile
          ? URL.createObjectURL(avatarFile)
          : user.avatar
          ? `${MAIN_API_BASE}${user.avatar}`
          : "/logo192_new.png"
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
    Choose New Photo
  </span>
</label>
    <div className="flex flex-row gap-4 mt-4">
      <button
        className="btn-primary"
        onClick={saveAvatar}
        disabled={!avatarFile}
      >
        Save
      </button>
      <button
        className="btn-secondary"
        onClick={() => setShowEditPic(false)}
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>

    </div>
  );
}
