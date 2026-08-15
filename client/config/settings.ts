import { ISettings } from "@/types/global";

export const settings: ISettings = {
  url: process.env.NEXT_PUBLIC_URL as string,
  baseAPIUrl: process.env.NEXT_PUBLIC_BASE_API_URL as string,
  apiVersion: process.env.NEXT_PUBLIC_API_VERSION as string
}