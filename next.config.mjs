/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000'
        // pathname: '/photos/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000'
      },
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
}

export default nextConfig
