import { CommonParentProps } from "@/types/global";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة المالكين",
  description: "عرض وإدارة سجلات مالكي العقارات والمستندات الخاصة بهم في منصة سما بلودان.",
};

const OwnersLayout = ({ children, }: CommonParentProps) => {
  return children
}

export default OwnersLayout