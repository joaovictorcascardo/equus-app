/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desabilita type-check e lint no build — servidor tem limite de 256MB de RAM
  // A verificação de tipos é feita localmente antes do push
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: '*.hostingerapp.com' },
    ],
  },
}

export default nextConfig
