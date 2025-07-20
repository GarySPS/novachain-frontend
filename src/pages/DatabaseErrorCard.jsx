import { FaTools } from "react-icons/fa";

export default function DatabaseErrorCard() {
  return (
    <div className="flex justify-center items-center min-h-[65vh] bg-transparent animate-fadein">
      <div className="card rounded-2xl px-8 py-10 flex flex-col items-center shadow-2xl border-0"
        style={{
          background: "var(--on-surface-1)",
          color: "var(--primary)",
          border: "2px solid var(--yellow)",
        }}>
        <FaTools className="text-[50px] mb-3 text-yellow animate-spin-slow" />
        <h2 className="text-2xl font-bold mb-2 text-yellow">Service Under Maintenance</h2>
        <p className="text-[16px] text-secondary text-center mb-6">
          Our database is temporarily unavailable.<br />
          Please try again in a few minutes.<br />
          <span className="text-yellow">We appreciate your patience!</span>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 rounded-lg bg-yellow hover:bg-yellow-100 text-white font-semibold shadow"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
