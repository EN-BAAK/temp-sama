'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, } from 'lucide-react';
import { useGetOwnerById, useDeleteOwnerById, } from '@/features/useOwners';
import { useAppContext } from '@/libraries/project-provider/AppProvider';
import OwnerDetails from './OwnerDetails';
import OwnerNotes from './OwnerNotes';
import OwnerProperties from './OwnerProperties';
import PropertiesModal from './Properties';
import Loading from './Loading';
import { ID } from '@/types/global';
import PageHeader from '@/components/PageHeader';
import PageLayout from '../../PageLayout';
import Contents from '../../Contents';

const Page: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { showWarning } = useAppContext();

  const id = Number(params.id) as ID;

  const { mutateAsync: deleteOwner, isPending: isDeleting } = useDeleteOwnerById();
  const { data, isFetching, isError, refetch } = useGetOwnerById(id);
  const owner = data?.data;

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleDelete = () => {
    showWarning({
      message: `هل أنت متأكد من حذف المالك "${owner?.fullName || 'هذا المالك'}" نهائياً؟`,
      btn1: 'إغلاق',
      btn2: 'حذف',
      handleBtn2: async () => {
        await deleteOwner(id);
        router.push('/owners');
      },
    });
  };
  const handleEdit = () => router.push(`/owners/edit/${id}`);

  const goBack = () => router.back();

  const onOpenModal = () => setIsAssignModalOpen(true)
  const oncloseModal = () => setIsAssignModalOpen(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="الملاك"
        sub="معلومات المالك وبياناته"
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
          isEmpty={!owner}
          emptyTitle="غير موجود"
          emptyDesc="عذراً, المالك غير موجود, أو تم حذفه"
          emptyAction={goBack}
          emptyActionTitle="العودة"
          isError={isError}
          errorTitle="مشكلة مفاجئة"
          errorDesc="ربما حدث خطأ من السيرفر"
          errorAction={refetch}
        >
          <OwnerDetails
            owner={owner!}
            onDelete={handleDelete}
            onEdit={handleEdit}
            disabled={isDeleting}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className='lg:col-span-2'>
              <OwnerProperties
                ownerId={id}
                onOpenAssignModal={onOpenModal}
              />
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-5">
                <OwnerNotes ownerId={id} />
              </div>
            </div>
          </div>
        </Contents>
      </PageLayout>

      <PropertiesModal
        ownerId={id}
        isOpen={isAssignModalOpen}
        onClose={oncloseModal}
      />
    </div>
  );
};

export default Page;