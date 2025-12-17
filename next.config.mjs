import bundleAnalyzer from '@next/bundle-analyzer'
import { fileURLToPath } from 'url'
import path from 'path'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
  reactStrictMode: true,
  output: process.env.BUILD_STANDALONE === '1' ? 'standalone' : undefined,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
}

export default withBundleAnalyzer(config)
