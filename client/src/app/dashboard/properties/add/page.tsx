"use client";

import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { ArrowLeft, Check, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import InputField from "@/libraries/forms/components/InputField";
import SelectorField from "@/libraries/forms/components/SelectorField";
import TextAreaField from "@/libraries/forms/components/TextAreaField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import Button from "@/libraries/forms/components/Button";
import { CategoryEntity, CityEntity, OwnerEntity, PropertyEntityCreation, PropertyFeatureEntity, } from "@/types/entities";
import { initialPropertyCreationValues } from "@/constants/formsValues";
import { validationPropertySchema } from "@/constants/formsValidations";
import PageHeader from "@/components/PageHeader";
import PageLayout from "../../PageLayout";
import Badge from "@/components/Badge";
import { useCreateProperty } from "@/features/useProperties";
import { useGetAllCities } from "@/features/useGovernorate";
import { useGetAllCategories } from "@/features/useCategories";
import { useGetOwnersIdentifiers } from "@/features/useOwners";
import FeaturesField from "../FeaturesCustomeField";
import SelectMultiImageField from "../SelectMutliImageField";
import { PropertyPurpose } from "@/types/variables";
import SelectImageField from "@/libraries/forms/components/SelectImageField";
import { PROPERTY_DURATION_OPTIONS, PROPERTY_PURPOSE_OPTIONS, PROPERTY_STATUS_OPTIONS } from "@/constants/global";
import { PROPERTY_STEPS } from "../global";
import CustomMapField from "../CustomMapField";
import SelectMultiFilesField from "../SelectMutliFilesField";
import { useGetAllPropertyFeatures } from "@/features/useFeatures";

export const AddPropertyForm: React.FC = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPlans, setNewPlans] = useState<File[]>([]);
  const [productImage, setProductImage] = useState<File | null | undefined>(undefined);

  const { mutateAsync } = useCreateProperty();
  const { data: featureData } = useGetAllPropertyFeatures()
  const { data: cityData } = useGetAllCities();
  const { data: categoryData } = useGetAllCategories();
  const { data: ownerData } = useGetOwnersIdentifiers({ enable: true });

  const featureOptions = (featureData?.data || []).map((feature: PropertyFeatureEntity) => ({
    name: feature.name,
    id: feature.id,
  }));

  const cityOptions = (cityData?.data || []).map((city: CityEntity) => ({
    key: city.name,
    value: city.id,
  }));

  const categoryOptions = (categoryData?.data || []).map(
    (category: CategoryEntity) => ({
      key: category.name,
      value: category.id,
    })
  );

  const ownerOptions = (ownerData?.data || []).map((owner: OwnerEntity) => ({
    key: owner.fullName,
    value: owner.id,
  }));

  const goBack = () => router.back();

  const onSubmit = async (
    values: PropertyEntityCreation,
    helpers: FormikHelpers<PropertyEntityCreation>
  ) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          key !== "features" &&
          key !== "ownerId"
        ) {
          formData.append(key, String(value));
        }
      });

      if (values.ownerId) {
        formData.append("ownerId", String(values.ownerId));
      }

      formData.append("features", JSON.stringify(values.features));

      if (productImage instanceof File) {
        formData.append("background", productImage);
      }

      newImages.forEach((file) => {
        formData.append("images", file);
      });

      newPlans.forEach((file) => {
        formData.append("plans", file);
      });

      await mutateAsync(formData);

      helpers.resetForm();
      setNewImages([]);
      setNewPlans([]);

      setProductImage(undefined);

      setStep(1);
    } catch (error) {
      console.error("Failed to create property:", error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="العقارات"
        sub="إضافة عقار جديد للنظام"
        actions={[
          {
            onClick: goBack,
            icon: ArrowLeft,
            variant: "transparent",
            reverse: true,
          },
        ]}
      />

      <PageLayout>
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
                {Math.round((step / PROPERTY_STEPS.length) * 100)}%
              </span>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${(step / PROPERTY_STEPS.length) * 100}%`,
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
                        "flex h-9 w-9 shrink-0 items-center justify-center",
                        "rounded-full font-heading text-sm font-bold transition-all",
                        isCompleted
                          ? "bg-success text-reversed"
                          : isCurrent
                            ? "bg-primary text-reversed ring-4 ring-primary/20"
                            : "bg-background text-muted",
                      ].join(" ")}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        stepNumber
                      )}
                    </div>

                    <span
                      className={[
                        "w-full text-center font-sans text-xs font-medium",
                        isCurrent
                          ? "text-primary"
                          : isCompleted
                            ? "text-success"
                            : "text-muted",
                      ].join(" ")}
                    >
                      {stepTitle}
                    </span>
                  </div>

                  {index < PROPERTY_STEPS.length - 1 && (
                    <div
                      className={[
                        "mx-3 mt-[18px] h-0.5 min-w-4 flex-1 transition-all",
                        isCompleted ? "bg-success" : "bg-border",
                      ].join(" ")}
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
                يرجى ملء الحقول المطلوبة للانتقال للخطوة التالية
              </p>
            </div>
          </div>

          <Formik
            initialValues={initialPropertyCreationValues}
            validationSchema={validationPropertySchema}
            onSubmit={onSubmit}
          >
            {({ dirty, isSubmitting, isValid, values }) => (
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

                    {values.purpose === PropertyPurpose.RENT && (
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
                      value={productImage ?? undefined}
                      setValue={(file) => setProductImage(file ?? null)}
                      label="صورة العقار"
                    />

                    <SelectMultiFilesField
                      label="مخططات العقار"
                      newFiles={newPlans}
                      setNewFiles={setNewPlans}
                      existingFiles={[]}
                      maxFiles={5}
                      accept="image/*,application/pdf"
                    />

                    <SelectMultiImageField
                      label="صور العقار"
                      newFiles={newImages}
                      setNewFiles={setNewImages}
                      maxImages={5}
                      existingImages={[]}
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
                    "flex flex-col-reverse gap-3",
                    "border-t border-border pt-5",
                    "sm:flex-row sm:items-center",
                    step > 1 ? "sm:justify-between" : "sm:justify-end",
                  ].join(" ")}
                >
                  {step > 1 && (
                    <Button
                      type="button"
                      label="السابق"
                      variant="primary-outline"
                      className="w-full rounded-sm px-8 text-sm sm:w-fit"
                      onClick={() =>
                        setStep((currentStep) => currentStep - 1)
                      }
                    />
                  )}

                  {step < PROPERTY_STEPS.length ? (
                    <Button
                      type="button"
                      label="التالي"
                      variant="primary"
                      className="w-full rounded-sm px-8 text-sm sm:w-fit"
                      onClick={() =>
                        setStep((currentStep) => currentStep + 1)
                      }
                    />
                  ) : (
                    <div className="w-full sm:w-auto">
                      <SubmitButton
                        isDirty={
                          dirty ||
                          newImages.length > 0 ||
                          productImage instanceof File
                        }
                        isSubmitting={isSubmitting}
                        isValid={isValid}
                        className="w-full px-6 sm:w-auto"
                      />
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </PageLayout>
    </div>
  );
};

export default AddPropertyForm;