/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
};
  webpack: (config) => {
    config.externals = [...config.externals, 'bufferutil', 'utf-8-validate'];
    return config;
  },


module.exports = nextConfig;
