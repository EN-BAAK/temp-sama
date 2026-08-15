"use client";

import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import InputField from "@/libraries/forms/components/InputField";
import SelectorField from "@/libraries/forms/components/SelectorField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import { CityEntity, ClientEntityCreation } from "@/types/entities";
import { initialClientCreationValues } from "@/constants/formsValues";
import { validationClientSchema } from "@/constants/formsValidations";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, UserPlus } from "lucide-react";
import PageLayout from "../../PageLayout";
import Badge from "@/components/Badge";
import { useCreateClient } from "@/features/useClients";
import { useGetAllCities } from "@/features/useGovernorate";
import CitiesOptionsLoading from "../CitiesOptionsLoading";
import { useRouter } from "next/navigation";

export const AddClientForm: React.FC = () => {
  const router = useRouter()
  const { mutateAsync } = useCreateClient();
  const { data: cityData, isLoading: isCitiesLoading } = useGetAllCities();

  const cityOptions = (cityData?.data || []).map((c: CityEntity) => ({ key: c.name, value: c.id }))

  const goBack = () => router.back()

  const onSubmit = async (
    values: ClientEntityCreation,
    helpers: FormikHelpers<ClientEntityCreation>
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
        title="العملاء"
        sub="إضافة عميل جديد للنظام"
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
            <Badge icon={UserPlus} />

            <div>
              <h2 className="font-heading text-lg font-bold text-text">
                بيانات العميل
              </h2>
              <p className="font-sans text-xs text-muted">
                يرجى إدخال تفاصيل العميل والمدينة التابع لها
              </p>
            </div>
          </div>

          <Formik
            initialValues={initialClientCreationValues}
            validationSchema={validationClientSchema}
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
                    placeholder="مثال: أحمد محمود"
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

                  <InputField
                    type="number"
                    name="budget"
                    label="الميزانية"
                    dir="ltr"
                    placeholder="0.00"
                  />
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

export default AddClientForm;