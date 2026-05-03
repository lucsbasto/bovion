import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@bovion/db", "@bovion/emails"],
};

export default config;
