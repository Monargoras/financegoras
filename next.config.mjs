import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer({
  reactStrictMode: true,
  output: process.env.BUILD_STANDALONE === '1' ? 'standalone' : undefined,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
})
