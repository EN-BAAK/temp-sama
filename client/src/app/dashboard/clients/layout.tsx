import { CommonParentProps } from "@/types/global";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة العملاء",
  description: "عرض وإدارة بيانات سجلات العملاء والطلبات والتواصل ضمن منصة سما بلودان.",
};

const ClientsLayout = ({ children, }: CommonParentProps) => {
  return children
}

export default ClientsLayout