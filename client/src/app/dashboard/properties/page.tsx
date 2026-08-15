'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import Contents from '../Contents';
import { PropertyEntity } from '@/types/entities';
import { useAppContext } from '@/libraries/project-provider/AppProvider';
import { ID } from '@/types/global';
import PageHeader from '@/components/PageHeader';
import { useGetPageInfo } from '@/hooks/useHelpers';
import { useDebouncedSearch } from '@/libraries/hooks/useHelpers';
import PageLayout from '../PageLayout';
import Pagination from '@/components/Pagination';
import Loading from './Loading';
import Property from './Property';
import { useDeletePropertyById, useGetAllProperties } from '@/features/useProperties';
import { GetPropertiesFilterParams } from '@/types/queries';
import Filters from './Filters';

const Page: React.FC = () => {
  const router = useRouter();
  const { showWarning } = useAppContext();

  const { subtitle, title } = useGetPageInfo();
  const { search, setSearch, debouncedSearch } = useDebouncedSearch({ action: () => setPage(1), });
  const [filters, setFilters] = useState<GetPropertiesFilterParams>({});

  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, refetch } = useGetAllProperties(page, debouncedSearch, filters);
  const { mutateAsync: deleteProperty, isPending: isDeleting } = useDeletePropertyById();

  const { properties, totalPages, hasNextPage, hasPreviousPage, currentPage } =
    useMemo(() => {
      const properties: PropertyEntity[] = data?.data.items || [];
      const totalPages = data?.data.totalPages || 0;
      const hasNextPage = data?.data.nextPage || false;
      const hasPreviousPage = data?.data.prevPage || false;
      const page = data?.data.page || 1;
      return {
        properties,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        currentPage: page,
      };
    }, [data]);

  const handleDelete = async (id: ID, title?: string) => {
    showWarning({
      message: `هل أنت متأكد من حذف العقار "${title || 'هذا العقار'}" نهائياً؟`,
      btn1: 'إغلاق',
      btn2: 'حذف',
      handleBtn2: () => deleteProperty(id),
    });
  };

  const handleView = (id: ID) => router.push(`properties/${id}`);
  const handleEdit = (id: ID) => router.push(`properties/edit/${id}`);
  const handleAdd = () => router.push('properties/add');

  const handleFiltersChange = (newFilters: GetPropertiesFilterParams,) => {
    setPage(1);
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        sub={subtitle}
        actions={[
          {
            icon: Plus,
            label: 'إضافة عقار',
            onClick: handleAdd,
          },
        ]}
      />

      <PageLayout className="space-y-6">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في العقارات..."
              className="w-full rounded-xl bg-background py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Filters
            value={filters}
            onChange={handleFiltersChange}
            isDisabled={isDeleting}
          />
        </div>

        <Contents
          Skeletons={<Loading />}
          isEmpty={properties.length === 0}
          emptyTitle="لا توجد نتائج"
          emptyDesc={
            debouncedSearch
              ? 'لم يتم العثور على عقارات مطابقة لبحثك.'
              : "لا توجد عقارات مضافة بعد. يمكنك إضافة عقار جديد من خلال الضغط على زر 'إضافة عقار'."
          }
          isError={isError}
          errorTitle="خطأ في تحميل البيانات"
          errorDesc="حدثت مشكلة أثناء تحميل قائمة العقارات. يرجى المحاولة لاحقاً."
          errorActionTitle="إعادة المحاولة"
          errorAction={refetch}
          isLoading={isLoading}
        >
          <div className="flex flex-col space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Property
                  key={`property-${property.id}`}
                  property={property}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  handleView={handleView}
                  isLoading={isDeleting}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              isDisabled={isLoading || isDeleting}
              onPageChange={(newPage) => setPage(newPage)}
              className='rounded-2xl border border-border bg-card p-3 shadow-sm'
            />
          </div>
        </Contents>
      </PageLayout>
    </div>
  );
};

export default Page;