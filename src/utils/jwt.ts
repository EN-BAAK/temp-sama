import jwt, { JwtPayload } from "jsonwebtoken";
import { ID } from "../types/variables";
import settings from "../config/settings";

export const generateTokens = (userId: ID) => {
  const accessToken = jwt.sign({ userId }, settings.jwtAccessSecret, {
    expiresIn: settings.jwtAccessExpire,
  });

  return { accessToken };
};

export const verifyToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, settings.jwtAccessSecret) as JwtPayload
  return payload
}