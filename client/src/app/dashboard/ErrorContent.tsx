"use client";

import React from "react";
import { RotateCw } from "lucide-react";
import SystemPattern from "@/components/SystemPattern";
import { DashboardErrorContentProps } from "@/types/components";
import Button from "@/libraries/forms/components/Button";

const ErrorContent: React.FC<DashboardErrorContentProps> = ({ title, desc, actionTitle = "إعادة المحاولة", onAction, }) => {
  return (
    <section className="relative h-screen flex w-full flex-col items-center justify-center rounded-xl bg-card border border-danger/10 p-8 text-center overflow-hidden animate-fade-in select-none">
      <div className="absolute inset-0 pointer-events-none">
        <SystemPattern id="error-content-pattern" color="#DC2626" opacity={.1} />
      </div>

      <div className="relative z-10 max-w-md flex flex-col items-center">

        <div className="mb-4 flex justify-center items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-danger/50" />
          <span className="w-12 h-[1px] bg-danger/30" />
          <span className="w-1.5 h-1.5 rounded-full bg-danger/50" />
        </div>

        <h2 className="text-xl font-bold text-danger font-heading">
          {title}
        </h2>

        <p className="mt-2 text-sm text-text/70 font-sans leading-relaxed max-w-sm">
          {desc}
        </p>

        {onAction && (
          <Button
            variant="danger-outline"
            icon={RotateCw}
            iconClassName="text-danger"
            className="mt-6"
            onClick={onAction}
            label={actionTitle}
          />
        )}
      </div>
    </section>
  );
};

export default ErrorContent;