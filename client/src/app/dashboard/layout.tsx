import OffsetProvider from "@/libraries/offset/OffsetsProvider";
import AppProvider from "@/libraries/project-provider/AppProvider";
import ReactQueryProvider from "@/libraries/react-query/ReactQueryProvider";
import { CommonParentProps } from "@/types/global";
import type { Metadata } from "next";
import Sidebar from "./Sidebar";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  description: "لوحة التحكم الخاصة بإدارة العقارات، والمشاريع، والعملاء، والمالكين لمنصة سما بلودان.",

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

export default function DashboardLayout({ children }: CommonParentProps) {
  return (
    <ReactQueryProvider>
      <OffsetProvider>
        <AppProvider>
          <div className="bg-background h-screen flex overflow-hidden" dir="rtl">
            <Sidebar />

            <main className="flex-1 h-screen overflow-auto relative">
              {children}
            </main>
          </div>
        </AppProvider>
      </OffsetProvider>
    </ReactQueryProvider>
  );
}