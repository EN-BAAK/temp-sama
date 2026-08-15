import { Transaction } from "sequelize"
import { ID } from "./variables";

export type ServiceOptions = {
  transaction?: Transaction
}

export type getAllUEmployeesProps = {
  page?: number;
  limit?: number;
  search?: string;
  offset?: number,
  userId?: ID
}

export type getAllClientsProps = {
  page?: number;
  limit?: number;
  search?: string;
  offset?: number
}

export type getAllOwnersProps = {
  page?: number;
  limit?: number;
  search?: string;
  offset?: number
}

export type getAllPropertiesProps = {
  pa?: number;
  l?: number;
  se?: string;
  ci?: ID
  ca?: ID;
  st?: string;
  mip?: number;
  map?: number;
  o: ID,
  pu?: string
}