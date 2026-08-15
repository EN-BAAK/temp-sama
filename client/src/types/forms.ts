import { ID } from "./global";
import { ExistingFileItem, ExistingImageItem, FeatureRelationState } from "./variables";

export type LoginProps = {
  email: string,
  password: string
}

export type ResetPasswordProps = {
  password: string,
  newPassword: string
}

export type ForgotPasswordProps = {
  email: string
}

export type ResetForgottenPasswordProps = {
  otp: string,
  password: string
}

export type FeatureValueItem = {
  id?: ID;
  name: string;
  state: FeatureRelationState;
};

export type FeatureItem = {
  id: ID;
  name: string;
};

export interface FeaturesFieldProps {
  name: string;
  features: FeatureItem[];
  label?: string;
  placeholder?: string;
  styles?: string;
  labelStyle?: string;
  innerDivStyle?: string;
  disabled?: boolean;
}

export interface SelectMultiImageFieldProps {
  label?: string;
  maxImages?: number;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  existingImages?: ExistingImageItem[];
  onDeleteExisting?: (image: ExistingImageItem) => void;
  newFiles: File[];
  setNewFiles: React.Dispatch<React.SetStateAction<File[]>>;
  error?: string;
}

export interface SelectMultiFilesFieldProps {
  label?: string;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  existingFiles?: ExistingFileItem[];
  onDeleteExisting?: (file: ExistingFileItem) => void;
  newFiles: File[];
  setNewFiles: React.Dispatch<React.SetStateAction<File[]>>;
  error?: string;
}

// export interface CustomPermissionValue {
//   id: ID
//   name: string;
//   description: string;
//   permissionsIds: ID[];
//   _itemStates?: Record<ID, PermissionState>;
// }

// export interface CustomPermissionFieldProps {
//   name: string;
//   label?: string;
//   roles: RoleOption[];
//   permissions: PermissionOption[];
//   styles?: string;
//   labelStyle?: string;
//   disabled?: boolean;
// }

// export interface RoleOption {
//   id: ID;
//   name: string;
//   description?: string;
//   permissionsIds: ID[];
// }

// export interface PermissionOption {
//   id: ID;
//   description: string;
// }

export interface LatLngValue {
  lat: number;
  lng: number;
}

export interface CustomMapFieldProps {
  name: string;
  label?: string;
  zoom?: number;
  styles?: string;
  labelStyle?: string;
  disabled?: boolean;
}

export interface NominatimSearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}