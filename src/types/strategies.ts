import { ServiceOptions } from "./services"
import { FeatureRelationState, ID } from "./variables"

export type findPersonByIdProps = {
  id: ID,
  relation?: boolean,
} & ServiceOptions

export type findPersonNoteByIdProps = {
  id: ID,
  personId: ID,
  isJson?: boolean,
} & ServiceOptions

export type findUserByIdProps = {
  id: ID,
  relational?: boolean,
  handleError?: boolean
} & ServiceOptions

export type findEmployeeByIdProps = {
  id: ID,
  relational?: boolean,
} & ServiceOptions

export type findRoleByIdProps = {
  id: ID,
  relation?: boolean
} & ServiceOptions

export type findRoleByNameProps = {
  name: string,
  isJson?: boolean,
  error?: boolean
} & ServiceOptions

export type findClientByIdProps = {
  id: ID,
  relation?: boolean,
} & ServiceOptions

export type findClientFavoriteByIdProps = {
  clientId: ID,
  propertyId: ID
} & ServiceOptions

export type findCategoryByIdProps = {
  id: ID,
  isJson?: boolean
} & ServiceOptions

export type findOwnerByIdProps = {
  id: ID,
  relation?: boolean,
} & ServiceOptions


export type findGovernorateByIdProps = {
  id: ID,
  relation?: boolean
} & ServiceOptions

export type findCityByIdProps = {
  id: ID,
  isJson?: boolean,
} & ServiceOptions

export type findPropertyByIdProps = {
  id: ID,
  relation?: boolean,
} & ServiceOptions

export type findPropertyNoteByIdProps = {
  id: ID,
  isJson?: boolean,
} & ServiceOptions

export type findPropertyImageByIdProps = {
  id: ID,
  isJson?: boolean
} & ServiceOptions

export interface PropertyFeatureItemInput {
  id?: ID;
  name?: string
  color?: string
  state: FeatureRelationState;
}

export type FindPropertyPlanByIdProps = {
  id: ID;
  isJson?: boolean;
} & ServiceOptions