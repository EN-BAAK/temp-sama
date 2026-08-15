import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import settings from "../config/settings";


export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, settings.salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const generateVerificationCode = (): string => {
  const code = randomBytes(3).toString("hex").toUpperCase();

  return code;
}