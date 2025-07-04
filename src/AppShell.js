import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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


function AppShell() {
  const location = useLocation();
  const hideHeader = ["/login", "/signup", "/verify-otp"].includes(location.pathname);

  return (
    <div className="min-h-screen w-full" style={{ background: "#101726" }}>
      {!hideHeader && <NavBar />}
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
        </Routes>
      </main>
    </div>
  );
}

export default AppShell;
