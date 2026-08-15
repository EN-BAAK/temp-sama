import { StringValue } from "ms";
import { ISettings } from "../types/variables";

const settings: ISettings = {
  salt: Number(process.env.SALT) as number,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE as StringValue,
  authCookieMaxAgeMs: Number(process.env.AUTH_COOKIE_MAX_AGE_MS) as number,
  authCookieName: process.env.AUTH_COOKIE_NAME as string,
  nodeEnvironment: process.env.NODE_ENV as string,
  maxFileSize: 0.5 * 1024 * 1024,
  frontendURL: process.env.FRONTEND_URL as string,
  port: Number(process.env.PORT) as number,
  maxRequestNumberPerTime: 300,
  maxRequestTime: 15 * 60 * 1000,
};

export default settings
