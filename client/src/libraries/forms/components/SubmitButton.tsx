"use client"

import React from "react"
import { cn } from "@/utils/tools"
import { Variant, SubmitButtonProps } from "../types"

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  isDirty,
  isValid,
  label = "ارسال",
  submittingLabel = "ارسال...",
  disabledLabel = "من فضلك املأ النموذج اعلاه",
  className = "",
  variant = "primary",
  onClick,
  Icon,
  iconStyle
}) => {
  const disabled = isSubmitting || !isDirty || !isValid

  let buttonLabel = label
  if (isSubmitting) buttonLabel = submittingLabel
  else if (disabled) buttonLabel = disabledLabel

  const variantClasses: Record<Variant, string> = {
    primary: "bg-primary text-reversed hover:opacity-90",

    "primary-outline":
      "border border-primary bg-transparent text-primary hover:bg-primary/10",

    accent: "bg-accent text-text hover:opacity-90",

    "accent-outline":
      "border border-accent bg-transparent text-accent hover:bg-accent/10",

    success: "bg-success text-reversed hover:opacity-90",

    "success-outline":
      "border border-success bg-transparent text-success hover:bg-success/10",

    danger: "bg-danger text-reversed hover:opacity-90",

    "danger-outline":
      "border border-danger bg-transparent text-danger hover:bg-danger/10",

    warning: "bg-warning text-reversed hover:opacity-90",

    "warning-outline":
      "border border-warning bg-transparent text-warning hover:bg-warning/10",

    info: "bg-info text-reversed hover:opacity-90",

    "info-outline":
      "border border-info bg-transparent text-info hover:bg-info/10",

    transparent: "bg-transparent text-text hover:opacity-75",

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
  }

  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full rounded-xl py-3.5 transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        className
      )}
    >
      {Icon && <Icon className={cn("w-5 h-5", iconStyle)} />}
      {buttonLabel && <span>{buttonLabel}</span>}
    </button>
  )
}

export default SubmitButton
