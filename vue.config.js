const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  lintOnSave: true,

  configureWebpack: {
    plugins: [
      new WebpackObfuscator({
        rotateStringArray: true,
        identifierNamesGenerator: 'mangled',
      }),
    ],
  },
  css: {
    loaderOptions: {
      sass: {
        webpackImporter: true,
        additionalData: `
        // 2. Vendors
        @import '@/stylesheets/vendor/modularscale';

        // 1. Configuration and helpers
        @import
        '@/stylesheets/abstracts/constants',
        '@/stylesheets/abstracts/font-stacks',
        '@/stylesheets/abstracts/functions',
        '@/stylesheets/abstracts/variables',
        '@/stylesheets/abstracts/mixins';

        // 3. Base stuff
        @import
        '@/stylesheets/base/base',
        '@/stylesheets/base/fonts',
        '@/stylesheets/base/typography';
        `
      }
    }
  }
};
