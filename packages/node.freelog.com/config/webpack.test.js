
const baseConfig = require('./webpack.prod')
const merge = require('webpack-merge')

module.exports = merge(baseConfig, {
  mode: 'test',
  output: {
    publicPath: '//static.testfreelog.com/',
  },
})
