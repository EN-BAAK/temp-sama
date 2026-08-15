"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import { validationGovernorateSchema } from "@/constants/formsValidations";
import { useGetGovernorateById, useUpdateGovernorate, useDeleteCity, useUpdateCity, useCreateCity } from "@/features/useGovernorate";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Building2, Plus, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Contents from "@/app/dashboard/Contents";
import { CityEntity, CityEntityCreation, GovernorateEntity } from "@/types/entities";
import InputField from "@/libraries/forms/components/InputField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import PageLayout from "@/app/dashboard/PageLayout";
import { useAppContext } from "@/libraries/project-provider/AppProvider";
import City from "./City";
import { ID } from "@/types/global";
import Button from "@/libraries/forms/components/Button";
import CityModal from "./modifyCity";
import Badge from "@/components/Badge";

export const EditGovernorateForm: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { showWarning } = useAppContext()

  const id = Number(params.id);

  const { mutateAsync: updateGovernorate } = useUpdateGovernorate();
  const { mutateAsync: deleteCity, isPending: isDeletingCity } = useDeleteCity();
  const { mutateAsync: createCity } = useCreateCity();
  const { mutateAsync: updateCity } = useUpdateCity();
  const gov = useGetGovernorateById(id)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<CityEntity | null>(null);

  const goBack = () => router.back();

  const onSubmit = async (values: GovernorateEntity) => {
    if (!gov) return;

    try {
      await updateGovernorate({ id: gov.id, data: values });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCityModalSubmit = async (values: CityEntityCreation) => {
    if (!gov) return;

    try {
      if (selectedCity) {
        await updateCity({
          cityId: selectedCity.id,
          governorateId: gov.id,
          data: values,
        });
      } else {
        await createCity({
          governorateId: gov.id,
          data: values,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCity = (city: CityEntity) => {
    setSelectedCity(city);
    setIsModalOpen(true);
  };

  const handleAddCity = () => {
    setSelectedCity(null);
    setIsModalOpen(true);
  };

  const handleDeleteCity = async (cityId: ID, cityName: string) => {
    if (!gov) return;

    showWarning({
      message: `هل أنت متأكد من حذف مدينة "${cityName}" نهائياً؟`,
      btn1: "إغلاق",
      btn2: "حذف",
      handleBtn2: () => deleteCity({ cityId, governorateId: gov.id }),
    });
  };

  return (
    <Contents
      isLoading={false}
      Skeletons={<div />}
      isEmpty={!gov}
      emptyTitle="غير موجود"
      emptyDesc="عذراً، هذه المحافظة غير موجودة او تم حذفها"
      emptyAction={goBack}
      emptyActionTitle="العودة"
      isError={false}
      errorTitle="مشكلة مفاجئة"
      errorDesc="ربما حدث خطأ من السيرفر"
    >
      <div className="space-y-6">
        <PageHeader
          title="المحافظات"
          sub={`تعديل محافظة ${gov?.name ?? ""}`}
          actions={[
            {
              onClick: goBack,
              icon: ArrowLeft,
              variant: "transparent",
              reverse: true
            }
          ]} />

        <PageLayout className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
              <Badge icon={MapPin} />

              <div>
                <h2 className="font-heading text-lg font-bold text-text">
                  بيانات المحافظة
                </h2>
                <p className="font-sans text-xs text-muted">
                  يرجى تعديل اسم المحافظة بدقة ليتم ربط المدن بها لاحقاً
                </p>
              </div>
            </div>

            <Formik
              initialValues={{
                id: gov?.id ?? 0,
                name: gov?.name ?? "",
                cities: gov?.cities ?? [],
              }}
              validationSchema={validationGovernorateSchema}
              onSubmit={onSubmit}
              enableReinitialize
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
                      label="انشاء"
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6  flex items-center justify-between border-b border-border pb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Badge icon={Building2} />

                <div>
                  <h2 className="font-heading text-lg font-bold text-text">
                    المدن التابعة للمحافظة
                  </h2>
                  <p className="font-sans text-xs text-muted">
                    قائمة بالمدن التابعة لهذه المحافظة وإمكانية تعديلها أو حذفها
                  </p>
                </div>
              </div>

              <Button
                onClick={handleAddCity}
                label="اضف مدينة"
                icon={Plus}
                className="w-fit"
              />
            </div>

            {!gov?.cities || gov.cities.length === 0 ? (
              <div className="py-8 text-center font-sans text-sm text-muted">
                لا توجد مدن مسجلة هذه المحافظة حالياً.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right dir-rtl">
                  <thead className="bg-background2">
                    <tr className="border-b border-border text-xs text-muted">
                      <th className="px-4 py-3 font-medium">الرقم التعريفى</th>
                      <th className="px-4 py-3 font-medium">اسم المدينة</th>
                      <th className="px-4 py-3 font-medium text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gov.cities.map((city) => (
                      <City
                        key={city.id}
                        city={city}
                        handleEdit={handleEditCity}
                        handleDelete={handleDeleteCity}
                        isLoading={isDeletingCity}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </PageLayout>
      </div>

      <CityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCity={selectedCity}
        onSubmit={handleCityModalSubmit}
      />
    </Contents>
  );
};

export default EditGovernorateForm;