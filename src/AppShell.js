import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TradePage from './pages/TradePage';
import Dashboard from './pages/Dashboard';
import TradeHistory from './pages/TradeHistory';
import ProfilePage from './pages/ProfilePage';
import WalletPage from "./pages/WalletPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import AboutUs from "./pages/AboutUs";
import NavBar from './components/navbar';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NewsPage from "./components/Newspage";
import './i18n';

// --- Device/platform helpers ---
function isIOSSafari() {
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isWebkit = /WebKit/.test(ua);
  const isNotChrome = !/CriOS/.test(ua);
  return isIOS && isWebkit && isNotChrome;
}
function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();
  const hideHeader = ["/login", "/signup", "/verify-otp"].includes(location.pathname);

  const [showIOSModal, setShowIOSModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    setIsAndroid(/android/i.test(navigator.userAgent));
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Only show button if iOS Safari or Android install prompt available
  const showDownloadButton = isIOSSafari() || (isAndroid && deferredPrompt);

  // Show unsupported message on other platforms
  const unsupported =
    !isIOSSafari() &&
    !(isAndroid && deferredPrompt) &&
    !hideHeader;

  // Modal styling (dark mode aware)
  const modalStyles = {
    background: isDarkMode() ? "#191c24" : "white",
    color: isDarkMode() ? "#fff" : "#222",
    padding: 24,
    borderRadius: 16,
    maxWidth: 340,
    width: "90vw",
    textAlign: "center",
    boxShadow: "0 6px 24px 0 rgba(0,0,0,.13)",
    transition: "opacity 0.3s",
    position: "relative"
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "#101726" }}>
      {!hideHeader && <NavBar />}

      {showDownloadButton && (
        <button
          onClick={() => {
            if (isIOSSafari()) {
              setShowIOSModal(true);
            } else if (isAndroid && deferredPrompt) {
              deferredPrompt.prompt();
              // Optionally: deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
            }
          }}
          className="p-2 rounded bg-blue-500 text-white m-4 shadow transition hover:bg-blue-600"
        >
          {t('downloadApp')}
        </button>
      )}

      
      {showIOSModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999,
            animation: "fadein .3s"
          }}
          onClick={() => setShowIOSModal(false)}
        >
          <div
            style={modalStyles}
            onClick={e => e.stopPropagation()}
          >
            {/* OPTIONAL IMAGE: place in /public/ios-share-demo.png */}
            {/* <img
              src="/ios-share-demo.png"
              alt="How to add to home screen on iOS"
              style={{ width: "100%", borderRadius: 8, marginBottom: 16, boxShadow: "0 2px 10px 0 rgba(0,0,0,.08)" }}
            /> */}
            <h2 className="text-lg font-bold mb-2">{t('installOnIOS')}</h2>
            <ol style={{ textAlign: "left", margin: "16px 0", fontSize: 15, lineHeight: "1.6" }}>
              <li>
                {t('step1')} <span role="img" aria-label="Share">🔗</span>
              </li>
              <li>{t('step2')}</li>
              <li>{t('step3')}</li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              style={{
                background: "#2563eb",
                color: "white",
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                marginTop: 10,
                fontWeight: 500,
                fontSize: 15,
                boxShadow: "0 2px 10px 0 rgba(37,99,235,0.08)",
                transition: "background 0.2s"
              }}
              className="hover:bg-blue-600"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trade" element={<TradePage />} />
          <Route path="/trade-history" element={<TradeHistory />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppShell;
