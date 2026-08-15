"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ClientDetails } from "./ClientDetails";
import { ClientNotes } from "./ClientNotes";
import { useGetClientById } from "@/features/useClients";
import Contents from "../../Contents";
import Loading from "./Loading";
import { ID } from "@/types/global";
import Interestings from "./Interestings";
import PageHeader from "@/components/PageHeader";
import PageLayout from "../../PageLayout";

type TabType = "properties" | "notes";

const ClientDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id) as ID;

  const { data, isFetching, isError, refetch } = useGetClientById(id);
  const client = data?.data;

  const [tab, setTab] = useState<TabType>("properties");

  const goBack = () => router.back();

  return (
    <div className="space-y-6">
      <PageHeader
        title="العملاء"
        sub="معلومات العميل وبياناته"
        actions={[
          {
            onClick: goBack,
            icon: ArrowLeft,
            variant: "transparent",
            reverse: true
          }
        ]}
      />

      <PageLayout>
        <Contents
          isLoading={isFetching}
          Skeletons={<Loading />}
          isEmpty={!client}
          emptyTitle="غير موجود"
          emptyDesc="عذراً, العميل غير موجود, أو تم حذفه"
          emptyAction={goBack}
          emptyActionTitle="العودة"
          isError={isError}
          errorTitle="مشكلة مفاجئة"
          errorDesc="ربما حدث خطأ من السيرفر"
          errorAction={refetch}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-start">
            <ClientDetails client={client!} />

            <div className="md:col-span-2">
              <div className="overflow-hidden rounded-xl border border-border bg-reversed shadow-sm">
                <div className="flex border-b border-border font-sans">
                  {[
                    { id: "properties", label: "العقارات المفضلة" },
                    { id: "notes", label: "الملاحظات" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id as TabType)}
                      className={`border-b-2 px-5 py-4 text-sm font-medium transition-colors cursor-pointer ${tab === t.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted hover:text-text"
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {tab === "properties" && <Interestings id={id} />}
                  {tab === "notes" && <ClientNotes id={id} />}
                </div>
              </div>
            </div>
          </div>
        </Contents>
      </PageLayout>
    </div>
  );
}

export default ClientDetailPage