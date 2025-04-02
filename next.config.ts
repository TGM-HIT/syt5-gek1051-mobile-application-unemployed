import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push('leveldown')
        }

        return config
    },
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
    /* config options here */
};

export default nextConfig;
