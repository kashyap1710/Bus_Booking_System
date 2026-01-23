import { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl min-w-[320px] max-w-md
        ${
          isSuccess
            ? "bg-gray-800 border border-green-500/50 text-white"
            : "bg-gray-800 border border-red-500/50 text-white"
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="text-green-500 shrink-0" size={24} />
        ) : (
          <XCircle className="text-red-500 shrink-0" size={24} />
        )}

        <p className="flex-1 font-medium">{message}</p>

        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full transition"
        >
          <X size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
