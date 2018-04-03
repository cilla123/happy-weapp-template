const { resolve } = require('path')
const r = url => resolve(__dirname, url)
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HappyPack = require('happypack')
const extractSass = new ExtractTextPlugin({ filename: '[name].wxss' })

const happyThreadPool = require('./happypack-thread-pool')
const config = require('../../config')

module.exports = {
  devtool: false,
  output: {
    path: config.assetsPath,
    filename: '[name].js'
  },
  resolve: {
    alias: {
      utils: r('../utils/utils')
    }
  },
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'happypack/loader?id=babel',
        exclude: /node_modules/,
      },
      {
        test: /\.sass$/,
        use: extractSass.extract({
          use: [{
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('autoprefixer')({
                    browsers: [
                      'last 2 versions'
                    ]
                  })
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                indentedSyntax: true
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.happy$/,
        loader: 'happypack/loader?id=happyweapp',
      }
    ]
  },
  plugins: [
    extractSass,
    new HappyPack({
      id: "babel",
      loaders: [{
        loader: 'babel-loader',
        options: {
          presets: [
            'latest'
          ]
        }
      }],
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: "happyweapp",
      loaders: [{
        loader: 'happy-weapp-loader',
        options: {
          dist: './dist'
        }
      }],
      threadPool: happyThreadPool
    }),
    new CopyWebpackPlugin([{
      from: {
        glob: 'pages/**/*.json',
        to: ''
      }
    }, {
      from: 'static',
      to: 'static'
    }, {
      from: 'components',
      to: 'components'
    }]),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ProgressBarPlugin()
  ]
}