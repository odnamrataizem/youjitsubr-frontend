const imagesPath = new URL(process.env.IMAGES_PATH);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: imagesPath.protocol.slice(0, -1),
        hostname: imagesPath.hostname,
        port: imagesPath.port || 80,
        pathname: imagesPath.pathname,
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
