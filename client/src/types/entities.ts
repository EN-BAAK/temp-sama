import { ID } from "./global";
import { PropertyFeatureItemInput } from "./queries";
import { PropertyDuration, PropertyPurpose, PropertyStatus } from "./variables";

export type PermissionEntity = {
  id: ID,
  name: string,
  description: string,
}

export type PermissionEntityCreation = Omit<PermissionEntity, "id">

export type RoleEntity = {
  id: ID,
  name: string,
  description: string,
  permissions?: PermissionEntity[]
}

export type RoleEntityCreation = Omit<RoleEntity, "id" | "permissions"> & {
  permissionsIds: ID[]
}

export type PersonEntity = {
  id: ID,
  fullName: string,
  email?: string,
  phone?: string,
  city: string,
}

export type UserEntity = {
  id: ID,
  fullName: string;
  email: string;
  phone: string;
}

export type ClientEntity = {
  budget?: number,
} & PersonEntity

export type ClientEntityCreation = Omit<ClientEntity, "id" | "city"> & {
  cityId: ID
}

export type CityEntity = {
  id: ID,
  name: string,
}

export type CityEntityCreation = Omit<CityEntity, "id">

export type GovernorateEntity = {
  id: ID,
  name: string,
  cities: CityEntity[]
}

export type GovernorateEntityCreation = Omit<GovernorateEntity, "id" | "cities">

export type EmployeeEntity = {
  role?: string
} & PersonEntity

export type EmployeeEntityCreation = Omit<EmployeeEntity, "id" | "role"> & {
  password: string,
  roleId?: ID
}

export interface CategoryEntity {
  id: ID;
  name: string;
  icon: string;
}

export type CategoryENtityCreation = Omit<CategoryEntity, "id">

export type OwnerEntity = PersonEntity

export type OwnerEntityCreation = Omit<OwnerEntity, "id" | "city"> & {
  cityId: ID
}

export type OwnerEntityIdentifier = {
  id: ID,
  fullName: string
}

export type ClientEntityIdentifier = {
  id: ID,
  fullName: string,
  phone?: string
}

export type EmployeeEntityIdentifier = {
  id: ID,
  fullName: string,
  phone?: string
}

export type PersonNoteEntity = {
  id: ID,
  note: string
}

export type PersonNoteEntityCreation = Omit<PersonNoteEntity, "id">

export type PropertyFeatureEntity = {
  id: ID,
  name: string,
  color?: string,
}

export type PropertyFeatureEntityCreation = Omit<PropertyFeatureEntity, "id">

export interface PropertyImageEntity {
  id: ID;
  propertyId: ID;
  imageUrl: string;
}

export interface PropertyPlanEntity {
  id: ID;
  propertyId: ID;
  fileUrl: string;
  extension: string
}

export type PropertyNoteEntity = {
  id: ID,
  note: string,
}

export type PropertyNoteEntityCreation = Omit<PropertyNoteEntity, "id">

export interface PropertyEntity {
  id: ID;
  title?: string;
  location?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  category: string;
  desc?: string;
  backgroundUrl?: string;
  map?: string;
  owner?: string,
  status: PropertyStatus
  price: number;
  duration?: PropertyDuration;
  purpose?: PropertyPurpose;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PropertyIdentifiersEntity {
  id: ID,
  title?: string,
  backgroundUrl?: string
}

export type PropertyEntityCreation = Omit<PropertyEntity,
  "id" | "createdAt" | "updatedAt" | "city" | "category" | "backgroundUrl"> & {
    cityId?: ID,
    categoryId: ID,
    features: PropertyFeatureItemInput[]
    ownerId?: ID
  }

export type FavoritePropertyEntity = {
  id: ID;
  title?: string;
  backgroundUrl?: string;
  city?: CityEntity;
  category?: CategoryEntity;
  price?: number;
  propertyId: number
};

export type OwnerPropertyEntity = {
  id: ID;
  title?: string;
  backgroundUrl?: string;
  city?: CityEntity;
  category?: CategoryEntity;
  price?: number;
};
