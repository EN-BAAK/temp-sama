'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Edit, MapPin, Bed, Bath, Maximize2, Building, ArrowLeft, Share2, } from 'lucide-react';
import { useGetPropertyById, } from '@/features/useProperties';
import { formatBalance, getImageUrl } from '@/utils/helpers';
import PropertyDetails from './PropertyDetails';
import PropertyNotes from './PropertyNotes';
import PropertyImages from './PropertyImages';
import PropertyOwner from './PropertyOwner';
import Button from '@/libraries/forms/components/Button';
import Loading from './Loading';
import { DURATION_MAP, STATUS_MAP } from '@/constants/global';
import { ID } from '@/types/global';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import PageLayout from '../../PageLayout';
import PropertyNoImage from '../PropertyNoImage';
import PropertyImageLoading from '../PropertyImageLoading';
import Contents from '../../Contents';
import { FileViewerType, PropertyStatus } from '@/types/variables';
import PropertyPlans from './PropertyPlans';
import { useFileViewerContext } from '@/contexts/FileViewerProvider';
import SharePropertyModal from './SharePropertyModal';

const Page: React.FC = () => {
  const { openFile } = useFileViewerContext()
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id) as ID;

  const [tab, setTab] = useState<'details' | 'notes'>('details');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoadingImageFailed, setIsLoadingImageFailed] = useState<boolean>(false)
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true)

  const { data, isFetching, isError, refetch } = useGetPropertyById(id);

  const property = data?.data;

  const stopLoadingImage = () => setIsLoadingImage(false)
  const ImageFailed = () => setIsLoadingImageFailed(true)

  const handleEdit = () => router.push(`/dashboard/properties/edit/${id}`);
  const goBack = () => router.back()
  const onViewImage = () => property?.backgroundUrl ? openFile({ url: getImageUrl(property.backgroundUrl), type: FileViewerType.IMAGE }) : undefined

  const openModal = () => setIsShareModalOpen(true)
  const closeModal = () => setIsShareModalOpen(false)

  const statusConfig = STATUS_MAP[property?.status || PropertyStatus.AVAILABLE] || {
    label: property?.status,
    className: 'bg-background text-muted border border-border',
  };

  return (
    <div className="space-y-6 relative">
      <PageHeader
        title="العقارات"
        sub="معلومات العقار وبياناته"
        actions={[
          {
            onClick: goBack,
            icon: ArrowLeft,
            variant: "transparent",
            reverse: true
          }
        ]}
      />

      <PageLayout className='space-y-4'>
        <Contents
          isLoading={isFetching}
          Skeletons={<Loading />}
          isEmpty={!property}
          emptyTitle="غير موجود"
          emptyDesc="عذراً, العقار غير موجود, أو تم حذفه"
          emptyAction={goBack}
          emptyActionTitle="العودة"
          isError={isError}
          errorTitle="مشكلة مفاجئة"
          errorDesc="ربما حدث خطأ من السيرفر"
          errorAction={refetch}
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="relative h-72 w-full bg-background">
              {!property?.backgroundUrl || isLoadingImageFailed
                ? <PropertyNoImage />
                : (
                  <React.Fragment>
                    {isLoadingImage && <PropertyImageLoading />}

                    <Image
                      src={getImageUrl(property?.backgroundUrl)}
                      fill
                      onLoad={stopLoadingImage}
                      onError={ImageFailed}
                      alt={property.title || 'صورة العقار'}
                      className="h-full w-full object-fill cursor-pointer"
                    />
                  </React.Fragment>
                )
              }
              <button
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent hover:bg-black/30 duration-200 cursor-pointer"
                onClick={onViewImage}
              />

              <div className="absolute bottom-0 right-0 p-6">
                <span
                  className={`mb-2.5 inline-block rounded-md px-2.5 py-1 font-sans text-xs font-medium ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </span>
                <h1 className="font-heading text-2xl font-bold text-white">
                  {property?.title || 'بدون عنوان'}
                </h1>
                {property?.location && (
                  <div className="mt-1.5 flex items-center gap-1.5 font-sans text-sm text-white/80">
                    <MapPin className="h-4 w-4 shrink-0 text-white/70" />
                    <span>{property.location}</span>
                  </div>
                )}
              </div>

              <div className="absolute left-4 top-4 flex gap-2">
                <Button
                  variant="transparent-warning"
                  onClick={handleEdit}
                  icon={Edit}
                  aria-label="تعديل العقار"
                  className="rounded-xl bg-card/90 p-2 text-text shadow backdrop-blur-sm transition-colors hover:bg-card"
                />

                <Button
                  variant="transparent-info"
                  onClick={openModal}
                  icon={Share2}
                  aria-label="مشاركة العقار"
                  className="rounded-xl bg-card/90 p-2 text-text shadow backdrop-blur-sm transition-colors hover:bg-card"
                />
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="font-sans">
                  <div className="font-heading text-xl font-bold">
                    {formatBalance(property?.price)}{' '}
                    {property?.duration && (
                      <span className="font-sans text-sm font-normal text-muted">
                        / {DURATION_MAP[property.duration]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 font-sans">
                  {!!property?.bedrooms && property.bedrooms > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-text">
                        <Bed className="h-4 w-4 text-primary" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted">غرف النوم</div>
                    </div>
                  )}

                  {!!property?.bathrooms && property.bathrooms > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-text">
                        <Bath className="h-4 w-4 text-primary" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted">دورات المياه</div>
                    </div>
                  )}

                  {!!property?.area && (
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-text">
                        <Maximize2 className="h-4 w-4 text-primary" />
                        <span>{Number(property.area).toFixed(0)}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted">المساحة م²</div>
                    </div>
                  )}

                  {property?.category && (
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-text">
                        <Building className="h-4 w-4 text-primary" />
                        <span>{property.category}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted">النوع</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-8">
            <div className="space-y-6 lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex border-b border-border">
                  {[
                    { id: 'details', label: 'التفاصيل' },
                    { id: 'notes', label: 'الملاحظات' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id as typeof tab)}
                      className={`border-b-2 px-5 py-4 font-sans text-sm font-medium transition-colors ${tab === t.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted hover:text-text'
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {tab === 'details' && <PropertyDetails property={property!} />}
                  {tab === 'notes' && <PropertyNotes id={id} />}
                </div>
              </div>

              <PropertyImages id={id} />
            </div>

            <div className="space-y-5">
              <PropertyOwner id={id} />
              <PropertyPlans id={id} />
            </div>
          </div>
        </Contents>
      </PageLayout>

      {property && isShareModalOpen && (
        <SharePropertyModal
          property={property}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Page;