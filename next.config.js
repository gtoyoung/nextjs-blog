const withCss = require("@zeit/next-css");
const withPlugins = require("next-compose-plugins");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");
const withImages = require("next-images");

const nextConfig = {
  webpack: (config) => {
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsConfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsConfigPathsPlugin()];
    }

    return config;
  },
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: "secret",
  },
  env: {
    // Will be available on both server and client
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
  },

  // staic html 페이지를 직접 경로 지정하여 표현할수있도록 설정
  rewrites: async () => {
    return [
      {
        source: "/trees",
        destination: "/trees/index.html",
      },
      {
        source: "/soccer",
        destination: "/soccer/index.html",
      },
    ];
  },
  headers: async () => {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
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
};

// next.config.js
module.exports = withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          dest: "public",
          runtimeCaching,
        },
      },
    ],
    withCss,
    withImages,
  ],
  nextConfig
);
