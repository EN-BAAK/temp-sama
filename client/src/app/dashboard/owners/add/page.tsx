"use client";

import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import InputField from "@/libraries/forms/components/InputField";
import SelectorField from "@/libraries/forms/components/SelectorField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import { CityEntity, OwnerEntityCreation } from "@/types/entities";
import { initialOwnerCreationValues } from "@/constants/formsValues";
import { validationOwnerSchema } from "@/constants/formsValidations";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, UserPlus } from "lucide-react";
import PageLayout from "../../PageLayout";
import Badge from "@/components/Badge";
import { useCreateOwner } from "@/features/useOwners";
import { useGetAllCities } from "@/features/useGovernorate";
import CitiesOptionsLoading from "../CitiesOptionsLoading";
import { useRouter } from "next/navigation";

export const AddOwnerForm: React.FC = () => {
  const router = useRouter();
  const { mutateAsync } = useCreateOwner();
  const { data: cityData, isLoading: isCitiesLoading } = useGetAllCities();

  const cityOptions = (cityData?.data || []).map((c: CityEntity) => ({
    key: c.name,
    value: c.id,
  }));

  const goBack = () => router.back();

  const onSubmit = async (
    values: OwnerEntityCreation,
    helpers: FormikHelpers<OwnerEntityCreation>
  ) => {
    try {
      await mutateAsync(values);
      helpers.resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="المُلاّك"
        sub="إضافة مالك جديد للنظام"
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
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
            <Badge icon={UserPlus} />

            <div>
              <h2 className="font-heading text-lg font-bold text-text">
                بيانات المالك
              </h2>
              <p className="font-sans text-xs text-muted">
                يرجى إدخال تفاصيل المالك والمدينة التابع لها
              </p>
            </div>
          </div>

          <Formik
            initialValues={initialOwnerCreationValues}
            validationSchema={validationOwnerSchema}
            onSubmit={onSubmit}
          >
            {({ dirty, isSubmitting, isValid }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputField
                    type="text"
                    name="fullName"
                    label="الاسم الكامل"
                    dir="rtl"
                    placeholder="مثال: خالد العبدالله"
                  />

                  <InputField
                    type="text"
                    name="phone"
                    label="رقم الهاتف"
                    dir="ltr"
                    placeholder="05XXXXXXXX"
                  />

                  <InputField
                    type="email"
                    name="email"
                    label="البريد الإلكتروني"
                    dir="ltr"
                    placeholder="example@domain.com"
                  />

                  {isCitiesLoading ? (
                    <CitiesOptionsLoading />
                  ) : (
                    <SelectorField
                      name="cityId"
                      label="المدينة"
                      options={cityOptions}
                    />
                  )}
                </div>

                <div className="flex items-center justify-end border-t border-border pt-5">
                  <SubmitButton
                    isDirty={dirty}
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </PageLayout>
    </div>
  );
};

export default AddOwnerForm;