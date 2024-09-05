const MillionLint = require("@million/lint");
const nextTranslate = require("next-translate-plugin");
const withTM = require("next-transpile-modules")();
const withWebpack = (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack: (config, _options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });
      // See https://www.rainbowkit.com/docs/installation#additional-build-tooling-setup
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
      config.externals.push("pino-pretty", "lokijs", "encoding");
      return config;
    },
  };
};

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
};
module.exports = MillionLint.next()(nextTranslate(withWebpack(withTM(nextConfig))));
