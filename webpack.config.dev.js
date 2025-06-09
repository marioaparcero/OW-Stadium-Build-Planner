const path = require('path');
const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');

module.exports = merge(base, {
  mode: 'development',
  stats: 'none',
  devtool: 'eval',
  devServer: {
    static: path.join(__dirname, 'build'),
    port: 3001,
    https: true,
    historyApiFallback: true,
    allowedHosts: [
      'builds.comunidadoverwatch.com',
      '.comunidadoverwatch.com',
      'localhost',
    ],
  },
  output: {
    assetModuleFilename: 'assets/[name][ext][query]',
  },
});
