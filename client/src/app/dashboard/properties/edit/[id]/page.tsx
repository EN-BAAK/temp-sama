'use client';

import React, { useMemo, useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, Home } from 'lucide-react';
import InputField from '@/libraries/forms/components/InputField';
import SelectorField from '@/libraries/forms/components/SelectorField';
import TextAreaField from '@/libraries/forms/components/TextAreaField';
import SubmitButton from '@/libraries/forms/components/SubmitButton';
import Button from '@/libraries/forms/components/Button';
import SelectImageField from '@/libraries/forms/components/SelectImageField';
import PageHeader from '@/components/PageHeader';
import Badge from '@/components/Badge';
import PageLayout from '@/app/dashboard/PageLayout';
import Contents from '@/app/dashboard/Contents';
import Loading from './Loading';
import { CategoryEntity, CityEntity, OwnerEntity, PropertyEntityCreation, PropertyFeatureEntity, PropertyImageEntity, PropertyPlanEntity, } from '@/types/entities';
import { ExistingFileItem, ExistingImageItem, PropertyPurpose } from '@/types/variables';
import { validationPropertySchema } from '@/constants/formsValidations';
import { PROPERTY_DURATION_OPTIONS, PROPERTY_PURPOSE_OPTIONS, PROPERTY_STATUS_OPTIONS, } from '@/constants/global';
import { useDeletePropertyImage, useDeletePropertyPlan, useGetPropertySettingsById, useUpdateProperty, } from '@/features/useProperties';
import { useGetAllCities } from '@/features/useGovernorate';
import { useGetAllCategories } from '@/features/useCategories';
import { useGetOwnersIdentifiers } from '@/features/useOwners';
import { PROPERTY_STEPS } from '../../global';
import FeaturesField from '../../FeaturesCustomeField';
import SelectMultiImageField from '../../SelectMutliImageField';
import CustomMapField from '../../CustomMapField';
import SelectMultiFilesField from '../../SelectMutliFilesField';
import { useGetAllPropertyFeatures } from '@/features/useFeatures';

const EditPropertyForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [step, setStep] = useState(1);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPlans, setNewPlans] = useState<File[]>([]);

  const [propertyImage, setPropertyImage] = useState<File | null | undefined>(undefined);
  const [isImageRemoved, setIsImageRemoved] = useState<boolean>(false)

  const { mutateAsync: mutateAsyncUpdate } = useUpdateProperty();
  const { mutateAsync: deleteImage, isPending: isDeletingImage } = useDeletePropertyImage();
  const { mutateAsync: deletePlan, isPending: isDeletingPlan } = useDeletePropertyPlan();

  const { data: featureData } = useGetAllPropertyFeatures()
  const { data: cityData } = useGetAllCities();
  const { data: categoryData } = useGetAllCategories();
  const { data: ownerData } = useGetOwnersIdentifiers({ enable: true });
  const { data: propertyData, isFetching, isError, refetch, } = useGetPropertySettingsById(id);

  const property = propertyData?.data;

  const featureOptions = (featureData?.data || []).map((feature: PropertyFeatureEntity) => ({
    name: feature.name,
    id: feature.id,
  }));

  const cityOptions = useMemo(
    () => (cityData?.data || []).map((city: CityEntity) => ({ key: city.name, value: city.id, })),
    [cityData],
  );

  const categoryOptions = useMemo(
    () => (categoryData?.data || []).map((category: CategoryEntity) => ({ key: category.name, value: category.id, })),
    [categoryData],
  );

  const ownerOptions = useMemo(
    () => (ownerData?.data || []).map((owner: OwnerEntity) => ({ key: owner.fullName, value: owner.id, })),
    [ownerData],
  );

  const existingImages = useMemo(() => {
    return (
      property?.images?.map((image: PropertyImageEntity) => ({
        id: image.id,
        url: image.imageUrl,
      })) ?? []
    );
  }, [property?.images]);

  const existingPlans = useMemo(() => {
    return (
      property?.plans?.map((plan: PropertyPlanEntity) => ({
        id: plan.id,
        url: plan.fileUrl,
        extension: plan.extension
      })) ?? []
    );
  }, [property?.plans]);

  const initialValues: PropertyEntityCreation = useMemo(
    () => ({
      title: property?.title || '',
      location: property?.location || '',
      cityId: property?.cityId,
      categoryId: property?.categoryId,
      ownerId: property?.ownerId ?? undefined,
      bedrooms: property?.bedrooms ?? undefined,
      bathrooms: property?.bathrooms ?? undefined,
      area: property?.area ?? undefined,
      desc: property?.desc || '',
      map: property?.map || '',
      status: property?.status || 'available',
      price: property?.price || 0,
      duration: property?.duration || '',
      purpose: property?.purpose || PropertyPurpose.SALE,
      features: property?.features || [],
    }),
    [property],
  );

  const goBack = () => {
    router.back();
  };

  const onDeleteImage = (image: ExistingImageItem) => {
    deleteImage({ propertyId: id, imageId: image.id })
  };

  const onDeletePlan = (plan: ExistingFileItem) => {
    deletePlan({ propertyId: id, planId: plan.id })
  };

  const appendChangedValue = (
    formData: FormData,
    key: string,
    newValue: unknown,
    oldValue: unknown,
  ): boolean => {
    const normalizedNewValue = newValue ?? '';
    const normalizedOldValue = oldValue ?? '';

    if (String(normalizedNewValue) === String(normalizedOldValue)) {
      return false;
    }

    formData.append(key, String(normalizedNewValue));
    return true;
  };

  const onSubmit = async (
    values: PropertyEntityCreation,
    helpers: FormikHelpers<PropertyEntityCreation>,
  ) => {
    if (!property) return;

    try {
      const formData = new FormData();
      let hasChanges = false;

      hasChanges = appendChangedValue(formData, 'title', values.title, property.title,) || hasChanges;
      hasChanges = appendChangedValue(formData, 'location', values.location, property.location,) || hasChanges;
      hasChanges = appendChangedValue(formData, 'price', values.price, property.price,) || hasChanges;
      hasChanges = appendChangedValue(formData, 'bedrooms', values.bedrooms, property.bedrooms,) || hasChanges;
      hasChanges = appendChangedValue(formData, 'bathrooms', values.bathrooms, property.bathrooms,) || hasChanges;
      hasChanges = appendChangedValue(formData, 'area', values.area, property.area,) || hasChanges;
      hasChanges = appendChangedValue(formData, 'desc', values.desc, property.desc,) || hasChanges;
      hasChanges = appendChangedValue(formData, 'map', values.map, property.map,) || hasChanges;
      hasChanges = appendChangedValue(formData, 'categoryId', values.categoryId, property.categoryId) || hasChanges;
      hasChanges = appendChangedValue(formData, 'cityId', values.cityId, property.cityId,) || hasChanges;
      hasChanges = appendChangedValue(formData, 'ownerId', values.ownerId, property.ownerId) || hasChanges;
      hasChanges = appendChangedValue(formData, 'status', values.status, property.status,) || hasChanges;
      hasChanges = appendChangedValue(formData, 'purpose', values.purpose, property.purpose,) || hasChanges;
      hasChanges = appendChangedValue(formData, 'duration', values.duration, property.duration,) || hasChanges;

      const modifiedFeatures = values.features.filter((feature) => feature.state === 'created' || feature.state === 'remove',);
      if (modifiedFeatures.length > 0) { formData.append('features', JSON.stringify(values.features),); hasChanges = true; }

      if (propertyImage instanceof File) { formData.append('background', propertyImage); hasChanges = true; }
      if (propertyImage === null && property.backgroundUrl && isImageRemoved) { formData.append('removeImage', 'true'); hasChanges = true; }

      if (newImages.length > 0) { newImages.forEach((file) => { formData.append('images', file); }); hasChanges = true; }
      if (newPlans.length > 0) { newPlans.forEach((file) => { formData.append('plans', file); }); hasChanges = true; }

      if (!hasChanges) {
        return;
      }

      await mutateAsyncUpdate({ id: property.id, data: formData, });
      helpers.resetForm();

      setNewImages([]);
      setNewPlans([]);
      setPropertyImage(undefined);
    } catch (error) {
      console.error('Failed to update property:', error);
    }
  };

  const disabled = isDeletingImage || isDeletingPlan

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="العقارات"
        sub={`تعديل بيانات العقار ${property?.title || ''}`}
        actions={[
          {
            onClick: goBack,
            icon: ArrowLeft,
            variant: 'transparent',
            reverse: true,
          },
        ]}
      />

      <PageLayout>
        <Contents
          isLoading={isFetching}
          Skeletons={<Loading />}
          isEmpty={!property}
          emptyTitle="غير موجود"
          emptyDesc="عذراً، العقار غير موجود أو تم حذفه"
          emptyAction={goBack}
          emptyActionTitle="العودة"
          isError={isError}
          errorTitle="مشكلة مفاجئة"
          errorDesc="ربما حدث خطأ من السيرفر"
          errorAction={refetch}
        >
          <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:mb-6 sm:rounded-2xl sm:p-6">
            <div className="sm:hidden">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-reversed ring-4 ring-primary/20">
                    {step}
                  </div>

                  <div className="min-w-0">
                    <p className="font-sans text-xs text-muted">
                      الخطوة {step} من {PROPERTY_STEPS.length}
                    </p>

                    <h3 className="truncate font-heading text-sm font-bold text-primary">
                      {PROPERTY_STEPS[step - 1]}
                    </h3>
                  </div>
                </div>

                <span className="shrink-0 font-sans text-xs font-medium text-muted">
                  {Math.round(
                    (step / PROPERTY_STEPS.length) * 100,
                  )}
                  %
                </span>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${(step / PROPERTY_STEPS.length) * 100
                      }%`,
                  }}
                />
              </div>
            </div>

            <div className="hidden items-start sm:flex">
              {PROPERTY_STEPS.map((stepTitle, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < step;
                const isCurrent = stepNumber === step;

                return (
                  <React.Fragment key={stepTitle}>
                    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                      <div
                        className={[
                          'flex h-9 w-9 shrink-0 items-center justify-center',
                          'rounded-full font-heading text-sm font-bold transition-all',
                          isCompleted
                            ? 'bg-success text-reversed'
                            : isCurrent
                              ? 'bg-primary text-reversed ring-4 ring-primary/20'
                              : 'bg-background text-muted',
                        ].join(' ')}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          stepNumber
                        )}
                      </div>

                      <span
                        className={[
                          'w-full text-center font-sans text-xs font-medium',
                          isCurrent
                            ? 'text-primary'
                            : isCompleted
                              ? 'text-success'
                              : 'text-muted',
                        ].join(' ')}
                      >
                        {stepTitle}
                      </span>
                    </div>

                    {index < PROPERTY_STEPS.length - 1 && (
                      <div
                        className={[
                          'mx-3 mt-[18px] h-0.5 min-w-4 flex-1 transition-all',
                          isCompleted
                            ? 'bg-success'
                            : 'bg-border',
                        ].join(' ')}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-6 md:p-8">
            <div className="mb-5 flex items-start gap-3 border-b border-border pb-4 sm:mb-6 sm:items-center sm:pb-5">
              <div className="shrink-0">
                <Badge icon={Home} />
              </div>

              <div className="min-w-0">
                <h2 className="font-heading text-base font-bold text-text sm:text-lg">
                  {PROPERTY_STEPS[step - 1]}
                </h2>

                <p className="mt-1 font-sans text-xs leading-5 text-muted">
                  قم بتعديل الحقول المطلوبة ثم احفظ التغييرات
                </p>
              </div>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationPropertySchema}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({
                dirty,
                isSubmitting,
                isValid,
                values,
              }) => {
                const hasExternalChanges =
                  newImages.length > 0 ||
                  newPlans.length > 0 ||
                  propertyImage instanceof File ||
                  propertyImage === null;

                return (
                  <Form className="space-y-5 sm:space-y-6">
                    {step === 1 && (
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <InputField
                          type="text"
                          name="title"
                          label="عنوان العقار"
                          dir="rtl"
                          placeholder="مثال: شقة فاخرة للبيع"
                        />

                        <SelectorField
                          name="categoryId"
                          label="التصنيف"
                          options={categoryOptions}
                        />

                        <SelectorField
                          name="ownerId"
                          label="المالك"
                          options={ownerOptions}
                        />

                        <SelectorField
                          name="status"
                          label="حالة العقار"
                          options={PROPERTY_STATUS_OPTIONS}
                        />

                        <SelectorField
                          name="purpose"
                          label="الغرض من العقار"
                          options={PROPERTY_PURPOSE_OPTIONS}
                        />

                        {values.purpose ===
                          PropertyPurpose.RENT && (
                            <SelectorField
                              name="duration"
                              label="مدة الإيجار"
                              options={PROPERTY_DURATION_OPTIONS}
                            />
                          )}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <InputField
                          type="number"
                          name="bedrooms"
                          label="عدد غرف النوم"
                          dir="ltr"
                          placeholder="0"
                        />

                        <InputField
                          type="number"
                          name="bathrooms"
                          label="عدد دورات المياه"
                          dir="ltr"
                          placeholder="0"
                        />

                        <InputField
                          type="number"
                          name="area"
                          label="المساحة (م²)"
                          dir="ltr"
                          placeholder="0"
                        />

                        <InputField
                          type="number"
                          name="price"
                          label="السعر"
                          dir="ltr"
                          placeholder="0.00"
                        />

                        <div className="md:col-span-2">
                          <TextAreaField
                            name="desc"
                            label="وصف العقار"
                            dir="rtl"
                            placeholder="أدخل تفاصيل ووصف العقار الكامل..."
                          />
                        </div>
                      </div>
                    )}

                    {step == 3 && <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <SelectorField
                          name="cityId"
                          label="المدينة"
                          options={cityOptions}
                        />
                        <InputField
                          type="text"
                          name="location"
                          label="الموقع"
                          dir="rtl"
                          placeholder="مثال: الحي الشمالي - شارع 15"
                        />
                      </div>

                      <CustomMapField
                        name="map"
                        label="الموقع على الخريطة"
                      />
                    </div>}

                    {step === 4 && (
                      <div className="space-y-5 sm:space-y-6">
                        <SelectImageField
                          value={propertyImage}
                          setValue={(file) => { setPropertyImage(file ?? null); }}
                          label="صورة العقار"
                          existingImage={property?.backgroundUrl}
                          isImageRemoved={isImageRemoved}
                          setIsImageRemoved={setIsImageRemoved}
                        />

                        <SelectMultiFilesField
                          label="مخططات العقار"
                          newFiles={newPlans}
                          setNewFiles={setNewPlans}
                          disabled={disabled}
                          existingFiles={existingPlans}
                          maxFiles={5}
                          onDeleteExisting={onDeletePlan}
                          accept="image/*,application/pdf"
                        />

                        <SelectMultiImageField
                          label="صور العقار"
                          newFiles={newImages}
                          disabled={disabled}
                          setNewFiles={setNewImages}
                          existingImages={existingImages}
                          onDeleteExisting={onDeleteImage}
                        />
                      </div>
                    )}

                    {step === 5 && (
                      <FeaturesField
                        name="features"
                        label="مميزات العقار"
                        features={featureOptions}
                      />
                    )}

                    <div
                      className={[
                        'flex flex-col-reverse gap-3',
                        'border-t border-border pt-5',
                        'sm:flex-row sm:items-center',
                        step > 1
                          ? 'sm:justify-between'
                          : 'sm:justify-end',
                      ].join(' ')}
                    >
                      {step > 1 && (
                        <Button
                          type="button"
                          label="السابق"
                          variant="primary-outline"
                          className="w-full rounded-sm px-8 text-sm sm:w-fit"
                          onClick={() => {
                            setStep(
                              (currentStep) =>
                                currentStep - 1,
                            );
                          }}
                        />
                      )}

                      {step < PROPERTY_STEPS.length ? (
                        <Button
                          type="button"
                          label="التالي"
                          variant="primary"
                          className="w-full rounded-sm px-8 text-sm sm:w-fit"
                          onClick={() => {
                            setStep(
                              (currentStep) =>
                                currentStep + 1,
                            );
                          }}
                        />
                      ) : (
                        <div className="w-full sm:w-auto">
                          <SubmitButton
                            isDirty={
                              dirty || hasExternalChanges
                            }
                            isSubmitting={isSubmitting}
                            isValid={isValid}
                            className="w-full px-6 sm:w-auto"
                          />
                        </div>
                      )}
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Contents>
      </PageLayout>
    </div>
  );
};

export default EditPropertyForm;