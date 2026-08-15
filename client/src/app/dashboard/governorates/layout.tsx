import { CommonParentProps } from "@/types/global";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إدارة المحافظات والمناطق",
  description: "عرض وإدارة المحافظات والمناطق وتغطيتا الجغرافية لمشاريع وعقارات سما بلودان.",
};

const GovernoratesLayout = ({ children, }: CommonParentProps) => {
  return children
}

export default GovernoratesLayout