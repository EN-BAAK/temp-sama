import React from "react"
import { SkeletonProps } from "./types"

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", variant = "rectangular", ...props }) => {
  const baseClass = "relative overflow-hidden bg-accent/25 animate-pulse before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-accent/5 before:to-transparent"

  const variantClasses = {
    text: "h-4 rounded-sm",
    rectangular: "rounded-md",
    circular: "rounded-full w-4 h-4",
    pattern: "rounded-t-[2rem] rounded-b-md"
  }

  return (
    <div
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}