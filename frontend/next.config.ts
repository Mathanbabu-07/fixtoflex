import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.19.80", "192.168.19.80:3001", "192.168.19.80:3002", "localhost:3001", "localhost:3002"]
};

export default nextConfig;
