import { CommonParentProps } from "@/types/global";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "تسجيل الدخول إلى حسابك في منصة سما بلودان للمقاولات والعقارات.",
};

const LoginLayout = ({ children, }: CommonParentProps) => {
  return <React.Fragment>{children}</React.Fragment>;
}

export default LoginLayout