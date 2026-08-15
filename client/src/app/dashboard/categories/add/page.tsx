"use client";

import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import InputField from "@/libraries/forms/components/InputField";
import IconSelectionField from "@/libraries/forms/components/IconSelectionField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import { CategoryENtityCreation } from "@/types/entities";
import { initialCategoryCreationValues } from "@/constants/formsValues";
import { validationCategorySchema } from "@/constants/formsValidations";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, FolderPlus } from "lucide-react";
import PageLayout from "../../PageLayout";
import Badge from "@/components/Badge";
import { useCreateCategory } from "@/features/useCategories";
import { useRouter } from "next/navigation";

export const AddCategoryForm: React.FC = () => {
  const router = useRouter();
  const { mutateAsync } = useCreateCategory();

  const goBack = () => router.back();

  const onSubmit = async (
    values: CategoryENtityCreation,
    helpers: FormikHelpers<CategoryENtityCreation>
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
        title="التصنيفات"
        sub="إضافة تصنيف جديد للنظام"
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
            <Badge icon={FolderPlus} />

            <div>
              <h2 className="font-heading text-lg font-bold text-text">
                بيانات التصنيف
              </h2>
              <p className="font-sans text-xs text-muted">
                يرجى إدخال اسم التصنيف واختيار الأيقونة المناسبة
              </p>
            </div>
          </div>

          <Formik
            initialValues={initialCategoryCreationValues}
            validationSchema={validationCategorySchema}
            onSubmit={onSubmit}
          >
            {({ dirty, isSubmitting, isValid }) => (
              <Form className="space-y-6">
                <div className="space-y-6">
                  <div className="max-w-md">
                    <InputField
                      type="text"
                      name="name"
                      label="اسم التصنيف"
                      dir="rtl"
                      placeholder="مثال: العقارات السكنية"
                    />
                  </div>

                  <IconSelectionField
                    name="icon"
                    label="أيقونة التصنيف"
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

export default AddCategoryForm;