/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // Enable static exports
  output: 'standalone',
  // Optimize build output
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Domain-based routing
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'simplesonicswap.app',
            },
          ],
          destination: '/app/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig 