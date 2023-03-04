const withLinaria = require('next-linaria');
const imagesPath = new URL(process.env.IMAGES_PATH);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: imagesPath.protocol.slice(0, -1),
        hostname: imagesPath.hostname,
        port: imagesPath.port,
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

module.exports = withLinaria(nextConfig);
