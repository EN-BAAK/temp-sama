"use client";

import React from "react";
import { Formik, Form } from "formik";
import InputField from "@/libraries/forms/components/InputField";
import SelectorField from "@/libraries/forms/components/SelectorField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import { CityEntity, ClientEntityCreation } from "@/types/entities";
import { validationClientSchema } from "@/constants/formsValidations";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, UserCheck } from "lucide-react";
import Badge from "@/components/Badge";
import { useGetClientById, useUpdateClient } from "@/features/useClients";
import { useGetAllCities } from "@/features/useGovernorate";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/app/dashboard/PageLayout";
import Contents from "@/app/dashboard/Contents";
import CitiesOptionsLoading from "../../CitiesOptionsLoading";
import Loading from "./Loading";

export const EditClientForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { mutateAsync } = useUpdateClient();
  const { data: cityData, isLoading: isCitiesLoading } = useGetAllCities();
  const { data, isFetching, isError, refetch } = useGetClientById(id)

  const client = data?.data;
  const cityOptions = (cityData?.data || []).map((c: CityEntity) => ({ key: c.name, value: c.id }))

  const goBack = () => router.back()

  const onSubmit = async (values: ClientEntityCreation) => {
    if (!client) return;

    const updatedFields: Partial<ClientEntityCreation> = {};
    if (values.fullName !== client.fullName) updatedFields.fullName = values.fullName;
    if (values.phone !== client.phone) updatedFields.phone = values.phone;
    if (values.email !== client.email) updatedFields.email = values.email;
    if (values.cityId !== (client?.city?.id || 0)) updatedFields.cityId = values.cityId;
    if (values.budget !== client.budget) updatedFields.budget = values.budget;

    if (Object.keys(updatedFields).length > 0) {
      try {
        await mutateAsync({ id: client.id, data: updatedFields });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="العملاء"
        sub={`تعديل بيانات العميل ${client?.fullName}`}
        actions={[
          {
            onClick: goBack,
            icon: ArrowLeft,
            variant: "transparent",
            reverse: true
          }
        ]}
      />

      <PageLayout>
        <Contents
          isLoading={isFetching}
          Skeletons={<Loading />}
          isEmpty={!client}
          emptyTitle="غير موجود"
          emptyDesc="عذراً, العميل غير موجود, أو تم حذفه"
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
                  تحديث بيانات العميل
                </h2>
                <p className="font-sans text-xs text-muted">
                  قم بتعديل الحقول المطلوبة ثم اضغط حفظ التغييرات
                </p>
              </div>
            </div>

            <Formik
              initialValues={{
                ...client!,
                cityId: client?.city?.id || 0,
                budget: client?.budget || undefined,
              }}
              validationSchema={validationClientSchema}
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

export default EditClientForm;