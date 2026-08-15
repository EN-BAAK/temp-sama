"use client";

import React from "react";
import { Formik, Form } from "formik";
import { X, Building2 } from "lucide-react";
import { CityEntity, CityEntityCreation } from "@/types/entities";
import InputField from "@/libraries/forms/components/InputField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import { validationCitySchema, } from "@/constants/formsValidations";
import { initialCityCreationValues } from "@/constants/formsValues";
import Button from "@/libraries/forms/components/Button";
import Badge from "@/components/Badge";

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityEntity | null;
  onSubmit: (values: CityEntityCreation) => Promise<void>;
}

export const CityModal: React.FC<CityModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const isEditMode = Boolean(selectedCity);

  const initialValues: CityEntityCreation = isEditMode && selectedCity
    ? { name: selectedCity.name }
    : initialCityCreationValues;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl dir-rtl">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Badge icon={Building2} />

            <div>
              <h3 className="font-heading text-lg font-bold text-text">
                {isEditMode ? "تعديل مدينة" : "إضافة مدينة جديدة"}
              </h3>
              <p className="font-sans text-xs text-muted">
                {isEditMode ? "تعديل اسم المدينة الحالية" : "أدخل اسم المدينة التابعة لهذه المحافظة"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={onClose}
            icon={X}
            variant="transparent"
            className="w-fit"
          >
          </Button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationCitySchema}
          onSubmit={async (values, { resetForm }) => {
            await onSubmit(values);
            resetForm();
            onClose();
          }}
          enableReinitialize
        >
          {({ dirty, isSubmitting, isValid }) => (
            <Form className="space-y-6">
              <InputField
                type="text"
                name="name"
                label="اسم المدينة"
                dir="rtl"
                placeholder="مثال: الميدان الزاهرة باب توما..."
              />

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <SubmitButton
                  isDirty={dirty}
                  isSubmitting={isSubmitting}
                  isValid={isValid}
                  label="انشاء"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CityModal;