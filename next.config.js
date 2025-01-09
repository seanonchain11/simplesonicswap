/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true, // For static exports
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'simplesonicswap.app',
          },
        ],
        destination: '/app',
        permanent: true,
      },
    ]
  },
  // Optimize build output
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable static exports
  output: 'export',
}

module.exports = nextConfig 