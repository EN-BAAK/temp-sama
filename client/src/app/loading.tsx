'use client';

import React from 'react';
import { Building2 } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center font-sans">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20" />

        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-md border border-border">
          <Building2 className="h-7 w-7 animate-pulse text-primary" />
        </div>
      </div>

      <div className="mt-6 text-center">
        <h3 className="font-heading text-base font-semibold text-text">
          جاري التحميل...
        </h3>
        <p className="mt-1 text-xs text-muted">
          يرجى الانتظار قليلاً بينما نقوم بتجهيز البيانات
        </p>
      </div>
    </div>
  );
};

export default Loading;