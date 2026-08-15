import { SystemPatternProps } from "@/types/components";
import React from "react";

const SystemPattern: React.FC<SystemPatternProps> = ({
  id,
  color = "#4338CA",
  opacity = 0.02
}) => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={id}
          x="0"
          y="0"
          width="100%"
          height="100%"
          patternUnits="userSpaceOnUse"
        >
          <linearGradient id="aurora-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="50%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>

          <g fill="none" strokeWidth="1.5">
            <path
              d="M 0,20 Q 25,80 50,30 T 100,70"
              pathLength="100"
              stroke="url(#aurora-grad-1)"
              strokeWidth="2"
            />

            <path
              d="M 0,60 Q 35,10 65,70 T 100,20"
              pathLength="100"
              stroke={color}
              strokeWidth="1"
              strokeDasharray="4 4"
              strokeOpacity="0.4"
            />
          </g>
        </pattern>
      </defs>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </svg>
  );
};

export default SystemPattern;