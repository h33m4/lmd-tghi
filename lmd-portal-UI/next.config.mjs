import createMDX from "@next/mdx";
import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // MD rule
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    // config.plugins = config.plugins.filter((plugin) => {
    //   return plugin.constructor.name !== "ReactFreshWebpackPlugin";
    // });
    return config;
  },
  images: {
    unoptimized: true,
  },

  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: `${process.env.NEXT_PUBLIC_LMD_API}`,
          }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },

    // 🔹 Add rewrite here
  async rewrites() {
    return [
      {
        source: "/proxy/:path*", // frontend calls /proxy/...
        destination: `${process.env.NEXT_PUBLIC_LMD_API}/:path*`, // forward to backend
      },
    ];
  },

  env: {
    // COGNITO
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
    COGNITO_USERPOOL_ID: process.env.COGNITO_USERPOOL_ID,
    COGNITO_ISSUER: process.env.COGNITO_ISSUER,
    COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,

    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    // AUTH_URL: process.env.AUTH_URL,

    // google analytics & google tag manager
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,

    // aws
    LMD_AWS_ACCESS_KEY_ID: process.env.LMD_AWS_ACCESS_KEY_ID,
    LMD_AWS_SECRET_ACCESS_KEY: process.env.LMD_AWS_SECRET_ACCESS_KEY,
    LMD_AWS_REGION: process.env.LMD_AWS_REGION,
    LMD_S3BUCKETNAME: process.env.LMD_S3BUCKETNAME,
    LMD_S3BUCKETLINK: process.env.LMD_S3BUCKETLINK,

    // BASE URL
    LMD_API_BASE_URL: process.env.LMD_API_BASE_URL,
    NEXT_PUBLIC_LMD_API: process.env.NEXT_PUBLIC_LMD_API,

    // SLACK integration
    SLACK_APP_ID: process.env.SLACK_APP_ID,
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN,
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
    SLACK_COMMENTS_CHANNEL_ID: process.env.SLACK_COMMENTS_CHANNEL_ID,
    SLACK_TICKET_CHANNEL_ID: process.env.SLACK_TICKET_CHANNEL_ID,


    // recaptcha
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,

    // sentry
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

  },
};

const withMdx = createMDX({
  // By default only the `.mdx` extension is supported.
  extension: /\.mdx?$/,
  options: {
    /* otherOptions… */
  },
});

// Merge MDX config with Next.js config
export default withSentryConfig(withMdx(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "last-mile-health",

  project: "lmd-portal",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
