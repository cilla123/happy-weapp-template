import './styles/index.sass'
import './vendor/index.js'

// app.js
App({
    
    onLaunch(){
        this.getUserInfo()
    },

    async getUserInfo() {
        if (this.globalData.userInfo) return this.globalData.userInfo

        const { code } = await wx.loginAsync()
        const userInfo = await wx.getUserInfoAsync()

        console.log(userInfo)
        this.globalData.userInfo = userInfo
    },

    globalData: {
        userInfo: null,
    }
})