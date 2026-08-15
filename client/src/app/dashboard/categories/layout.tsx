import { CommonParentProps } from "@/types/global";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة التصنيفات",
  description: "عرض وإدارة تصنيفات العقارات والمشاريع والخدمات في منصة سما بلودان.",
};

export default function EmployeesLayout({ children }: CommonParentProps) {
  return children
}