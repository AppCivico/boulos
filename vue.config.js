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
};
