import { Request } from "express";
import { StringValue } from "ms";
import { Dialect } from "sequelize";

export type ID = number

export type User = {
  id: ID,
  fullName: string,
  email?: string,
  phone?: string,
  city?: string,
  role?: string[],
  permissions?: string[]
}

export type BlacklistedToken = {
  token: string;
  expiresAt: number;
};

export interface AuthenticatedRequest extends Request {
  id?: ID;
  user?: User;
}

export interface IConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}

export interface ISettings {
  salt: number;
  jwtAccessSecret: string;
  jwtAccessExpire: StringValue;
  authCookieMaxAgeMs: number;
  authCookieName: string,
  nodeEnvironment: string,
  maxFileSize: number,
  frontendURL: string,
  port: number,
  maxRequestNumberPerTime: number,
  maxRequestTime: number,
}

export type MimeType = { [key: string]: string }

export interface JwtPayload {
  userId: ID;
  roleId: ID
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

export type PropertyRelationState = "new" | "remove" | "old";
export type FeatureRelationState = "new" | "remove" | "old" | "created";