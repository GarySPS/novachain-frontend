import React from "react";
import NovaChainLogo from "../components/NovaChainLogo.svg";
import { useTranslation } from "react-i18next";


const team = [
  { name: "Ethan David", titleKey: "team_ceo", img: "/assets/avatar3.png", descKey: "team_ceo_desc" },
  { name: "Sophia Coppola", titleKey: "team_cto", img: "/assets/avatar2.png", descKey: "team_cto_desc" },
  { name: "Victor Wan", titleKey: "team_compliance", img: "/assets/avatar4.png", descKey: "team_compliance_desc" }
];

const certs = [
  { name: "ISO 27001:2022", img: "/assets/iso27001.png" },
  { name: "CyberTrust Award", img: "/assets/cybertrust.png" },
  { name: "KYC Verified", img: "/assets/kyc.png" },
  { name: "Smart Contract Audited", img: "/assets/smartcontract.png" }
];

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen w-full relative flex flex-col items-center"
      style={{
        background: 'url("/novachain.jpg") no-repeat center center fixed',
        backgroundSize: "cover",
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          position: "fixed",
          zIndex: 0,
          inset: 0,
          background: "linear-gradient(120deg, #15192ae0 0%, #181c25bb 70%, #101622cc 100%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div className="w-full max-w-3xl text-white px-4 pt-10 pb-24 mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <img src={NovaChainLogo} alt="NovaChain Logo" className="h-12 drop-shadow-xl" />
          </div>
          <p className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-500 to-teal-400 block my-4">
            {t('about_trade_future_today')}
          </p>
          <div className="mb-10 text-lg text-gray-300 leading-relaxed">
            {t('about_hero')}<br />
            {t('about_hero2')}<br />
            {t('about_hero3')}
            <span className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-500 to-teal-400 block my-4">
              {t('about_trade_smarter')}
            </span>
            {t('about_join_arena')}
            <div className="my-8"></div>
            <span className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-500 to-teal-400 block my-4">
              {t('about_why_title')}
            </span>
            {t('about_why_desc')}
          </div>

          <div className="my-10 p-6 bg-[#182137]/80 rounded-2xl shadow-md border border-[#1a2d48]">
            <h2 className="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-500 to-teal-400 mb-4">
              {t('about_mission')}
            </h2>
            <p className="text-lg text-gray-200 mb-4 font-semibold">
              {t('about_mission_1')}
            </p>
            <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
              {t('about_mission_2')}
            </p>
          </div>

          <div className="my-10">
            <h3 className="text-3xl font-extrabold mb-4 text-teal-300">{t('about_company_overview')}</h3>
            <p className="text-lg text-gray-200 mb-3 font-semibold">{t('about_leading_force')}</p>
            <p className="text-gray-300 text-base leading-relaxed max-w-2xl">{t('about_founded')}</p>
          </div>

          <div className="my-10">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">{t('about_core_values')}</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gold-300">{t('about_integrity')}</h4>
                <p className="text-gray-400">{t('about_integrity_desc')}</p>
              </div>
              <div>
                <h4 className="font-bold text-teal-200">{t('about_security')}</h4>
                <p className="text-gray-400">{t('about_security_desc')}</p>
              </div>
              <div>
                <h4 className="font-bold text-blue-300">{t('about_innovation')}</h4>
                <p className="text-gray-400">{t('about_innovation_desc')}</p>
              </div>
              <div>
                <h4 className="font-bold text-yellow-300">{t('about_empowerment')}</h4>
                <p className="text-gray-400">{t('about_empowerment_desc')}</p>
              </div>
            </div>
          </div>

          <div className="my-10">
            <h3 className="text-xl font-semibold mb-6 text-gold-400">{t('about_team')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map(member => (
                <div key={member.name} className="bg-[#181f2e]/80 p-5 rounded-2xl shadow-lg flex flex-col items-center">
                  <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full mb-3 border-4 border-teal-400 shadow" />
                  <div className="text-lg font-bold">{member.name}</div>
                  <div className="text-sm text-blue-300 mb-2">{t(member.titleKey)}</div>
                  <p className="text-sm text-gray-400 text-center">{t(member.descKey)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="my-16">
            <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 via-80% to-yellow-500 drop-shadow-[0_2px_6px_rgba(255,215,0,0.25)] text-center tracking-wider mb-10">
              {t('about_certifications')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 justify-items-center max-w-3xl mx-auto">
              {certs.map(cert => (
                <div key={cert.name} className="flex flex-col items-center">
                  <img src={cert.img} alt={cert.name} className="h-40 w-40 object-contain mb-2" />
                  <div className="text-sm text-[#FFD700] font-medium text-center mt-1 tracking-wide drop-shadow-sm">
                    {cert.name}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-8 text-center max-w-xl mx-auto">
              {t('about_certified')}
            </p>
          </div>

          <div className="my-10 p-5 bg-[#151c2e]/80 rounded-xl border border-[#24314a] shadow">
            <h3 className="text-xl font-semibold mb-2 text-teal-300">{t('about_headquarters')}</h3>
            <div className="mb-2">
              <span className="font-semibold">{t('about_company')}</span><br/>
              Marina Bay Financial Centre Tower 2,<br/>
              10 Marina Blvd, Singapore 018983. <br/>
              +65 2936 0430<br/>
              +65 1665 7939
            </div>
            <div>
              {t('about_support')}:{" "}
              <a href="https://wa.me/16627053615" className="text-blue-400 underline" target="_blank" rel="noreferrer">
                WhatsApp +1 662 705 3615
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex gap-6 mt-12 justify-center text-sm text-gray-300">
            <a href="/terms" className="underline">Terms &amp; Conditions</a>
            <a href="https://wa.me/16627053615" target="_blank" rel="noreferrer" className="underline">
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
