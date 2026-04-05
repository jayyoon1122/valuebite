import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@valuebite/types', '@valuebite/utils', '@valuebite/i18n'],
  typescript: {
    ignoreBuildErrors: true, // Types checked in dev, skip for production build speed
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
