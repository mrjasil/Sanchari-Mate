/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'th.bing.com', 'plus.unsplash.com'],
  },
}

module.exports = nextConfig