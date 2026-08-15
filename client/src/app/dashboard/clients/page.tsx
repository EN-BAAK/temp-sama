'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import { useGetAllClients, useDeleteClientById } from '@/features/useClients';
import Contents from '../Contents';
import Loading from './Loading';
import { ClientEntity } from '@/types/entities';
import Client from "./Client"
import { useAppContext } from '@/libraries/project-provider/AppProvider';
import { ID } from '@/types/global';
import PageHeader from '@/components/PageHeader';
import { useGetPageInfo } from '@/hooks/useHelpers';
import { useDebouncedSearch } from '@/libraries/hooks/useHelpers';
import PageLayout from '../PageLayout';
import Pagination from '@/components/Pagination';

const Page: React.FC = () => {
  const router = useRouter();
  const { showWarning } = useAppContext()

  const { subtitle, title } = useGetPageInfo()
  const { search, setSearch, debouncedSearch } = useDebouncedSearch({ action: () => setPage(1) });

  const [page, setPage] = useState<number>(1)

  const { data, isLoading, isError, refetch, } = useGetAllClients(page, debouncedSearch);
  const { mutateAsync: deleteClient, isPending: isDeleting } = useDeleteClientById();

  const { clients, totalPages, hasNextPage, hasPreviousPage, currentPage } = useMemo(() => {
    const clients: ClientEntity[] = data?.data.items || []
    const totalPages = data?.data.totalPages || 0
    const hasNextPage = data?.data.nextPage || false
    const hasPreviousPage = data?.data.prevPage || false
    const page = data?.data.page || 1
    return { clients, totalPages, hasNextPage, hasPreviousPage, currentPage: page }
  }, [data]);

  const handleDelete = async (id: ID, name: string) => {
    showWarning({
      message: `هل أنت متأكد من حذف العميل "${name}" نهائياً؟`,
      btn1: "إغلاق",
      btn2: "حذف",
      handleBtn2: () => deleteClient(id),
    });
  };
  const handleView = (id: ID) => router.push(`clients/${id}`)
  const handleEdit = (id: ID) => router.push(`clients/edit/${id}`)
  const handleAdd = () => router.push("clients/add")

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        sub={subtitle}
        actions={[
          {
            icon: Plus,
            label: "إضافة عميل",
            onClick: handleAdd,
          }
        ]}
      />

      <PageLayout className="space-y-6">
        {(clients.length !== 0 || isLoading || search) && <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في الملاك..."
              className="w-full rounded-xl bg-background py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>}

        <Contents
          Skeletons={<Loading />}
          isEmpty={clients.length === 0}
          emptyTitle="لا توجد نتائج"
          emptyDesc={
            debouncedSearch
              ? "لم يتم العثور على عملاء مطابقين لبحثك."
              : "لا يوجد عملاء بعد. يمكنك إضافة عميل جديد من خلال الضغط على زر 'إضافة عميل'."
          }
          isError={isError}
          errorTitle="خطأ في تحميل البيانات"
          errorDesc="حدثت مشكلة أثناء تحميل قائمة العملاء. يرجى المحاولة لاحقاً."
          errorActionTitle="إعادة المحاولة"
          errorAction={refetch}
          isLoading={isLoading}
        >
          <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right font-sans">
                <thead>
                  <tr className="border-b border-border bg-background/60 font-heading text-xs font-semibold text-muted">
                    <th className="px-5 py-4">العميل</th>
                    <th className="px-5 py-4">البريد الإلكتروني</th>
                    <th className="px-5 py-4">المدينة</th>
                    <th className="px-5 py-4">الميزانية</th>
                    <th className="px-5 py-4 text-left"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm text-text">
                  {clients.map((c) => (
                    <Client
                      key={`client-${c.id}`}
                      client={c}
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                      handleView={handleView}
                      isLoading={isDeleting}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-border bg-background/60 px-4 py-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                isDisabled={isLoading || isDeleting}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </div>
        </Contents>
      </PageLayout>
    </div>
  );
}

export default Page