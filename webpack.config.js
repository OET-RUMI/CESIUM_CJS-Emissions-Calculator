const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed || {};

// The path to the CesiumJS source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    sourcePrefix: '',
    publicPath: '/'
  },
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true
  },
  resolve: {
    alias: {
      // Explicit cesium.js file reference 
      cesium$: path.resolve(__dirname, cesiumSource, 'Cesium.js'),
      // General cesium folder
      cesium: path.resolve(__dirname, cesiumSource)
    },
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      http: false,
      https: false,
      zlib: false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ['url-loader']
      },
      {
        // Strip cesium pragma directives
        test: /\.js$/,
        enforce: 'pre',
        include: path.resolve(__dirname, cesiumSource),
        use: [
          {
            loader: 'strip-pragma-loader',
            options: {
              pragmas: {
                debug: false
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
        { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
        { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
      ]
    }),
    // Define relative base path for Cesium assets and expose environment variables
    new webpack.DefinePlugin({
      CESIUM_BASE_URL: JSON.stringify(''),
      // Expose environment variables as global variables in the browser
      // Since these are directly injected into the browser, use explicit JSON.stringify
      'window.CESIUM_ION_ACCESS_TOKEN': JSON.stringify(env.CESIUM_ION_ACCESS_TOKEN || ''),
      'window.CLIMATIQ_API_KEY': JSON.stringify(env.CLIMATIQ_API_KEY || '')
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 8080,
    hot: true,
    open: true
  }
};