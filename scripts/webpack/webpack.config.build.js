const webpackBase = require('./webpack.config.base')
const webpackMerge = require('webpack-merge')

webpackMerge(webpackBase, {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            souceMap: false
        }),
    ]
})