"use client";

import React, { useMemo } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import InputField from "@/libraries/forms/components/InputField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import { EmployeeEntityCreation } from "@/types/entities";
import { initialEmployeeCreationValues } from "@/constants/formsValues";
import { validationEmployeeSchema } from "@/constants/formsValidations";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, UserPlus } from "lucide-react";
import PageLayout from "../../PageLayout";
import Badge from "@/components/Badge";
import { useCreateEmployee } from "@/features/useEmployees";
import { useRouter } from "next/navigation";
import { useGetAllRoles } from "@/features/useRoles";
import SelectorField from "@/libraries/forms/components/SelectorField";

export const AddEmployeeForm: React.FC = () => {
  const router = useRouter();

  const { data } = useGetAllRoles()
  const { mutateAsync } = useCreateEmployee();

  const goBack = () => router.back();

  const onSubmit = async (
    values: EmployeeEntityCreation,
    helpers: FormikHelpers<EmployeeEntityCreation>
  ) => {
    try {
      await mutateAsync(values);
      helpers.resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const rolesOptions = useMemo(() => (data?.data || []).map(r => ({ value: r.id, key: r.name })), [data])

  return (
    <div className="space-y-6">
      <PageHeader
        title="الموظفون"
        sub="إضافة موظف جديد للنظام"
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
                بيانات الموظف
              </h2>
              <p className="font-sans text-xs text-muted">
                يرجى إدخال البيانات الأساسية وحساب الدخول للموظف
              </p>
            </div>
          </div>

          <Formik
            initialValues={initialEmployeeCreationValues}
            validationSchema={validationEmployeeSchema}
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

                  <InputField
                    type="password"
                    name="password"
                    label="كلمة المرور"
                    dir="ltr"
                    placeholder="••••••••"
                  />

                  <SelectorField
                    name="roleId"
                    label="الصلاحيات"
                    dir="ltr"
                    options={rolesOptions}
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

export default AddEmployeeForm;