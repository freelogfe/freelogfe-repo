
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
const srcDir = path.resolve(__dirname, '../src')

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const staticDomain = argv.env === 'prod' ? '//static.freelog.com' :  '//static.testfreelog.com'

const APP_PAGEBUILD_AUTH = 'pagebuild-auth'
const appOutputFilenames = {}
const webpackConfig = {
  entry: {
    'pagebuild-app': path.resolve(__dirname, '../src/index'),
    'pagebuild-auth': path.resolve(__dirname, '../src/app/app.js')
  },

  output: {
    filename: (pathData, ...args) => {
      const { contentHashType, chunk: { name, contentHash } } = pathData
      const _contentHash = JSON.parse(JSON.stringify(contentHash))
      appOutputFilenames[name] = contentHash['javascript']
      return '[name].[contenthash].js'
    },
    path: path.resolve(__dirname, '../dist'),
    publicPath: `${staticDomain}/pagebuild/`,
    library: `[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_[name]`,
  },

  node: {
    'fs': 'empty'
  },

  resolve: {
    extensions: [ ".ts", ".tsx", '.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': srcDir,
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
        },{
          loader: 'source-map-loader',
        }]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@kazupon/vue-i18n-loader'
      },
      {
        test: /\.(png|jpg|gif|eot|woff|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'public/assets/[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      filename: 'index.html',
      template: path.resolve(__dirname, '../public/index.html'),
      chunks: [ 'pagebuild-app', 'vendors' ],
      templateParameters: fnTplParameters,
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      filename: 'index.dev.html',
      template: path.resolve(__dirname, '../public/index.dev.html'),
      chunks: ['pagebuild-app', 'vendors' ],
      templateParameters: fnTplParameters,
    }),
    new VueLoaderPlugin(),
  ],
}
module.exports = webpackConfig

function fnTplParameters(compilation, assets, assetTags, options) {
  const str = JSON.stringify(appOutputFilenames)
  return { appOutputFilenames: Buffer.from(str, 'utf-8').toString('base64') }
}
