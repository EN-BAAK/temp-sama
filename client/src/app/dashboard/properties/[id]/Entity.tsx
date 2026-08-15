"use client";

import React from "react";
import { cn } from "@/utils/tools";
import { DashboardPropertyEntityProps } from "@/types/components";
import Avatar from "@/components/Avatar";

const Entity: React.FC<DashboardPropertyEntityProps> = ({ fullName, phone, onClick, disabled = false, }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !phone}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-border p-3 text-start transition-colors",
        phone
          ? "cursor-pointer hover:border-primary hover:bg-primary/5"
          : "cursor-not-allowed opacity-50"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background2">
        <Avatar name={fullName} />
      </div>

      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-text">
          {fullName}
        </div>

        {phone ? (
          <div className="mt-0.5 text-xs text-muted">
            {phone}
          </div>
        ) : (
          <div className="mt-0.5 text-xs text-danger">
            لا يوجد رقم هاتف
          </div>
        )}
      </div>
    </button>
  );
};

export default Entity;