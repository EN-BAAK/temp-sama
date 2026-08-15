import { UserEntity } from "@/types/entities";
import { NavItem } from "@/types/global";
import { AccessItem, PropertyDuration, PropertyPurpose, PropertyStatus } from "@/types/variables";
import { Settings2, Building2, Users, UserCheck, UserCog, MapPin, FolderTree, } from "lucide-react";

export const navItems: NavItem[] = [
  {
    title: "العقارات",
    subtitle: "إدارة الوحدات، القوائم والتقارير المدعومة بالذكاء الاصطناعي",
    href: "/dashboard/properties",
    icon: Building2,
  },
  {
    title: "العملاء",
    subtitle: "متابعة الطلبات، اهتمامات المشترين والسجلات",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "الملاك",
    subtitle: "إدارة أصحاب العقارات وعقود الوساطة",
    href: "/dashboard/owners",
    icon: UserCheck,
  },
  {
    title: "الموظفون",
    subtitle: "إدارة فريق العمل، الصلاحيات والأدوار",
    href: "/dashboard/employees",
    icon: UserCog,
  },
  {
    title: "المحافظات",
    subtitle: "توزيع المناطق والمواقع الجغرافية للعقارات",
    href: "/dashboard/governorates",
    icon: MapPin,
  },
  {
    title: "الاصناف",
    subtitle: "تصنيف أنواع العقارات (شقق، فلل، أراضي، تجاري)",
    href: "/dashboard/categories",
    icon: FolderTree,
  },
  {
    title: "الإعدادات",
    subtitle: "تهيئة النظام وتفضيلات الحساب العامة",
    href: "/dashboard/settings",
    icon: Settings2,
  },
];

export const accessGuid: AccessItem[] = [
  { authorized: false, path: "/login" },
  { authorized: false, path: "/forgot-password" },
  {
    authorized: true,
    path: "/dashboard",
  },
];

export const initialUser: UserEntity = {
  id: -1,
  email: "guest@gmail.com",
  fullName: "زائر",
  phone: "0000000000",
}

export const STATUS_MAP: Record<PropertyStatus, { label: string; className: string }> = {
  [PropertyStatus.AVAILABLE]: {
    label: 'متاح',
    className: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  },
  [PropertyStatus.SOLD]: {
    label: 'مباع',
    className: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
  },
  [PropertyStatus.RENTED]: {
    label: 'مؤجر',
    className: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
  [PropertyStatus.U_CONSTRUCTION]: {
    label: 'قيد الإنشاء',
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
  },
};

export const DURATION_MAP: Record<PropertyDuration, string> = {
  [PropertyDuration.YEARLY]: 'سنوياً',
  [PropertyDuration.MONTHLY]: 'شهرياً',
  [PropertyDuration.DAILY]: 'يومياً',
};

export const PROPERTY_STATUS_OPTIONS = [
  {
    key: "متاح",
    value: PropertyStatus.AVAILABLE,
  },
  {
    key: "مباع",
    value: PropertyStatus.SOLD,
  },
  {
    key: "مؤجر",
    value: PropertyStatus.RENTED,
  },
  {
    key: "قيد الإنشاء",
    value: PropertyStatus.U_CONSTRUCTION,
  },
];

export const PROPERTY_PURPOSE_OPTIONS = [
  {
    key: "بيع",
    value: PropertyPurpose.SALE,
  },
  {
    key: "إيجار",
    value: PropertyPurpose.RENT,
  },
];

export const PROPERTY_DURATION_OPTIONS = [
  {
    key: "سنوي",
    value: PropertyDuration.YEARLY,
  },
  {
    key: "شهري",
    value: PropertyDuration.MONTHLY,
  },
  {
    key: "يومي",
    value: PropertyDuration.DAILY,
  },
];