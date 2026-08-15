"use client";

import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import InputField from "@/libraries/forms/components/InputField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import { GovernorateEntityCreation } from "@/types/entities";
import { useCreateGovernorate } from "@/features/useGovernorate";
import { initialGovernorateCreationValues } from "@/constants/formsValues";
import { validationGovernorateSchema } from "@/constants/formsValidations";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, MapPin } from "lucide-react";
import PageLayout from "../../PageLayout";
import Badge from "@/components/Badge";
import { useRouter } from "next/navigation";

export const AddGovernorateForm: React.FC = () => {
  const router = useRouter()
  const { mutateAsync } = useCreateGovernorate();

  const goBack = () => router.back()

  const onSubmit = async (
    values: GovernorateEntityCreation,
    helpers: FormikHelpers<GovernorateEntityCreation>
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
        title="المحافظات"
        sub="إضافة محافظة جديدة للنظام"
        actions={[
          {
            onClick: goBack,
            icon: ArrowLeft,
            variant: "transparent",
            reverse: true
          }
        ]} />

      <PageLayout>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
            <Badge icon={MapPin} />

            <div>
              <h2 className="font-heading text-lg font-bold text-text">
                بيانات المحافظة
              </h2>
              <p className="font-sans text-xs text-muted">
                يرجى إدخال اسم المحافظة بدقة ليتم ربط المدن بها لاحقاً
              </p>
            </div>
          </div>

          <Formik
            initialValues={initialGovernorateCreationValues}
            validationSchema={validationGovernorateSchema}
            onSubmit={onSubmit}
          >
            {({ dirty, isSubmitting, isValid }) => (
              <Form className="space-y-6">
                <div className="max-w-md">
                  <InputField
                    type="text"
                    name="name"
                    label="اسم المحافظة"
                    dir="rtl"
                    placeholder="مثال: الرياض، القاهرة..."
                  />
                </div>

                <div className="flex items-center justify-end border-t border-border pt-5">
                  <SubmitButton
                    isDirty={dirty}
                    isSubmitting={isSubmitting}
                    isValid={isValid}
                    className="px-6"
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

export default AddGovernorateForm;