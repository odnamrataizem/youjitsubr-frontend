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
  // webpack: (config, { dev, isServer }) => {
  //   if (!dev && !isServer) {
  //     Object.assign(config.resolve.alias, {
  //       'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
  //       react: 'preact/compat',
  //       'react-dom/test-utils': 'preact/test-utils',
  //       'react-dom': 'preact/compat',
  //     });
  //   }
  //   return config;
  // },
};

module.exports = nextConfig;
