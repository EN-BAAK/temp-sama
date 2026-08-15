import { AvatarProps } from "@/types/components";
import { AvatarColorTheme } from "@/types/variables";
import React from "react";

const DEFAULT_COLORS: AvatarColorTheme[] = [
  { bg: "bg-blue-500", text: "text-white" },
  { bg: "bg-emerald-500", text: "text-white" },
  { bg: "bg-purple-500", text: "text-white" },
  { bg: "bg-amber-500", text: "text-gray-900" },
  { bg: "bg-rose-500", text: "text-white" },
  { bg: "bg-indigo-500", text: "text-white" },
  { bg: "bg-teal-500", text: "text-white" },
  { bg: "bg-orange-500", text: "text-white" },
];

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  fallback = "م",
  size = "sm",
  className = "",
}) => {
  const displayChar = (name?.[0] || fallback).trim().toUpperCase();

  const charCode = displayChar.charCodeAt(0) || 0;

  const themeIndex = Math.abs(charCode) % DEFAULT_COLORS.length;
  const currentTheme = DEFAULT_COLORS[themeIndex];

  return (
    <div
      className={`
        ${SIZE_CLASSES[size]}
        ${currentTheme.bg}
        ${currentTheme.text}
        rounded-full flex items-center justify-center shrink-0 font-bold shadow-sm select-none
        ${className}
      `.trim()}
    >
      {displayChar}
    </div>
  );
};

export default Avatar;