/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // appDir: true, // Remove or comment this line
  },
  images: {
    domains: ['res.cloudinary.com'], // Add Cloudinary domain here
  },
}

module.exports = nextConfig