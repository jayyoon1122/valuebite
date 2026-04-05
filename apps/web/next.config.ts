import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@valuebite/types', '@valuebite/utils', '@valuebite/i18n'],
};

export default config;
