import { CommonParentProps } from "@/types/global";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إعدادات النظام",
  description: "إدارة إعدادات المنصة، الهوية البصرية، وصلاحيات النظام لمنصة سما بلودان.",
};

const SettingsLayout = ({ children, }: CommonParentProps) => {
  return children
}

export default SettingsLayout