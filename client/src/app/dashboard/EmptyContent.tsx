"use client";

import React from "react";
import { DashboardEmptyContentProps } from "@/types/components";
import { RotateCw } from "lucide-react";
import Button from "@/libraries/forms/components/Button";
import SystemPattern from "@/components/SystemPattern";

const EmptyContent: React.FC<DashboardEmptyContentProps> = ({ title, desc, buttonTitle = "اعد المحاولة", buttonAction }) => {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center rounded-xl bg-card border border-background2 p-8 text-center overflow-hidden animate-fade-in select-none">
      <div className="absolute inset-0 pointer-events-none">
        <SystemPattern id="error-content-pattern" color="#F59E0B" opacity={.1} />
      </div>

      <div className="relative z-10 max-w-md flex flex-col items-center">
        <div className="mb-4 w-12 h-1 gap-0.5 flex justify-center items-center">
          <span className="w-2 h-2 rounded-full bg-warning/40" />
          <span className="w-8 h-[2px] bg-warning/20" />
          <span className="w-2 h-2 rounded-full bg-warning/40" />
        </div>

        <h2 className="text-xl font-bold text-text font-heading">
          {title}
        </h2>

        <p className="mt-2 text-sm text-text/70 font-sans leading-relaxed max-w-sm">
          {desc}
        </p>

        {buttonAction && (
          <Button
            variant="warning-outline"
            icon={RotateCw}
            iconClassName="text-warning"
            className="mt-6"
            onClick={buttonAction}
            label={buttonTitle}
          />
        )}
      </div>
    </section>
  );
};

export default EmptyContent;