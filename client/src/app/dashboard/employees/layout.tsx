import { CommonParentProps } from "@/types/global";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة الموظفين",
  description: "عرض وإدارة فريق العمل، الصلاحيات، وسجلات الموظفين في منصة سما بلودان.",
};

export default function EmployeesLayout({ children }: CommonParentProps) {
  return children
}