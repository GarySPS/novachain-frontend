import { FiTool } from "react-icons/fi";

export default function DatabaseErrorCard() {
  return (
    <div className="w-full flex justify-center animate-fadein">
      <div
        className="bg-white border-2 border-[#ffd700] shadow-xl rounded-2xl p-7 max-w-md w-full flex flex-col items-center"
        style={{
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        <FiTool className="text-5xl text-[#00eaff] mb-3 animate-spin-slow" />
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2 text-center">
          Service Under Maintenance
        </h2>
        <p className="text-base text-gray-500 font-medium text-center leading-relaxed mb-2">
          Our platform is being updated to comply with new government terms and policies.<br />
          Please try again shortly.<br />
          Thank you for your understanding!
        </p>
        <div className="text-sm text-gray-400 text-center mt-1">
          <span className="font-semibold text-[#00eaff]">Your privacy and assets remain safe at all times.</span>
        </div>
      </div>
    </div>
  );
}
