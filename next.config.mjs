/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  webpack: (config, { isServer }) => {
    // This helps with npm link resolution issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Replace the module resolution for bndy-ui using ESM-compatible syntax
    config.resolve.alias = {
      ...config.resolve.alias,
      'bndy-ui': path.resolve(__dirname, '../bndy-ui/dist'),
    };

    return config;
  },
};

export default nextConfig;