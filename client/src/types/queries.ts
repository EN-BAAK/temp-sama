import { CityEntityCreation, PersonNoteEntityCreation, PropertyNoteEntityCreation } from "./entities";
import { ID } from "./global";
import { FeatureRelationState } from "./variables";

export interface GetClientsParams {
  limit: number;
  page?: number;
  offset?: number;
  search?: string;
}

export interface CreatePersonNoteParams {
  personId: ID,
  payload: PersonNoteEntityCreation
}

export interface CreateClientFavoriteParams {
  clientId: ID,
  propertyId: ID
}

export interface DeletePersonNoteParams {
  personId: ID,
  noteId: ID
}

export interface DeleteClientFavoriteParams {
  clientId: ID,
  propertyId: ID
}

export type CreateCityParams = {
  governorateId: ID;
  data: CityEntityCreation;
};

export type UpdateCityParams = {
  governorateId: ID;
  cityId: ID;
  data: Partial<CityEntityCreation>;
};

export type DeleteCityParams = {
  governorateId: ID;
  cityId: ID;
}

export interface GetEmployeesParams {
  limit: number;
  page?: number;
  offset?: number;
  search?: string;
}

export type GetOwnersParams = {
  limit: number;
  page?: number;
  offset?: number;
  search?: string;
};


export type assignPropertyToOwnerParams = {
  ownerId: ID;
  propertyId: ID;
};

export type unassignPropertyToOwnerParams = {
  ownerId: ID;
  propertyId: ID;
};

export interface PropertyFeatureItemInput {
  id?: ID;
  name?: string
  color?: string
  state: FeatureRelationState;
}

export type GetPropertiesFilterParams = {
  cityId?: ID;
  categoryId?: ID;
  status?: string;
  purpose?: string;
  minimumPrice?: number;
  maximumPrice?: number;
};

export type GetPropertiesParams = GetPropertiesFilterParams & {
  limit: number;
  page?: number;
  offset?: number;
  search?: string;
};

export type CreatePropertyNoteParams = {
  propertyId: ID;
  payload: PropertyNoteEntityCreation;
};

export type DeletePropertyNoteParams = {
  propertyId: ID;
  noteId: ID;
};

export type DeletePropertyImageParams = {
  propertyId: ID;
  imageId: ID;
};

export type DeletePropertyPlanParams = {
  propertyId: ID;
  planId: ID;
};

export type EnableParams = {
  enable?: boolean
}