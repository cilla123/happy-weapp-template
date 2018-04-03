const webpackBase = require('./webpack.config.base')
const webpackMerge = require('webpack-merge')
const webpack = require('webpack')

module.exports = webpackMerge(webpackBase, {
    plugins: [
        
    ]
})

