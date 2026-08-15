import React from "react";
import type { Metadata } from "next";
import { Check, Building2 } from "lucide-react";
import SystemPattern from "@/components/SystemPattern";
import { CommonParentProps } from "@/types/global";
import ReactQueryProvider from "@/libraries/react-query/ReactQueryProvider";
import AppProvider from "@/libraries/project-provider/AppProvider";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "بوابة تسجيل الدخول لمنصة سما بلودان للمقاولات والعقارات.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const AuthLayout: React.FC<Readonly<CommonParentProps>> = ({ children }) => {
  return (<ReactQueryProvider>
    <AppProvider>
      <div className="min-h-screen bg-background flex select-none" dir="rtl">
        <div className="hidden lg:flex flex-col w-5/12 relative bg-primary overflow-hidden items-center justify-between p-12 py-16">
          <SystemPattern id="auth-pat" color="#F8FAFC" opacity={0.15} />

          <div className="relative z-10 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                <Building2 className="w-5 h-5 text-reversed" />
              </div>
              <span className="text-2xl font-bold text-reversed tracking-wide font-ibm-plex-arabic">
                سما بلودان
              </span>
            </div>
          </div>

          <div className="relative z-10 text-right w-full my-auto">
            <div className="text-reversed text-sm font-semibold mb-3 tracking-wider uppercase">
              حلول متكاملة للمقاولات والعقارات
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4 text-reversed font-ibm-plex-arabic">
              إدارة متطورة
              <br />
              <span className="text-second">للمشاريع والعقارات</span> بثقة
            </h2>

            <p className="text-reversed/80 text-sm leading-relaxed max-w-sm mb-8">
              منصة متكاملة تُتيح لك متابعة المشاريع الهندسية، إدارة الوحدات العقارية، والربط الفعال بين المالكين والعملاء.
            </p>

            <div className="flex flex-col gap-3.5">
              {[
                "إدارة شاملة للعقارات والمشاريع الهندسية",
                "متابعة دقيقة لسجلات العملاء والمستثمرين والمالكين",
                "تحليلات وتقارير فورية للعمليات والعقود",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-reversed" />
                  </div>
                  <span className="text-reversed/90 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 w-full border-t border-reversed/10 pt-6">
            <div className="flex items-center justify-between text-xs text-reversed/40">
              <span>سما بلودان للمقاولات والعقارات v1.0</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          {children}
        </div>
      </div>
    </AppProvider>
  </ReactQueryProvider>

  );
};

export default AuthLayout;