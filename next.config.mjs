/** @type {import('next').NextConfig} */

console.log('[CFG] next.config.mjs carregado — NODE_ENV:', process.env.NODE_ENV)

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: '*.hostingerapp.com' },
    ],
  },
}

export default nextConfig
