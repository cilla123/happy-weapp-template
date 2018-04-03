const asyncWrap = fn => (options = {}) => new Promise((resolve, reject) => {
    let conf = {
        success: res => {
            resolve(res)
        },
        fail: err => {
            reject(err)
        }
    }

    wx[fn](R.merge(conf, options))
})

wx.loginAsync = asyncWrap('login')
wx.getUserInfoAsync = asyncWrap('getUserInfo')
wx.reqAsync = asyncWrap('request')
wx.getSystemInfoAsync = asyncWrap('getSystemInfo')
wx.payAsync = asyncWrap('requestPayment')