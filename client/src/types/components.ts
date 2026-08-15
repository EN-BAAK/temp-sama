import React from "react";
import { CommonParentProps, ID } from "./global";
import { CategoryEntity, CityEntity, ClientEntity, EmployeeEntity, FavoritePropertyEntity, GovernorateEntity, OwnerEntity, OwnerPropertyEntity, PersonNoteEntity, PropertyEntity, PropertyIdentifiersEntity, PropertyImageEntity, PropertyNoteEntity, PropertyPlanEntity } from "./entities";
import { Variant } from "@/libraries/forms/types";
import { LucideIcon } from "lucide-react"
import { IconType } from "react-icons";
import { GetPropertiesFilterParams } from "./queries";
import { LatLngValue } from "./forms";
import { OpenFileProps } from "./contexts";

export interface AvatarProps {
  name?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface PageHeaderProps {
  title: string,
  sub?: string,
  actions?: {
    readonly label?: string,
    readonly icon?: LucideIcon,
    readonly onClick: () => void,
    readonly variant?: Variant;
    readonly reverse?: boolean;
  }[]
}

export interface DashboardEmptyContentProps {
  title: string;
  desc: string;
  buttonTitle?: string,
  buttonAction?: () => void
}

export interface DashboardErrorContentProps {
  title: string;
  desc: string;
  actionTitle?: string;
  onAction?: () => void;
}

export type DashboardContentProps = {
  isLoading: boolean,
  isEmpty: boolean
  emptyTitle: string,
  emptyDesc: string,
  emptyActionTitle?: string,
  emptyAction?: () => void,
  isError: boolean,
  errorTitle: string,
  errorDesc: string,
  errorActionTitle?: string,
  errorAction?: () => void,
  Skeletons: React.ReactNode
} & CommonParentProps

export type SystemPatternProps = {
  id: string; color?: string; opacity?: number;
}

export type DashboardClientRowProps = {
  client: ClientEntity,
  handleEdit: (id: ID) => void,
  handleDelete: (id: ID, name: string) => void,
  handleView: (id: ID) => void,
  isLoading?: boolean
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  isDisabled?: boolean;
  className?: string
}

export interface DashboardGovernorateProps {
  governorate: GovernorateEntity;
  handleDelete: (id: ID, name: string) => void;
  handleEdit: (id: ID) => void;
  isLoading?: boolean;
}

export interface DashboardCityProps {
  city: CityEntity;
}

export type DashboardPageLayout = {
  className?: string,
} & CommonParentProps

export interface DashboardCityRowProps {
  city: CityEntity;
  handleEdit: (city: CityEntity) => void;
  handleDelete: (id: ID, name: string) => void;
  isLoading?: boolean;
}

type BadgeVariant =
  | "primary"
  | "accent"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "transparent";

export interface CustomBadgeProps {
  label?: string;
  variant?: BadgeVariant;
  icon?: LucideIcon | IconType;
  className?: string;
  iconClassName?: string;
}

export interface DashboardClientDetailsProps {
  client: ClientEntity;
}

export interface DashboardClientNotesProps {
  id: ID;
}

export interface DashboardClientInterestingProps {
  id: ID;
}

export type DashboardClientNoteProps = {
  note: PersonNoteEntity,
  handleDelete: (id: ID) => void,
  isDeleting: boolean
}

export type DashboardEmployeeRowProps = {
  employee: EmployeeEntity,
  handleEdit: (id: ID) => void,
  handleDelete: (id: ID, name: string) => void,
  isLoading?: boolean
}

export type DashboardCategoryProps = {
  category: CategoryEntity;
  handleDelete: (id: ID, name: string) => void;
  handleEdit: (id: ID) => void;
  isLoading?: boolean;
}

export type DashboardOwnerRowProps = {
  owner: OwnerEntity,
  handleEdit: (id: ID) => void,
  handleDelete: (id: ID, name: string) => void,
  handleView: (id: ID) => void,
  isLoading?: boolean
}

export type DashboardPropertyProps = {
  property: PropertyEntity;
  handleDelete: (id: ID, title?: string) => void;
  handleEdit: (id: ID) => void;
  handleView: (id: ID) => void;
  isLoading?: boolean;
}

export interface DashboardImageCardProps {
  image: PropertyImageEntity;
}

export interface DashboardPlanCardProps {
  plan: PropertyPlanEntity;
}

export interface DashboardPropertyImagesProps {
  id: ID;
}

export interface DashboardPropertyPlansProps {
  id: ID;
}

export interface DashboardPropertyOwnerProps {
  id: ID;
}

export interface DashboardPropertyDetailsProps {
  property: PropertyEntity;
}

export interface DashboardPropertyNotesProps {
  id: ID;
}

export interface DashboardPropertyNoteProps {
  note: PropertyNoteEntity;
  handleDelete: (id: ID) => void;
  isDeleting?: boolean;
}

export interface DashboardClientFavoritesProps {
  fav: FavoritePropertyEntity,
  handleView: (id: ID) => void,
  handleDelete: (propertyId: ID, title?: string) => void
  isDeleting?: boolean
}

export interface DashboardClientPropertiesListModalProps {
  isOpen: boolean;
  clientId: ID;
  favoriteIds: ID[];
  onClose: () => void;
}

export interface DashboardClientPropertyProps {
  property: PropertyIdentifiersEntity,
  handleSelect: (propertyId: ID) => void
}

export interface FilterOption {
  key: string;
  value: string;
}

export interface DashboardPropertiesFiltersProps {
  value: GetPropertiesFilterParams;
  onChange: (filters: GetPropertiesFilterParams) => void;
  isDisabled?: boolean;
  statusOptions?: FilterOption[];
  purposeOptions?: FilterOption[];
}

export interface DashboardOwnerDetailsProps {
  owner: OwnerEntity;
  onEdit: () => void
  onDelete: () => void
  disabled?: boolean
}

export interface DashboardOwnerPropertiesProps {
  ownerId: ID;
  onOpenAssignModal: () => void;
}

export interface DashboardOwnerPropertyProps {
  property: OwnerPropertyEntity;
  handleUnlink: (id: ID) => void;
  isUnlinking?: boolean;
  handleViewProperty: (id: ID) => void
}

export interface DashboardOwnerNotesProps {
  ownerId: ID;
}

export interface DashboardOwnerNoteProps {
  note: PersonNoteEntity;
  handleDelete: (id: ID) => void;
  isDeleting?: boolean;
}

export interface DashboardOwnersPropertiesModalProps {
  ownerId: ID;
  isOpen: boolean;
  onClose: () => void;
}

export interface DashboardOwnersPropertyProps {
  property: PropertyIdentifiersEntity;
  handleSelect: (id: ID) => void;
  isAssigning?: boolean;
}

export interface LeafletMapProps {
  position: LatLngValue;
  zoom: number;
  disabled?: boolean;
  onChange: (lat: number, lng: number) => void;
}

export interface MapControllerProps {
  position: LatLngValue;
}

export interface MapClickHandlerProps {
  disabled: boolean;
  onChange: (lat: number, lng: number) => void;
}

export type FileViewerProps = {
  onClose: () => void
} & OpenFileProps

export type DashboardPropertyEntityProps = {
  fullName: string;
  phone?: string;
  onClick: () => void;
  disabled?: boolean;
}

export type DashboardSharePropertyModalProps = {
  property: PropertyEntity;
  onClose: () => void;
}