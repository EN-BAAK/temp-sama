"use client";

import Button from "@/libraries/forms/components/Button";
import { PWAInstallPromptProps } from "@/types/contexts";
import React from "react";

const PWAInstallPrompt = ({ onInstall, onClose, }: PWAInstallPromptProps): React.JSX.Element => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-second/40 p-4 backdrop-blur-[2px]">
      <div
        dir="rtl"
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-reversed">
            س
          </div>

          <div className="flex-1">
            <h2 className="font-heading text-xl font-bold text-second">
              تثبيت سما بلودان
            </h2>

            <p className="mt-2 font-sans text-sm leading-7 text-muted">
              ثبّت تطبيق سما بلودان على جهازك للوصول إلى
              منصة إدارة العقارات بشكل أسرع وأسهل.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button
            type="button"
            onClick={onInstall}
            className="w-fit"
            label="تثبيت التطبيق"
          />

          <Button
            type="button"
            onClick={onClose}
            className="w-fit"
            label="لاحقا"
            variant="transparent-outline"
          />
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;