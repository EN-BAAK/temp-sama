"use client"

import React from "react"
import { cn } from "@/utils/tools"
import { CustomButtonProps } from "../types"

const Button: React.FC<CustomButtonProps> = ({
  label,
  className = "",
  variant = "primary",
  onClick,
  icon: Icon,
  iconClassName = "",
  disabled = false,
  type = "button",
  reverse = false
}) => {
  const variantClasses = {
    primary:
      "bg-primary text-reversed hover:opacity-90",

    "primary-outline":
      "border border-primary bg-transparent text-primary hover:bg-primary/10",

    accent:
      "bg-accent text-text hover:opacity-90",

    "accent-outline":
      "border border-accent bg-transparent text-accent hover:bg-accent/10",

    danger:
      "bg-danger text-reversed hover:opacity-90",

    "danger-outline":
      "border border-danger bg-transparent text-danger hover:bg-danger/10",

    success:
      "bg-success text-reversed hover:opacity-90",

    "success-outline":
      "border border-success bg-transparent text-success hover:bg-success/10",

    warning:
      "bg-warning text-reversed hover:opacity-90",

    "warning-outline":
      "border border-warning bg-transparent text-warning hover:bg-warning/10",

    info:
      "bg-info text-reversed hover:opacity-90",

    "info-outline":
      "border border-info bg-transparent text-info hover:bg-info/10",

    transparent:
      "bg-transparent text-text hover:opacity-75",

    "transparent-outline":
      "border border-border bg-transparent text-text hover:bg-border/40",

    "transparent-primary":
      "bg-transparent text-text hover:text-primary",

    "transparent-accent":
      "bg-transparent text-text hover:text-accent",

    "transparent-danger":
      "bg-transparent text-text hover:text-danger",

    "transparent-success":
      "bg-transparent text-text hover:text-success",

    "transparent-warning":
      "bg-transparent text-text hover:text-warning",

    "transparent-info":
      "bg-transparent text-text hover:text-info",
  }[variant]

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={(e) => onClick?.(e)}
      className={cn(
        "w-full px-3 py-2 flex items-center justify-center gap-2 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        reverse && "flex-row-reverse",
        variantClasses,
        className
      )}
    >
      {Icon && <Icon className={cn("w-5 h-5", iconClassName)} />}
      {label && <span>{label}</span>}
    </button>
  )
}

export default Button