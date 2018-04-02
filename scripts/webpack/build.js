require('shelljs/global')

const { resolve } = require('path')
const fs = require('fs')
const webpack = require('webpack')
const _ = require('lodash')
const r = url => resolve(process.cwd(), url)
const config = require('../../config')
const webpackConf = require('./webpack.config.base')

const assetsPath = config.assetsPath

console.log(assetsPath)
rm('-rf', assetsPath)
mkdir(assetsPath)

const renderConf = webpackConf
const entry = () => _.reduce(config.json.pages, (en, i) => {
    en[i] = resolve(__dirname, '../../', `${i}.happy`)

    return en
}, {})

renderConf.output = {
    path: config.assetsPath,
    filename: '[name].js'
}

renderConf.entry = entry()
renderConf.entry.app = config.app

const compiler = webpack(renderConf)

fs.writeFileSync(resolve(config.assetsPath, './app.json'), JSON.stringify(config.json), 'utf8')

compiler.watch({}, (err, stats) => {
    if (err) process.stdout.write(err)

    console.log('[webpack:build]', stats.toString({
        chunks: false,
        colors: true
    }))
})