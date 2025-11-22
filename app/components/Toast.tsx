"use client";

import { useEffect } from "react";

export interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  onClose?: () => void;
  duration?: number; // ms, auto-dismiss if provided
  position?: "top" | "bottom"; // vertical placement
}

export default function Toast({
  message,
  type = "info",
  onClose,
  duration,
  position = "bottom",
}: ToastProps) {
  useEffect(() => {
    if (!duration) return;
    const id = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  const colorClasses =
    type === "error"
      ? "bg-red-500 text-white"
      : type === "success"
      ? "bg-green-500 text-white"
      : "bg-zinc-800 text-white";

  const verticalClass = position === "top" ? "top-6" : "bottom-6";

  return (
    <div
      className={`fixed ${verticalClass} left-1/2 w-[90%] max-w-sm -translate-x-1/2 rounded-lg px-4 py-3 text-sm shadow-lg transition-all duration-300 ${colorClasses}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-white/80 hover:text-white focus:outline-none"
            aria-label="Close notification"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
