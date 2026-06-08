/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tyborpthwxifsdglcbfr.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
};

export default nextConfig;
