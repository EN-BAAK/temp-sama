"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/tools";
import { ToastComponentProps } from "./types";

const toastStyles = {
  success: {
    text: "text-success",
    title: "نجاح",
  },
  error: {
    text: "text-danger",
    title: "خطأ",
  },
  warning: {
    text: "text-warning",
    title: "تحذير",
  },
  info: {
    text: "text-info",
    title: "اشعار",
  },
};

const Toast: React.FC<ToastComponentProps> = ({
  message,
  type,
  onClose,
  index,
  id
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3500);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const style = toastStyles[type.toLowerCase() as keyof typeof toastStyles];

  return (
    <div
      className={cn(
        "w-80 p-4 rounded-2xl shadow-lg absolute z-50 transition-all duration-300 ease-in-out animate-in slide-in-from-left-5 bg-background",
      )}
      style={{
        top: `${index * 90 + 16}px`,
        left: "1rem",
      }}
    >
      <button
        onClick={onClose}
        className="hover:bg-black/20 p-1 rounded-full absolute top-2 left-2 transition cursor-pointer"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <h1 className={cn("mb-1 font-semibold", style.text)}>
        {style.title}
      </h1>

      <p className={cn("text-sm", style.text)}>
        {message}
      </p>
    </div>
  );
};

export default Toast;