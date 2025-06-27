import React from "react";
import NovaChainLogo from "../components/NovaChainLogo.svg";
import { Link } from "react-router-dom";

const team = [
  {
    name: "Ethan David",
    title: "CEO & Co-Founder",
    img: "/assets/avatar3.png", // Replace with your avatar image
    desc: "10+ years in fintech, passionate about building secure financial platforms."
  },
  {
    name: "Sophia Coppola",
    title: "Chief Technology Officer",
    img: "/assets/avatar2.png",
    desc: "Blockchain specialist, full-stack engineer, and AI advocate."
  },
  {
    name: "Victor Wan",
    title: "Head of Compliance",
    img: "/assets/avatar4.png",
    desc: "RegTech and cybersecurity expert with global experience."
  }
];

const certs = [
  {
    name: "ISO 27001:2022",
    img: "/assets/iso27001.png"
  },
  {
    name: "CyberTrust Award",
    img: "/assets/cybertrust.png"
  },
   {
    name: "KYC Verified",
    img: "/assets/kyc.png"
  },
  {
    name: "Smart Contract Audited",
    img: "/assets/smartcontract.png"
  }
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#151e2e] to-[#090e14] text-white px-4 pt-10 pb-24 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* Hero */}
        <div className="flex items-center gap-4 mb-8">
          <img src={NovaChainLogo} alt="NovaChain Logo" className="h-12 drop-shadow-xl" />
          </div>
        
         <p className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-500 to-teal-400 block my-4">
  Trade the Future, Today.
</p>
<div className="mb-10 text-lg text-gray-300 leading-relaxed">
  Welcome to NovaChain—where next-generation crypto trading meets innovation and security.<br />
  Trade Bitcoin, Win Instantly.<br />
  Experience elite binary BTC/USDT trading on a platform engineered for speed, security, and absolute control.<br />
  <span className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-500 to-teal-400 block my-4">
    Trade Smarter. Win Bigger.
  </span>
  Join the world’s most advanced binary trading arena for everyone.
  
  <div className="my-8"></div> {/* This adds some vertical space */}

  <span className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-500 to-teal-400 block my-4">
    Why NovaChain?
  </span>
  Trade real-time BTC/USDT with instant results, transparent payouts, and powerful trading tools . Our state-of-the-art platform features premium security, 24/7 support. Whether you’re a newcomer or a veteran, NovaChain delivers best-class binary trading experience—where every second counts, and every trade could be your next big win.
</div>
  

        {/* Mission */}
       <div className="my-10 p-6 bg-[#182137]/80 rounded-2xl shadow-md border border-[#1a2d48]">
  <h2 className="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-500 to-teal-400 mb-4">
    Our Mission
  </h2>
  <p className="text-lg text-gray-200 mb-4 font-semibold">
    Empowering a new era of confident, secure, and accessible crypto trading for everyone.
  </p>
  <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
    At NovaChain, our mission is to bridge the gap between opportunity and innovation in digital finance.
    We are committed to delivering a transparent, lightning-fast binary trading platform that puts real market data and professional tools at your fingertips.
    By combining cutting-edge security, intuitive design, and industry-leading support, we strive to make binary BTC/USDT trading safer, more rewarding, and open to all—regardless of experience level or background.
    <br className="hidden md:block" />
    <br className="hidden md:block" />
    Join us as we set a new global standard for excellence and trust in the world of digital trading.
  </p>
</div>

        {/* Company Overview */}
        <div className="my-10">
  <h3 className="text-3xl font-extrabold mb-4 text-teal-300">
  Company Overview
</h3>
  <p className="text-lg text-gray-200 mb-3 font-semibold">
    The leading force in next-generation crypto trading.
  </p>
  <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
   Founded in 2023, NovaChain is the leading crypto innovation company headquartered in Singapore, with a global network of team members and partners.
    Founded by a diverse team of financial experts, blockchain engineers, and security specialists, NovaChain is dedicated to reshaping the way individuals engage with digital assets. Our company combines deep market insight, innovative technology, and a commitment to integrity to deliver a binary trading experience unlike any other.<br className="hidden md:block" /><br className="hidden md:block" />
    NovaChain provides instant, transparent BTC/USDT trading with user-first design and robust security at its core. Our mission is to empower traders—whether seasoned professionals or first-time users—with powerful tools, real-time data, and 24/7 support. NovaChain is not just a platform—it’s your partner in navigating the new era of digital finance.
  </p>
</div>


        {/* Core Values */}
        <div className="my-10">
          <h3 className="text-xl font-semibold mb-3 text-blue-400">Core Values</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gold-300">Integrity</h4>
              <p className="text-gray-400">We believe in honesty, transparency, and always putting our users first.</p>
            </div>
            <div>
              <h4 className="font-bold text-teal-200">Security</h4>
              <p className="text-gray-400">Our platform is built on best-in-class security protocols, including regular third-party audits and ISO-standard compliance.</p>
            </div>
            <div>
              <h4 className="font-bold text-blue-300">Innovation</h4>
              <p className="text-gray-400">NovaChain leads with breakthrough technologies and continuous platform upgrades.</p>
            </div>
            <div>
              <h4 className="font-bold text-yellow-300">User Empowerment</h4>
              <p className="text-gray-400">We provide the tools, education, and support to help every user reach their trading goals.</p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="my-10">
          <h3 className="text-xl font-semibold mb-6 text-gold-400">Leadership & Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.name} className="bg-[#181f2e]/80 p-5 rounded-2xl shadow-lg flex flex-col items-center">
                <img
  src={member.img}
  alt={member.name}
  className="w-32 h-32 rounded-full mb-3 border-4 border-teal-400 shadow"
