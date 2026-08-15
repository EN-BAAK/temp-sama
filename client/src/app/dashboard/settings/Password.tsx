"use client";

import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { Lock, ShieldCheck } from "lucide-react";
import InputField from "@/libraries/forms/components/InputField";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import { useChangePassword } from "@/features/useAuth";
import { ResetPasswordProps } from "@/types/forms";
import { initialChangePasswordValues } from "@/constants/formsValues";
import { validationChangePasswordSchema } from "@/constants/formsValidations";

type CustomResetPasswordType = {
  confirmPassword: string;
} & ResetPasswordProps;

const Password: React.FC = () => {
  const { mutateAsync } = useChangePassword();

  const onSubmit = async (
    values: CustomResetPasswordType,
    helpers: FormikHelpers<CustomResetPasswordType>
  ) => {
    try {
      await mutateAsync({
        newPassword: values.newPassword,
        password: values.password,
      });
      helpers.resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="bg-card p-5 rounded-md shadow-md">
      <div className="mb-6 flex gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="size-5" />
        </div>

        <div>
          <h2 className="font-rubik text-lg font-semibold text-text">
            تعديل كلمة المرور
          </h2>

          <p className="text-sm text-muted-foreground">
            تعديل كلمة المرور الخاصة بك، حاول أن تجعل كلمة المرور قوية ولا تشاركها مع أحد
          </p>
        </div>
      </div>

      <Formik
        initialValues={initialChangePasswordValues}
        validationSchema={validationChangePasswordSchema}
        onSubmit={onSubmit}
      >
        {({ dirty, isSubmitting, isValid }) => (
          <Form className="space-y-5">
            <InputField
              required
              type="password"
              name="password"
              label="كلمة المرور الحالية"
              placeholder="••••••••"
              dir="ltr"
              Icon={<Lock className="size-4" />}
            />

            <InputField
              required
              type="password"
              name="newPassword"
              label="كلمة المرور الجديدة"
              placeholder="••••••••"
              dir="ltr"
              Icon={<Lock className="size-4" />}
            />

            <InputField
              required
              type="password"
              name="confirmPassword"
              label="تأكيد كلمة المرور الجديدة"
              placeholder="••••••••"
              dir="ltr"
              Icon={<Lock className="size-4" />}
            />

            <div className="flex justify-end pt-3">
              <SubmitButton
                isDirty={dirty}
                isSubmitting={isSubmitting}
                isValid={isValid}
                className="w-fit px-4"
                label="تعديل كلمة المرور"
              />
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default Password;