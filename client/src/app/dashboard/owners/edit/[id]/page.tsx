"use client";

import React from "react";
import { Formik, Form } from "formik";
import InputField from "@/libraries/forms/components/InputField";
import SelectorField from "@/libraries/forms/components/SelectorField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import { CityEntity, OwnerEntityCreation } from "@/types/entities";
import { validationOwnerSchema } from "@/constants/formsValidations";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, UserCheck } from "lucide-react";
import Badge from "@/components/Badge";
import { useGetOwnerById, useUpdateOwner } from "@/features/useOwners";
import { useGetAllCities } from "@/features/useGovernorate";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/app/dashboard/PageLayout";
import Contents from "@/app/dashboard/Contents";
import CitiesOptionsLoading from "../../CitiesOptionsLoading";
import Loading from "./Loading";

export const EditOwnerForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { mutateAsync } = useUpdateOwner();
  const { data: cityData, isLoading: isCitiesLoading } = useGetAllCities();
  const { data, isFetching, isError, refetch } = useGetOwnerById(id);

  const owner = data?.data;
  const cityOptions = (cityData?.data || []).map((c: CityEntity) => ({
    key: c.name,
    value: c.id,
  }));

  const goBack = () => router.back();

  const onSubmit = async (values: OwnerEntityCreation) => {
    if (!owner) return;

    const updatedFields: Partial<OwnerEntityCreation> = {};
    if (values.fullName !== owner.fullName) updatedFields.fullName = values.fullName;
    if (values.phone !== owner.phone) updatedFields.phone = values.phone;
    if (values.email !== owner.email) updatedFields.email = values.email;
    if (values.cityId !== (owner?.city?.id || "")) updatedFields.cityId = values.cityId;

    if (Object.keys(updatedFields).length > 0) {
      try {
        await mutateAsync({ id: owner.id, data: updatedFields });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="المُلاّك"
        sub={`تعديل بيانات المالك ${owner?.fullName || ""}`}
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
          isEmpty={!owner}
          emptyTitle="غير موجود"
          emptyDesc="عذراً, المالك غير موجود, أو تم حذفه"
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
                  تحديث بيانات المالك
                </h2>
                <p className="font-sans text-xs text-muted">
                  قم بتعديل الحقول المطلوبة ثم اضغط حفظ التغييرات
                </p>
              </div>
            </div>

            <Formik
              initialValues={{
                ...owner!,
                cityId: owner?.city?.id || 0
              }}
              validationSchema={validationOwnerSchema}
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

export default EditOwnerForm;