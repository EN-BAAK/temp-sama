import { CommonParentProps } from "@/types/global";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة العقارات",
  description: "عرض وإدارة وحدات العقارات، العقود، والمالكين ضمن منصة سما بلودان.",
};

const PropertiesLayout = ({ children, }: CommonParentProps) => {
  return children
}

export default PropertiesLayout