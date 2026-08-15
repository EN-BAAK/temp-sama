import { navItems } from "@/constants/global";
import { usePathname } from "next/navigation";

export const useGetPageInfo = () => {
  const pathname = usePathname();

  const currentItem = navItems.find((item) => {
    if (item.href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(item.href);
  });

  const title = currentItem ? currentItem.title : "لوحة التحكم";
  const subtitle = currentItem?.subtitle;

  return { title, subtitle }
}