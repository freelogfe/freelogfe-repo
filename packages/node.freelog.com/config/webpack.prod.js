const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin')
const baseConfig = require('./webpack.base')
const merge = require('webpack-merge')
const path = require('path')

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const staticDomain = argv.env === 'prod' ? '//static.freelog.com' :  '//static.testfreelog.com'

module.exports = merge(baseConfig, {
  mode: 'production',

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: 'public/[name].[chunkhash].js',
    crossOriginLoading: 'anonymous',
    path: path.resolve(__dirname, '../dist'),
    publicPath: `${staticDomain}/pagebuild/`,
  },

  module: {
    rules: [{
      test: /\.(less|css)$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader',
      ]
    }]
  },

  optimization: {
    concatenateModules: true,
    nodeEnv: 'production',
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin({})
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      preload: ['**/*.*'],
      inject: 'body',
      filename: 'pagebuild.html',
      template: path.resolve(__dirname, '../public/index.html'),
      chunks: ['pagebuild-app', 'pagebuild-core']
      // excludeChunks: [ tmpName ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css', 
      chunkFilename: 'public/[id].css',
    }),
    new ResourceHintWebpackPlugin(),
    new StyleExtHtmlWebpackPlugin({
      minify: true,
      chunks: ['pagebuild-core']
    }),
    // new ScriptExtHtmlWebpackPlugin({
    //   // inline: ['pagebuild-core'],  
    //   prefetch: ['pagebuild-app', 'pagebuild-core']
    // })
  ],
})

