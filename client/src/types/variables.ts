import { ID } from "./global";

export interface AvatarColorTheme {
  bg: string;
  text: string;
}

export enum PropertyStatus {
  AVAILABLE = "AVAILABLE",
  SOLD = "SOLD",
  RENTED = "RENTED",
  U_CONSTRUCTION = "UNDER CONSTRUCTION"
}

export enum PropertyPurpose {
  SALE = "SALE",
  RENT = "RENT",
}

export enum PropertyDuration {
  YEARLY = "YEARLY",
  MONTHLY = "MONTHLY",
  DAILY = "DAILY",
}

export type FeatureRelationState = "old" | "created" | "remove" | "new";
// export type PermissionState = "old" | "created" | "remove";

export interface ExistingImageItem {
  id: ID;
  url: string;
}

export interface ExistingFileItem {
  id: ID;
  url: string;
  extension: string;
}

export enum FileViewerType {
  PDF = "PDF",
  IMAGE = "Image"
}

export interface AccessItem {
  authorized: boolean;
  path: string;
  children?: AccessItem[];
}

export interface MatchedRoute {
  authorized: boolean;
  path: string;
}