/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/info492-demo1',
  assetPrefix: '/info492-demo1/',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
