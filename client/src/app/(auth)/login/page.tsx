'use client';

import React from 'react';
import Link from 'next/link';
import { Formik, Form, FormikHelpers } from 'formik';
import { Mail, Lock, Building2 } from 'lucide-react';
import InputField from '@/libraries/forms/components/InputField';
import SubmitButton from '@/libraries/forms/components/SubmitButton';
import { LoginProps } from '@/types/forms';
import { useLogin } from '@/features/useAuth';
import { loginInItalValues } from '@/constants/formsValues';
import { loginValidationSchema } from '@/constants/formsValidations';

const LoginPage: React.FC = () => {
  const { mutateAsync: login, isPending } = useLogin();

  const onSubmit = async (
    values: LoginProps,
    formik: FormikHelpers<LoginProps>
  ) => {
    try {
      await login(values);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      formik.setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-4 py-12 font-sans">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-text">
            تسجيل الدخول
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            أدخل بيانات حسابك للمتابعة وإدارة نظام العقارات
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Formik
            initialValues={loginInItalValues}
            validationSchema={loginValidationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, dirty, isValid }) => (
              <Form className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-text">
                    البريد الإلكتروني
                  </label>
                  <InputField
                    name="email"
                    type="email"
                    placeholder="example@domain.com"
                    Icon={<Mail className="h-4 w-4 text-muted" />}
                    dir="ltr"
                    innerDivStyle="relative"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-text">
                    كلمة المرور
                  </label>
                  <InputField
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    Icon={<Lock className="h-4 w-4 text-muted" />}
                    dir="ltr"
                    innerDivStyle="relative"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex cursor-pointer items-center gap-2 text-muted select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer focus:ring-primary/20"
                    />
                    <span>تذكرني</span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="font-medium text-primary transition-colors hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>

                <div className="pt-2">
                  <SubmitButton
                    isSubmitting={isSubmitting || isPending}
                    isDirty={dirty}
                    isValid={isValid}
                    variant="primary"
                    label="تسجيل الدخول"
                    submittingLabel="جاري التحقق من الحساب..."
                    disabledLabel="يرجى إدخال البيانات بشكل صحيح"
                    className="w-full"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;