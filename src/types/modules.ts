import { ID, PropertyDuration, PropertyPurpose, PropertyStatus } from "./variables";

export interface PasswordResetAttributes {
  id?: ID;
  userId: ID;
  code: string;
  expiresAt: Date;
  isVerified: boolean;
}

export interface PasswordCreationResetAttributes extends Omit<PasswordResetAttributes, "id" | "isVerified"> { }

export interface PermissionAttributes {
  id: ID;
  name: string;
  description?: string | null;
}

export type PermissionCreationAttributes = Omit<PermissionAttributes, "id">

export interface RoleAttributes {
  id: ID;
  name: string;
  description?: string | null;
  permissions?: PermissionAttributes[];
}

export type RoleCreationAttributes = Omit<RoleAttributes, "id" | "permission"> & {
  permissionsIds?: ID[]
}

export interface PersonNoteAttributes {
  id: ID;
  personId: ID;
  note: string;
}

export type PersonNoteCreationAttributes = Omit<PersonNoteAttributes, "id">

export interface PersonAttributes {
  id: ID;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  cityId?: ID | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserAttributes;
  client?: ClientAttributes;
  owner?: OwnerAttributes;
  employee?: EmployeeAttributes;
  notes?: PersonNoteAttributes[];
}

export type PersonCreationAttributes = Omit<
  PersonAttributes,
  "id" | "createdAt" | "updatedAt" | "user" | "client" | "owner" | "employee" | "notes"
>

export interface UserAttributes {
  personId: ID;
  password?: string;
  roleId: ID;
  person?: PersonAttributes;
  role?: RoleAttributes;
  permissions?: PermissionAttributes[];
}

export type UserCreationAttributes = Omit<
  UserAttributes,
  "id" | "person" | "role" | "permissions"
>

export interface EmployeeAttributes {
  personId: ID;
  person?: PersonAttributes;
}

export type EmployeeCreationAttributes = Omit<
  EmployeeAttributes,
  "person"
>

export interface ClientAttributes {
  personId: ID;
  budget?: number | null;
  person?: PersonAttributes;
  favorites?: ClientFavoriteAttributes[];
}

export type ClientCreationAttributes = Omit<
  ClientAttributes,
  "person" | "favorites"
>

export interface OwnerAttributes {
  personId: ID;
  person?: PersonAttributes;
  properties?: PropertyAttributes[];
}

export type OwnerCreationAttributes = Omit<
  OwnerAttributes,
  "person" | "properties"
>

export interface CategoryAttributes {
  id: ID;
  name: string;
  icon: string;
}

export type CategoryCreationAttributes = Omit<CategoryAttributes, "id">

export interface ClientNoteAttributes {
  id: ID;
  clientId: ID;
  note: string;
}

export type ClientNoteCreationAttributes = Omit<ClientNoteAttributes, "id">

export interface OwnerNoteAttributes {
  id: ID;
  ownerId: ID;
  note: string;
}

export type OwnerNoteCreationAttributes = Omit<OwnerNoteAttributes, "id">

export interface CityAttributes {
  id: ID;
  name: string;
  governorateId: ID;
}

export type CityCreationAttributes = Omit<CityAttributes, "id">

export interface GovernorateAttributes {
  id: ID;
  name: string;
  cities?: CityAttributes[];
}

export type GovernorateCreationAttributes = Omit<GovernorateAttributes, "id" | "cities">

export interface PropertyAttributes {
  id: ID;
  title?: string | null;
  location?: string | null;
  cityId?: ID | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  categoryId: ID;
  desc?: string | null;
  backgroundUrl?: string | null;
  ownerId?: ID | null;
  map?: string | null;
  status: PropertyStatus;
  price: number;
  duration?: PropertyDuration | null;
  purpose?: PropertyPurpose | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PropertyCreationAttributes = Omit<PropertyAttributes, "id" | "createdAt" | "updatedAt">

export interface PropertyImageAttributes {
  id: ID;
  propertyId: ID;
  imageUrl: string;
}

export type PropertyImageCreationAttributes = Omit<PropertyImageAttributes, "id">

export interface FeatureAttributes {
  id: ID;
  name: string;
  color?: string | null;
}

export type FeatureCreationAttributes = Omit<FeatureAttributes, "id">

export interface PropertyNoteAttributes {
  id: ID;
  propertyId: ID;
  note: string;
}

export type PropertyNoteCreationAttributes = Omit<PropertyNoteAttributes, "id">

export interface ClientFavoriteAttributes {
  id: ID;
  clientId: ID;
  propertyId: ID;
}

export type ClientFavoriteCreationAttributes = Omit<ClientFavoriteAttributes, "id">

export interface PropertyPlanAttributes {
  id: ID;
  propertyId: ID;
  fileUrl: string;
  extension: string;
}

export type PropertyPlanCreationAttributes = Omit<PropertyPlanAttributes, "id">