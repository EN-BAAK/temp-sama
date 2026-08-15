import * as Yup from "yup"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("البريد الإلكتروني المدخل غير صالح")
    .required("يرجى إدخال البريد الإلكتروني الحساب الرسمي"),
  password: Yup.string()
    .min(6, "كلمة المرور يجب أن لا تقل عن 6 خانات")
    .required("يرجى إدخال كلمة المرور السريّة"),
});

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("البريد الإلكتروني المدخل غير صالح")
    .required("يرجى إدخال البريد الإلكتروني لإرسال رمز التحقق"),
});

export const resetPasswordValidationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "يجب أن يتكون الرمز من أحرف وأرقام فقط")
    .length(6, "يرجى إدخال رمز التحقق كاملاً (6 أحرف/أرقام)")
    .required("رمز التحقق مطلوب لإعادة التعيين"),
  password: Yup.string()
    .min(6, "كلمة المرور الجديدة يجب أن لا تقل عن 6 خانات")
    .required("يرجى إدخال كلمة المرور الجديدة"),
});

export const validationGovernorateSchema = Yup.object().shape({
  name: Yup.string()
    .required("اسم المحافظة مطلوب")
    .min(2, "اسم المحافظة يجب أن يكون حرفين على الأقل"),
});

export const validationCitySchema = Yup.object().shape({
  name: Yup.string()
    .required("اسم المدينة مطلوب")
    .min(2, "اسم المدينة يجب أن يكون حرفين على الأقل"),
});

export const validationClientSchema = Yup.object().shape({
  fullName: Yup.string().required("اسم العميل مطلوب"),
  phone: Yup.string().optional(),
  email: Yup.string().email("البريد الإلكتروني غير صحيح").optional(),
  cityId: Yup.number().moreThan(0, "الرجاء اختيار مدينة صالحة").required("المدينة مطلوبة"),
  budget: Yup.number()
    .typeError("الميزانية يجب أن تكون رقماً")
    .positive("الميزانية يجب أن تكون رقماً موجباً")
    .optional(),
});

export const validationClientNoteSchema = Yup.object().shape({
  note: Yup.string()
    .required("يرجى كتابة الملاحظة قبل الحفظ")
    .trim(),
});

export const validationEmployeeSchema = Yup.object().shape({
  fullName: Yup.string().required("اسم الموظف مطلوب"),
  phone: Yup.string().required("رقم الهاتف مطلوب"),
  email: Yup.string()
    .matches(emailRegex, "البريد الإلكتروني يجب أن يكون بهذا الشكل: example@domain.com")
    .required("البريد الإلكتروني مطلوب"),
  notes: Yup.string().optional(),
  password: Yup.string()
    .required("كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .matches(/[a-z]/, "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
    .matches(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .matches(
      /[@$!%*؟&]/,
      "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل من: @ $ ! % * ؟ &"
    ),
});

export const validationEmployeeUpdateSchema = Yup.object().shape({
  fullName: Yup.string().required("اسم الموظف مطلوب"),
  phone: Yup.string().required("رقم الهاتف مطلوب"),
  email: Yup.string()
    .matches(emailRegex, "البريد الإلكتروني يجب أن يكون بهذا الشكل: example@domain.com")
    .required("البريد الإلكتروني مطلوب"),
  notes: Yup.string().optional(),
});

export const validationCategorySchema = Yup.object().shape({
  name: Yup.string().required("اسم التصنيف مطلوب"),
  icon: Yup.string().required("يرجى اختيار أيقونة للتصنيف"),
});

export const validationOwnerSchema = Yup.object().shape({
  fullName: Yup.string().required("اسم المالك مطلوب"),
  phone: Yup.string().optional(),
  email: Yup.string().email("البريد الإلكتروني غير صحيح").optional(),
  cityId: Yup.number().moreThan(0, "الرجاء اختيار مدينة صالحة").required("المدينة مطلوبة"),
});

export const validationPropertySchema = Yup.object().shape({
  title: Yup.string()
    .max(150, "العنوان يجب ألا يتجاوز 150 حرفاً")
    .optional(),

  location: Yup.string()
    .max(255, "الموقع يجب ألا يتجاوز 255 حرفاً")
    .optional(),

  cityId: Yup.number()
    .moreThan(0, "الرجاء اختيار مدينة صالحة")
    .optional(),

  categoryId: Yup.number()
    .moreThan(0, "الرجاء اختيار تصنيف صالح")
    .required("التصنيف مطلوب"),

  ownerId: Yup.number()
    .moreThan(0, "الرجاء اختيار مالك صالح")
    .optional(),

  bedrooms: Yup.number()
    .typeError("يجب أن يكون رقماً")
    .min(0, "يجب أن يكون العدد بين 0 و 100")
    .max(100, "يجب أن يكون العدد بين 0 و 100")
    .optional(),

  bathrooms: Yup.number()
    .typeError("يجب أن يكون رقماً")
    .min(0, "يجب أن يكون العدد بين 0 و 100")
    .max(100, "يجب أن يكون العدد بين 0 و 100")
    .optional(),

  area: Yup.number()
    .typeError("يجب أن يكون رقماً")
    .min(0, "المساحة يجب أن تكون بين 0 و 1000000")
    .max(1000000, "المساحة يجب أن تكون بين 0 و 1000000")
    .optional(),

  desc: Yup.string().optional(),
  map: Yup.string().optional(),
  status: Yup.string().required("الحالة مطلوبة"),
  price: Yup.number().typeError("السعر يجب أن يكون رقماً").required("السعر مطلوب"),
  duration: Yup.string().optional(),
  purpose: Yup.string().optional(),

  features: Yup.array().of(
    Yup.object().shape({
      id: Yup.mixed().optional(),
      name: Yup.string().optional(),
      color: Yup.string().optional(),
      state: Yup.string().oneOf(["old", "created", "remove", "new"]).required(),
    })
  ),
});

export const validationChangePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("كلمة المرور الحالية مطلوبة"),
  newPassword: Yup.string()
    .required("كلمة المرور الجديدة مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .notOneOf([Yup.ref("password")], "كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية"),
  confirmPassword: Yup.string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([Yup.ref("newPassword")], "كلمتا المرور غير متطابقتين"),
});

export const validationRolePermissionsSchema = Yup.object().shape({
  rolePermissions: Yup.object().shape({
    name: Yup.string().optional(),
    description: Yup.string().optional(),
    permissionsIds: Yup.array().of(Yup.mixed()).optional(),
  }),
});