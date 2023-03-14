const path = require('path');
const entry = require.resolve('@opensumi/ide-webview/lib/webview-host/web-preload.js');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const tsConfigPath = path.join(__dirname, '../tsconfig.json');
const distDir = path.join(__dirname, '..', 'dist/webview');
const port = 8899;

module.exports = {
  entry,
  output: {
    filename: 'webview.js',
    path: distDir,
  },
  resolve: {
    fallback: {
      net: false,
      child_process: false,
      path: require.resolve('path-browserify'),
      url: false,
      fs: false,
      os: require.resolve('os-browserify'),
      process: 'mock',
    },
    extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: tsConfigPath,
      }),
    ],
  },
  bail: true,
  mode: 'development',
  devtool: 'source-map',
  module: {
    // https://github.com/webpack/webpack/issues/196#issuecomment-397606728
    exprContextCritical: false,
    rules: [
      {
        test: /\.tsx?$/,
        loader: require.resolve('ts-loader'),
        options: {
          happyPackMode: true,
          transpileOnly: true,
          configFile: tsConfigPath,
        },
      },
    ],
  },
  // resolveLoader: {
  //   modules: [path.join(__dirname, '../../../node_modules'), path.join(__dirname, '../node_modules'), path.resolve('node_modules')],
  //   extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
  //   mainFields: ['loader', 'main'],
  //   moduleExtensions: ['-loader'],
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.dirname(entry) + '/webview.html',
    }),
  ],
  devServer: {
    static: path.join(__dirname, '../dist'),
    allowedHosts: "all",
    port,
    host: '0.0.0.0',
    open: false,
    hot: true,
  },
};
