const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  // Redirect vero (308 con Location) dalla radice alla home italiana:
  // il redirect() di src/app/page.tsx usciva come 307 senza destinazione.
  async redirects() {
    return [{ source: '/', destination: '/it', permanent: true }]
  },
}

module.exports = withNextIntl(nextConfig)
