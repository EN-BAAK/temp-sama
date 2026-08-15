"use client";

import React from "react";
import { Formik, Form } from "formik";
import InputField from "@/libraries/forms/components/InputField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import { EmployeeEntity } from "@/types/entities";
import { validationEmployeeUpdateSchema } from "@/constants/formsValidations";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, UserCheck } from "lucide-react";
import Badge from "@/components/Badge";
import { useGetEmployeeById, useUpdateEmployee } from "@/features/useEmployees";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/app/dashboard/PageLayout";
import Contents from "@/app/dashboard/Contents";
import Loading from "./Loading";

export const EditEmployeeForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { mutateAsync } = useUpdateEmployee();
  const { data, isFetching, isError, refetch } = useGetEmployeeById(id);

  const employee = data?.data;

  const goBack = () => router.back();

  const onSubmit = async (values: Partial<EmployeeEntity>) => {
    if (!employee) return;

    const updatedFields: Partial<EmployeeEntity> = {};
    if (values.fullName !== employee.fullName) updatedFields.fullName = values.fullName;
    if (values.phone !== employee.phone) updatedFields.phone = values.phone;
    if (values.email !== employee.email) updatedFields.email = values.email;

    if (Object.keys(updatedFields).length > 0) {
      try {
        await mutateAsync({ id: employee.id, data: updatedFields });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="الموظفون"
        sub={`تعديل بيانات الموظف ${employee?.fullName || ""}`}
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
          isEmpty={!employee}
          emptyTitle="غير موجود"
          emptyDesc="عذراً, الموظف غير موجود, أو تم حذفه"
          emptyAction={goBack}
          emptyActionTitle="العودة"
          isError={isError}
          errorTitle="مشكلة مفاجئة"
          errorDesc="ربما حدث خطأ من السيرفر"
          errorAction={refetch}
        >
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
              <Badge icon={UserCheck} />

              <div>
                <h2 className="font-heading text-lg font-bold text-text">
                  تحديث بيانات الموظف
                </h2>
                <p className="font-sans text-xs text-muted">
                  قم بتعديل الحقول المطلوبة ثم اضغط حفظ التغييرات
                </p>
              </div>
            </div>

            <Formik
              initialValues={{
                fullName: employee?.fullName || "",
                phone: employee?.phone || "",
                email: employee?.email || "",
              }}
              validationSchema={validationEmployeeUpdateSchema}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({ dirty, isSubmitting, isValid }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <InputField
                      type="text"
                      name="fullName"
                      label="الاسم الكامل"
                      dir="rtl"
                      placeholder="مثال: محمد علي"
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

export default EditEmployeeForm;


