const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const esbuild = require('esbuild');

const { resolveTSConfig } = require('./utils');
const webpack = require("webpack");

const tsConfigPath = path.join(__dirname, '..', 'tsconfig.json');
const distDir = path.join(__dirname, '..', 'dist');
const srcDir = path.join(__dirname, '..', 'src', 'extension');

module.exports = {
  entry: path.join(srcDir, 'worker-host'),
  output: {
    filename: 'worker-host.js',
    path: distDir,
  },
  target: 'webworker',
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    nodeEnv: process.env.NODE_ENV,
    minimizer: [
      new TerserJSPlugin({
        minify: TerserJSPlugin.esbuildMinify,
        terserOptions: {
          drop: ['debugger'],
          format: 'cjs',
          minify: true,
          treeShaking: true,
          keepNames: true,
          target: 'es2020',
        },
      }),
    ],
  },
  resolve: {
    fallback: {
      net: false,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
    extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: tsConfigPath,
      }),
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              implementation: esbuild,
              loader: 'tsx',
              target: ['es2020', 'chrome91', 'node14.16'],
              tsconfigRaw: resolveTSConfig(path.join(__dirname, '../tsconfig.json')),
            },
          },
        ],
      },
      { test: /\.css$/, loader: require.resolve('null-loader') },
      { test: /\.less$/, loader: require.resolve('null-loader') },
    ],
  }
};
