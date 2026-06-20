/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.22"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sin1.contabostorage.com",
      },
      {
        protocol: "https",
        hostname: "newapi.novotrend.co",
      },
      {
        protocol: "https",
        hostname: "ntapi.novotrend.co",
        pathname: "/documents/**",
      },
    ],
  },
};

export default nextConfig;
