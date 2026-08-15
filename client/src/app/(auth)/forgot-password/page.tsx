"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Formik, Form, FormikHelpers } from "formik"
import { Mail, Lock, ArrowRight } from "lucide-react"
import InputField from "@/libraries/forms/components/InputField"
import SubmitButton from "@/libraries/forms/components/SubmitButton"
import { ForgotPasswordProps, ResetForgottenPasswordProps } from "@/types/forms"
import { forgotPasswordInitialValues, resetPasswordInitialValues } from "@/constants/formsValues"
import { forgotPasswordValidationSchema, resetPasswordValidationSchema } from "@/constants/formsValidations"
import OtpInput from "@/libraries/forms/components/OtpField"
import { useForgotPassword, useResetForgottenPassword } from "@/features/useAuth"

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1)
  const [userEmail, setUserEmail] = useState<string>("")

  const { mutateAsync: sendOtp, isPending: isSendingOtp } = useForgotPassword()
  const { mutateAsync: resetPassword, isPending: isResetting } = useResetForgottenPassword()


  const onEmailSubmit = async (values: ForgotPasswordProps, formik: FormikHelpers<ForgotPasswordProps>) => {
    await sendOtp(values)
    setUserEmail(values.email)
    setStep(2)
    formik.setSubmitting(false)
  }

  const onResetSubmit = async (values: ResetForgottenPasswordProps, formik: FormikHelpers<ResetForgottenPasswordProps>) => {
    await resetPassword({
      otp: values.otp,
      password: values.password,
    })
    formik.setSubmitting(false)
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-md">

        <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
          <span className="text-2xl font-bold text-foreground brand">منصة سما بلودان</span>
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-reversed font-bold brand">س</span>
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="mb-8 text-right">
              <h1 className="text-2xl font-bold text-foreground">نسيت كلمة المرور؟</h1>
              <p className="text-muted-foreground text-sm mt-1">
                أدخل بريدك الإلكتروني المسجل وسنرسل لك رمزاً لتأكيد هويتك وإعادة تعيين كلمة المرور.
              </p>
            </div>

            <Formik
              initialValues={forgotPasswordInitialValues}
              validationSchema={forgotPasswordValidationSchema}
              onSubmit={onEmailSubmit}
            >
              {({ isSubmitting, dirty, isValid }) => (
                <Form className="space-y-5 text-right">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground">
                      البريد الإلكتروني الحساب الرسمي
                    </label>
                    <InputField
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      Icon={<Mail size={15} />}
                      dir="ltr"
                      innerDivStyle="relative"
                    />
                  </div>

                  <SubmitButton
                    isSubmitting={isSubmitting || isSendingOtp}
                    isDirty={dirty}
                    isValid={isValid}
                    variant="primary"
                    label="إرسال رمز التحقق"
                    submittingLabel="جاري إرسال الرمز..."
                    disabledLabel="يرجى إدخال البريد الإلكتروني بشكل صحيح"
                  />
                </Form>
              )}
            </Formik>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-8 text-right">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-xs text-accent mb-3 hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                <ArrowRight size={14} />
                <span>تعديل البريد الإلكتروني</span>
              </button>
              <h1 className="text-2xl font-bold text-foreground">إعادة تعيين كلمة المرور</h1>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                أدخل الرمز المكون من 6 أرقام المرسل إلى <span className="font-mono text-xs text-foreground bg-input-background px-2 py-0.5 rounded border border-border" dir="ltr">{userEmail}</span> ثم قم بتعيين كلمة المرور الجديدة.
              </p>
            </div>

            <Formik
              initialValues={resetPasswordInitialValues}
              validationSchema={resetPasswordValidationSchema}
              onSubmit={onResetSubmit}
            >
              {({ isSubmitting, dirty, isValid }) => (
                <Form className="space-y-5 text-right">

                  <div className="flex flex-col items-center justify-center py-2">
                    <label className="block text-sm font-medium mb-2 text-foreground self-start">
                      رمز التحقق (OTP)
                    </label>
                    <OtpInput
                      name="otp"
                      length={6}
                      className="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground">
                      كلمة المرور الجديدة
                    </label>
                    <InputField
                      name="password"
                      type="password"
                      autoComplete="off"
                      placeholder="••••••••"
                      Icon={<Lock size={15} />}
                      dir="ltr"
                      innerDivStyle="relative"
                    />
                  </div>

                  <SubmitButton
                    isSubmitting={isSubmitting || isResetting}
                    isDirty={dirty}
                    isValid={isValid}
                    variant="primary"
                    label="تحديث كلمة المرور والدخول"
                    submittingLabel="جاري تحديث البيانات..."
                    disabledLabel="يرجى إكمال الحقول بشكل صحيح"
                  />
                </Form>
              )}
            </Formik>
          </>
        )}

        <div className="text-center mt-6 text-sm text-muted-foreground">
          تذكرت كلمة المرور؟{" "}
          <Link href="/login" className="text-accent font-semibold hover:underline mr-1">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage