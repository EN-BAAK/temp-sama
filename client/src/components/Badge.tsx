"use client";

import React from "react";
import { cn } from "@/utils/tools";
import { CustomBadgeProps } from "@/types/components";

const Badge: React.FC<CustomBadgeProps> = ({
  label,
  className = "",
  variant = "primary",
  icon: Icon,
  iconClassName = "",
}) => {
  const variantClasses = {
    primary: "bg-primary/10 text-primary border-transparent",
    accent: "bg-accent/10 text-accent border-transparent",
    danger: "bg-danger/10 text-danger border-transparent",
    success: "bg-success/10 text-success border-transparent",
    warning: "bg-warning/10 text-warning border-transparent",
    info: "bg-info/10 text-info border-transparent",
    transparent: "bg-background text-text border border-border",
  }[variant];

  const isIconOnly = Boolean(Icon && !label);

  return (
    <div
      className={cn(
        "flex items-center justify-center font-medium transition-colors duration-200",
        isIconOnly
          ? "h-10 w-10 rounded-xl"
          : "w-fit px-3 py-1 text-xs rounded-lg gap-1.5",
        variantClasses,
        className
      )}
    >
      {Icon && <Icon className={cn("w-5 h-5 shrink-0", iconClassName)} />}
      {label && <span>{label}</span>}
    </div>
  );
};

export default Badge;