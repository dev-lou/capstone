/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Transformers.js to run in Node.js environment
  serverExternalPackages: ['@xenova/transformers'],
};

module.exports = nextConfig;
