import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL!;
const apiUrl = new URL(baseApiUrl);

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: isDevelopment,
    remotePatterns: [
      {
        protocol: isDevelopment ? "http" : "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/uploads/**",
      },
    ],
  },
};

const withPWA = withPWAInit({
  dest: "public",
  register: true,
});

export default isDevelopment
  ? nextConfig
  : withPWA(nextConfig);