import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin(
  './lib/i18n/request.ts',
)
const nextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty'],
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV !== 'production',
    },
  },
} satisfies NextConfig

export default withNextIntl(nextConfig)
