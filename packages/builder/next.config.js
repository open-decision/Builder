const withPlugins = require("next-compose-plugins");
const { withSentryConfig } = require("@sentry/nextjs");

// Yjs is transpiled, because otherwise a change in nextjs 12 results in it being imported twice. My guess is that TipTap Collaboration
// is importing the cjs version of yjs and nextjs since version 12 imports the esm version. This results in multiple versions being imported
// breaking the app.
const withTM = require("next-transpile-modules")(["yjs"]);

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/auth/:path",
        destination: `${process.env.OD_API_ENDPOINT}/v1/auth/:path`,
      },
      {
        source: "/graphql",
        destination: `${process.env.OD_API_ENDPOINT}/v1/graphql`,
      },
    ];
  },
};

module.exports = withPlugins(
  [withTM, withSentryConfig({}, { silent: true }), withBundleAnalyzer],
  nextConfig
);
