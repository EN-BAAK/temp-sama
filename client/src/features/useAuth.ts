import { changePassword, forgotPassword, login, logout, resetForgottenPassword, validateAuthentication } from "@/api-client";
import { useAppContext } from "@/libraries/project-provider/AppProvider";
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query"
import { useRouter } from "next/navigation";

const baseKey = ["verify-authentication"]

export const useValidateAuthentication = () => {
  return useQuery({
    queryKey: baseKey,
    queryFn: validateAuthentication,
    gcTime: 0,
    retry: false
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient()
  const { pushToast } = useAppContext();
  const router = useRouter()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: baseKey, exact: true });
    pushToast({ message: "تم تسجيل الدخول بنجاح", type: "SUCCESS" });
    router.replace("/dashboard");
  }

  const onError = () => {
    pushToast({ message: "فشل تسجيل الدخول", type: "ERROR" });
  }

  return useMutation({
    mutationFn: login,
    onSuccess,
    onError
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { pushToast } = useAppContext();

  const onSuccess = () => {
    pushToast({ message: 'تم تسجيل الخروج بنجاح', type: "SUCCESS" });
    queryClient.invalidateQueries({ queryKey: baseKey, exact: true });
    router.replace("/login");
  };

  const onError = () => {
    pushToast({ message: "فشل تسجيل الدخول", type: "ERROR" });
  };

  return useMutation({
    mutationFn: logout,
    onSuccess,
    onError,
  });
};

export const useChangePassword = () => {
  const { pushToast } = useAppContext();
  const router = useRouter()

  const onSuccess = () => {
    pushToast({ message: "تم تغيير كلمة المرور بنجاح", type: "SUCCESS" });
    router.replace("/dashboard")
  };

  const onError = () => {
    pushToast({ message: "فشل تغيير كلمة المرور, حاول مرة اخرى", type: "ERROR" });
  };

  return useMutation({
    mutationFn: changePassword,
    onSuccess,
    onError
  })
}

export const useForgotPassword = () => {
  const queryClient = useQueryClient()
  const { pushToast } = useAppContext();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["verify-authentication"], exact: true });
    pushToast({ message: "تم ارسال رمز سري الى صندوق الرسائل الخاص بك", type: "SUCCESS" });
  }

  const onError = () => {
    pushToast({ message: "فشلت العملية, قد يكون الحساب غير موجود او غيرموثق", type: "ERROR" });
  }

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess,
    onError
  })
}

export const useResetForgottenPassword = () => {
  const queryClient = useQueryClient()
  const { pushToast } = useAppContext();
  const router = useRouter()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["verify-authentication"], exact: true });
    pushToast({ message: "تم تعديل كلمة المرور بنجاح", type: "SUCCESS" });
    router.replace(`/login`);
  }

  const onError = () => {
    pushToast({ message: "حدث خطأ اثناء معالجة طلبك, تحقق من الرمز", type: "ERROR" });
  }

  return useMutation({
    mutationFn: resetForgottenPassword,
    onSuccess,
    onError
  })
}