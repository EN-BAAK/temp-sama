"use client";

import React from "react";
import { Formik, Form } from "formik";
import InputField from "@/libraries/forms/components/InputField";
import IconSelectionField from "@/libraries/forms/components/IconSelectionField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import { CategoryENtityCreation } from "@/types/entities";
import { validationCategorySchema } from "@/constants/formsValidations";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, FolderCheck } from "lucide-react";
import Badge from "@/components/Badge";
import { useGetCategoryById, useUpdateCategory } from "@/features/useCategories";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/app/dashboard/PageLayout";
import Contents from "@/app/dashboard/Contents";
import Loading from "./Loading";

export const EditCategoryForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { mutateAsync } = useUpdateCategory();
  const { data, isFetching, isError, refetch } = useGetCategoryById(id);

  const category = data?.data;

  const goBack = () => router.back();

  const onSubmit = async (values: CategoryENtityCreation) => {
    if (!category) return;

    const updatedFields: Partial<CategoryENtityCreation> = {};
    if (values.name !== category.name) updatedFields.name = values.name;
    if (values.icon !== category.icon) updatedFields.icon = values.icon;

    if (Object.keys(updatedFields).length > 0) {
      try {
        await mutateAsync({ id: category.id, data: updatedFields });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="التصنيفات"
        sub={`تعديل بيانات التصنيف ${category?.name || ""}`}
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
        <Contents
          isLoading={isFetching}
          Skeletons={<Loading />}
          isEmpty={!category}
          emptyTitle="غير موجود"
          emptyDesc="عذراً, التصنيف غير موجود, أو تم حذفه"
          emptyAction={goBack}
          emptyActionTitle="العودة"
          isError={isError}
          errorTitle="مشكلة مفاجئة"
          errorDesc="ربما حدث خطأ من السيرفر"
          errorAction={refetch}
        >
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
              <Badge icon={FolderCheck} />

              <div>
                <h2 className="font-heading text-lg font-bold text-text">
                  تحديث بيانات التصنيف
                </h2>
                <p className="font-sans text-xs text-muted">
                  قم بتعديل الحقول المطلوبة ثم اضغط حفظ التغييرات
                </p>
              </div>
            </div>

            <Formik
              initialValues={{
                name: category?.name || "",
                icon: category?.icon || "",
              }}
              validationSchema={validationCategorySchema}
              onSubmit={onSubmit}
              enableReinitialize
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
        </Contents>
      </PageLayout>
    </div>
  );
};

export default EditCategoryForm;