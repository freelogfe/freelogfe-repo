
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin')

const baseConfig = require('./webpack.base')
const commonLibPkgJson = require('@freelog/freelog-common-lib/package.json')
const tmpName = 'freelog-common'

module.exports = merge(baseConfig, {

  entry: {
    // [tmpName]: path.resolve(__dirname, '../node_modules/@freelog/freelog-common-lib/', commonLibPkgJson.main)
  },

  output: {
    publicPath: '/'
  },

  mode: 'development',

  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    disableHostCheck: true,
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。
    historyApiFallback: true,
    hot: false,
    host: '0.0.0.0',
    inline: false,
    port: 9888,
  },

  devtool: 'cheap-eval-source-map',

  module: {
    rules: [{
      test: /\.(less|css)$/,
      use: [
        // 'style-loader',
        // 'vue-style-loader',
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '/public/',
          }
        },
        // MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader',
      ]
    }]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      // excludeChunks: [ tmpName ],
      // commonLibUrl: `/${tmpName}.js`
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
  ],
})


