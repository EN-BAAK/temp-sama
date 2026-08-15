'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useGetAllCategories, useDeleteCategoryById } from '@/features/useCategories';
import Contents from '../Contents';
import Loading from './Loading';
import { CategoryEntity } from '@/types/entities';
import Category from './Category';
import { useAppContext } from '@/libraries/project-provider/AppProvider';
import { ID } from '@/types/global';
import PageHeader from '@/components/PageHeader';
import { useGetPageInfo } from '@/hooks/useHelpers';
import PageLayout from '../PageLayout';

const Page: React.FC = () => {
  const router = useRouter();
  const { showWarning } = useAppContext();
  const { subtitle, title } = useGetPageInfo();

  const { data, isLoading, isError, refetch } = useGetAllCategories();
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategoryById();

  const categories: CategoryEntity[] = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const handleDelete = async (id: ID, name: string) => {
    showWarning({
      message: `هل أنت متأكد من حذف التصنيف "${name}" نهائياً؟`,
      btn1: 'إغلاق',
      btn2: 'حذف',
      handleBtn2: () => deleteCategory(id),
    });
  };

  const handleEdit = (id: ID) => router.push(`categories/edit/${id}`);
  const handleAdd = () => router.push('categories/add');

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        sub={subtitle}
        actions={[
          {
            icon: Plus,
            label: 'إضافة تصنيف',
            onClick: handleAdd,
          },
        ]}
      />

      <PageLayout className="space-y-6">
        <Contents
          Skeletons={<Loading />}
          isEmpty={categories.length === 0}
          emptyTitle="لا توجد تصنيفات"
          emptyDesc="لا يوجد تصنيفات مضافة بعد. يمكنك إضافة تصنيف جديد من خلال الضغط على زر 'إضافة تصنيف'."
          isError={isError}
          errorTitle="خطأ في تحميل البيانات"
          errorDesc="حدثت مشكلة أثناء تحميل قائمة التصنيفات. يرجى المحاولة لاحقاً."
          errorActionTitle="إعادة المحاولة"
          errorAction={refetch}
          isLoading={isLoading}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:lg:grid-cols-4 lg:grid-cols-5">
            {categories.map((category) => (
              <Category
                key={`category-${category.id}`}
                category={category}
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