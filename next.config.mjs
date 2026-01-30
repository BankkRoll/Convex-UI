import { withContentlayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["ui", "common", "shared-data", "icons", "tsconfig"],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  async redirects() {
    return [
      ...(process.env.NEXT_PUBLIC_BASE_PATH?.length
        ? [
            {
              source: "/",
              destination: process.env.NEXT_PUBLIC_BASE_PATH,
              basePath: false,
              permanent: false,
            },
          ]
        : []),
    ];
  },
  eslint: {
    // We are already running linting via GH action, this will skip linting during production build on Vercel
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: false,
        crypto: false,
        fs: false,
        path: false,
        os: false,
      };
    } else {
      // For server-side, mark Node.js built-ins as external
      config.externals = config.externals || [];
      config.externals.push({
        stream: "commonjs stream",
        crypto: "commonjs crypto",
      });
    }
    return config;
  },
};

export default withContentlayer(nextConfig);
