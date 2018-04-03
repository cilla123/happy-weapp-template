require('shelljs/global')
const { resolve } = require('path')
const fs = require('fs')
const webpack = require('webpack')
const _ = require('lodash')
const r = url => resolve(process.cwd(), url)

const config = require('../../config')

// 读取不同的配置文件
const ENV = process.env.NODE_ENV
let webpackConf = require('./webpack.config.dev')
if (ENV == 'development') {
    webpackConf = require('./webpack.config.dev')
}else if (ENV == 'production') {
    webpackConf = require('./webpack.config.build')
}

// 获取资源输出文件路径
const assetsPath = config.assetsPath

// 删除并重新创建输出的目录
rm('-rf', assetsPath)
mkdir(assetsPath)

// 获取入口文件
const renderConf = webpackConf
const entry = () => _.reduce(config.json.pages, (en, i) => {
    en[i] = resolve(__dirname, '../../', `${i}.happy`)

    return en
}, {})

// 配置输出路径
renderConf.output = {
    path: config.assetsPath,
    filename: '[name].js'
}

// 设置配置
renderConf.entry = entry()
renderConf.entry.app = config.app

// 进行webpack编译
const compiler = webpack(renderConf)
fs.writeFileSync(resolve(config.assetsPath, './app.json'), JSON.stringify(config.json), 'utf8')

// 进行环境输出 
compiler.watch({}, (err, stats) => {
    if (err) process.stdout.write(err)
    console.log(`[webpack:${ENV}]`, stats.toString({
        chunks: false,
        colors: true
    }))
})
