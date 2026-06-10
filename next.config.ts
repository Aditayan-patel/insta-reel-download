import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/features/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.instagram.com',
      },
    ],
  },
  
  // ✅ Modern browsers ke liye transpilation kam karo
  transpilePackages: [], // Add only necessary packages
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  
  // ✅ Remove console logs in production (keep errors and warnings)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // ✅ Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'sonner', 'react-hook-form'],
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
    scrollRestoration: true,
    optimisticClientCache: true,
    manualClientBasePath: false,
    // ✅ CSS optimization
    optimizeCss: true,
    // ✅ Better chunking
    webpackBuildWorker: true,
    // ✅ Parallel builds
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
  
  // ✅ On-demand entrypoints for better code splitting
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  
  // ✅ Cache headers for static assets
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  
  // ✅ Simple redirects only
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // ✅ Webpack optimization for better code splitting
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            // ✅ Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              reuseExistingChunk: true,
              chunks: 'all',
            },
            // ✅ React chunk
            react: {
              name: 'react',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-is)[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // ✅ UI library chunk
            ui: {
              name: 'ui',
              test: /[\\/]node_modules[\\/](lucide-react|@radix-ui|class-variance-authority|clsx|tailwind-merge)[\\/]/,
              priority: 15,
              reuseExistingChunk: true,
            },
            // ✅ Styles chunk
            styles: {
              name: 'styles',
              test: /\.(css|scss)$/,
              chunks: 'all',
              enforce: true,
              priority: 30,
            },
          },
        },
        // ✅ Remove legacy JavaScript polyfills for modern browsers
        usedExports: true,
        sideEffects: true,
      };
      
      // ✅ Remove console.log in production (already handled by compiler)
      // This helps reduce bundle size
    }
    
    return config;
  },
  
  // ✅ Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GOOGLE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },
  
  staticPageGenerationTimeout: 120,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  distDir: '.next',
  cleanDistDir: true,
  
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  trailingSlash: false,
  
  // ✅ Add for better performance
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default withNextIntl(nextConfig);