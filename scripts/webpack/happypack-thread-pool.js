const HappyPack = require('happypack')
const os = require('os')

// 构造一个线程池
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = happyThreadPool