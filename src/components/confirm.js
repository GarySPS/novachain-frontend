// src/components/confirm.js
import Image from "./image";

export default function Confirm({ children, onView }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] py-10 px-4 max-w-md mx-auto bg-theme-on-surface-1/95 border border-theme-stroke rounded-3xl shadow-depth-1 backdrop-blur-lg">
      <div className="mb-8">
        <Image
          className="opacity-100 mx-auto"
          src="/images/confirm.png"
          width={164}
          height={177}
          alt="Confirmation"
        />
      </div>
      <div className="w-full text-center mb-8">
        {children}
      </div>
      <button
        className="btn btn-gray w-full h-14 rounded-full mt-4 text-lg font-semibold transition"
        onClick={onView}
      >
        View transaction
      </button>
    </div>
  );
}
