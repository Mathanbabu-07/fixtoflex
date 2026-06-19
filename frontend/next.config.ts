import type { NextConfig } from "next";

import os from "os";

const getNetworkInterfaces = () => {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = ["localhost:3001", "localhost:3002", "localhost:3000"];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push(iface.address);
        addresses.push(`${iface.address}:3001`);
        addresses.push(`${iface.address}:3002`);
        addresses.push(`${iface.address}:3000`);
      }
    }
  }
  return addresses;
};

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: getNetworkInterfaces(),
};

export default nextConfig;
