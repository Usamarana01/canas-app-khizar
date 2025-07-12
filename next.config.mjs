/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Add rule for pdf.worker.min.js?url
    config.module.rules.push({
      test: /pdf\.worker\.min\.js$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext][query]',
      },
    });
    return config;
  },
};

export default nextConfig;