/>
                <div className="text-lg font-bold">{member.name}</div>
                <div className="text-sm text-blue-300 mb-2">{member.title}</div>
                <p className="text-sm text-gray-400 text-center">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
<div className="my-16">
  <h3
  className="
    text-4xl
    font-extrabold
    text-transparent
    bg-clip-text
    bg-gradient-to-r
    from-yellow-400 via-amber-300 via-80% to-yellow-500
    drop-shadow-[0_2px_6px_rgba(255,215,0,0.25)]
    text-center
    tracking-wider
    mb-10
  "
>
  Certifications &amp; Awards
</h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 justify-items-center max-w-3xl mx-auto">
    {certs.map(cert => (
      <div key={cert.name} className="flex flex-col items-center">
        <img
          src={cert.img}
          alt={cert.name}
          className="h-40 w-40 object-contain mb-2"
        />
        {/* Certificate name: gold color, smaller, not bold */}
        <div className="text-sm text-[#FFD700] font-medium text-center mt-1 tracking-wide drop-shadow-sm">
          {cert.name}
        </div>
      </div>
    ))}
  </div>
  <p className="text-xs text-gray-400 mt-8 text-center max-w-xl mx-auto">
    NovaChain is proudly certified and regularly audited by leading blockchain security organizations.
  </p>
</div>



        {/* Contact */}
        <div className="my-10 p-5 bg-[#151c2e]/80 rounded-xl border border-[#24314a] shadow">
          <h3 className="text-xl font-semibold mb-2 text-teal-300">Headquarters & Contact</h3>
          <div className="mb-2">
            <span className="font-semibold">NovaChain Global Pte. Ltd.</span><br/>
            Marina Bay Financial Centre Tower 2,<br/>
            10 Marina Blvd, Singapore 018983. <br/>
            +65 2936 0430<br/>
            +65 1665 7939
          </div>
          <div>
            Support: <a href="mailto:support@novachain.pro" className="text-blue-400 underline">support@novachain.pro</a>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex gap-6 mt-12 justify-center text-sm text-gray-400">
  <span className="underline opacity-60 cursor-not-allowed select-none">Terms of Service</span>
  <span className="underline opacity-60 cursor-not-allowed select-none">Privacy Policy</span>
  <span className="underline opacity-60 cursor-not-allowed select-none">Support</span>
</div>
      </div>
    </div>
  );
}
