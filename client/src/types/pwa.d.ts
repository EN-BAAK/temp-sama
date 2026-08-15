declare module "@ducanh2912/next-pwa" {
  import type { NextConfig } from "next";

  interface PWAOptions {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    scope?: string;
    sw?: string;
  }

  export default function withPWAInit(
    options?: PWAOptions
  ): (nextConfig: NextConfig) => NextConfig;
}