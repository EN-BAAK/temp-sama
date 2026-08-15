'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useGetAllGovernorates, useDeleteGovernorateById, } from '@/features/useGovernorate';
import Contents from '../Contents';
import Loading from './Loading';
import { GovernorateEntity } from '@/types/entities';
import Governorate from './Governorate';
import { useAppContext } from '@/libraries/project-provider/AppProvider';
import { ID } from '@/types/global';
import PageHeader from '@/components/PageHeader';
import { useGetPageInfo } from '@/hooks/useHelpers';
import PageLayout from '../PageLayout';

const Page: React.FC = () => {
  const router = useRouter();
  const { showWarning } = useAppContext();
  const { subtitle, title } = useGetPageInfo();

  const { data, isLoading, isError, refetch, } = useGetAllGovernorates();

  const { mutateAsync: deleteGovernorate, isPending: isDeleting } = useDeleteGovernorateById();

  const governorates = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const handleDelete = async (id: ID, name: string) => {
    showWarning({
      message: `هل أنت متأكد من حذف محافظة "${name}" نهائياً؟`,
      btn1: 'إغلاق',
      btn2: 'حذف',
      handleBtn2: () => deleteGovernorate(id),
    });
  };
  const handleEdit = (id: ID) => router.push(`governorates/edit/${id}`);
  const handleAdd = () => router.push('governorates/add');

  return (
    <div className="space-y-4">
      <PageHeader
        title={title}
        sub={subtitle}
        actions={[
          {
            label: "إضافة محافظة",
            icon: Plus,
            onClick: handleAdd,
            variant: "primary",
          }
        ]}
      />

      <PageLayout>
        <Contents
          Skeletons={<Loading />}
          isEmpty={governorates.length === 0}
          emptyTitle="لا توجد محافظات مضافة"
          emptyDesc="يمكنك البدء بإضافة المحافظات والمدن التابعة لها لتنظيم المناطق العقارية."
          isError={isError}
          errorTitle="خطأ في تحميل البيانات"
          errorDesc="حدثت مشكلة أثناء تحميل قائمة المحافظات. يرجى المحاولة لاحقاً."
          errorActionTitle="إعادة المحاولة"
          errorAction={refetch}
          isLoading={isLoading}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {governorates.map((gov: GovernorateEntity) => (
              <Governorate
                key={`governorate-${gov.id}`}
                governorate={gov}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                isLoading={isDeleting}
              />
            ))}
          </div>
        </Contents>
      </PageLayout>
    </div>
  );
};

export default Page;