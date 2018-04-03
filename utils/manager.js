
const app = {
    /*****************************************************************
     * 生命周期
     * @auth: Ben赖珏豪
     * @Wechat：892156860
     ******************************************************************/
    /**
     * 初始化
     */
    appInitial() {
        this.getSystemInfo({ 
            success: (res) => { this.setSystemInfoData(res) } 
        })

    },
    /**
     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     */
    onLaunch(opts) {
        let userInfo
        if (userInfo = wx.getStorageSync('userInfo')) {
            this.globalData.userInfo = userInfo
        }
        this.appInitial()
    },
    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow(opts) {},
    /**
     * 当小程序从前台进入后台，会触发 onHide
     */
    onHide() {},
    /**
     * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
     */
    onError(err) {},
    /**
     * 页面加载的时候触发
     */
    onPageLoad(event) {
        const pageInstance = this.getAppCurrentPage()
        
        pageInstance.dataInitial()

        console.log(pageInstance)
    },


    /*****************************************************************
     * 业务相关的方法
     * @auth: Ben赖珏豪
     * @Wechat：892156860
     ******************************************************************/
    /**
     * 页面数据初始化
     */
    pageDataInitial(){
        const pageInstance = this.getAppCurrentPage()
    },
    /**
     * 点击打电话
     */
    tapPhoneCallHandler(event){
        const { phone } = event.detail
        this.makePhoneCall(phone)
    },
    /**
     * 自定义跳转
     */
    customTurnToPageHandler(event){
        const { turnTopage } = event.detail
        this.turnToPage(`../${turnTopage}/${turnTopage}`)
    },
    /**
     * 点击轮播图
     */
    tapSwiperHandler(event){
        const { currentItem } = event.detail
        const turnToPageUrl = currentItem.turn_to_page_url
        if (turnToPageUrl) {
            this.turnToPage(`../${turnToPageUrl}/${turnToPageUrl}`)        
        }
    },


    /*****************************************************************
     * 微信相关的API
     * @auth: Ben赖珏豪
     * @Wechat：892156860
     ******************************************************************/
    /**
     * 请勿直接调用该方法获取系统信息，调用方法 getSystemInfoData
     * @param  {Object}    options 配置参数
     * @param  {Fcnction}  options.success 获取成功回调
     * @param  {Fcnction}  options.fail 获取失败回调（可选）
     * @param  {Fcnction}  options.complete 获取完成回调（可选）
     */
    getSystemInfo(options){
        wx.getSystemInfo({
            success: function (res) { typeof options.success === 'function' && options.success(res) },
            fail: function (res) { typeof options.fail === 'function' && options.fail(res) },
            complete: function (res) { typeof options.complete === 'function' && options.complete(res) }
        });
    },
    /**
     * 发送请求
     * param.url: 开发者服务器接口地址
     * param.data: 请求的参数
     * param.header: 设置请求的 header，header 中不能设置 Referer。
     * param.method: (需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     * param.dataType: 如果设为json，会尝试对返回的数据做一次 JSON.parse
     * param.responseType: 设置响应的数据类型。合法值：text、arraybuffer
     * param.success: 收到开发者服务成功返回的回调函数
     * param.fail: 接口调用失败的回调函数
     * param.complete: 接口调用结束的回调函数（调用成功、失败都会执行）
     * param.hideLoading 是否隐藏loading
     * param.successStatusAbnormal 请求成功但是有异常流程出现的回调
     * 
     * customSiteUrl: 自定义的接口地址
     */
    sendRequest(param, customSiteUrl){
        let data = param.data || {}
        let header = param.header
        let requestUrl = ''

        if (!data.app_id) {
            data.app_id = this.getAppId()
        }

        if (!this.globalData.notBindXcxAppId) {
            data.session_key = this.getSessionKey()
        }

        if (customSiteUrl) {
            requestUrl = customSiteUrl + param.url
        }else {
            requestUrl = this.globalData.siteBaseUrl + param.url
        }

        if (param.method) {
            if (param.method.toLowerCase() == 'post') {
                data = this.modifyPostParam(data)
                header = header || { 'content-type': 'application/x-www-form-urlencoded' }
            }
            param.method = param.method.toUpperCase()
        }

        if (!param.hideLoading) {
            this.showToast({
                title: '请求中...',
                icon: 'loading'
            })
        }

        wx.request({
            url: requestUrl,
            data: data,
            method: param.method || 'GET',
            header: header || { 'content-type': 'application/json' },
            success: (res) => {
                if (res.statusCode && res.statusCode != 200) {
                    // 微信返回错误
                    this.hideToast()
                    this.showModal({ content: res.errMsg })
                    typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal(res.data)
                    return false
                }
                // 此处还需要判断是否登录，就是对接项目的状态
                typeof param.success == 'function' && param.success(res.data)
            },
            fail: (res) => {
                this.hideToast()
                this.showModal({ content: '请求失败 ' + res.errMsg })
            },
            complete: (res) => {
                param.hideLoading || this.hideToast()
                typeof param.complete == 'function' && param.complete(res.data)
            }
        })

    },
    /**
     * post请求参数格式化
     */
    modifyPostParam(){
        let query = '';
        let name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += this.modifyPostParam(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += this.modifyPostParam(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    },
    /**
     * 跳转页面
     * @param  {string}    url         页面路径
     * @param  {boolean}   isRedirect  false：打开新页面, true：在当前页面打开连接
     */
    turnToPage(url, isRedirect){
        const tabBarPagePathArr = this.getTabPagePathArr()
        // tabBar中的页面改用switchTab跳转
        if (tabBarPagePathArr.indexOf(url) != -1) {
            this.switchToTab(url)
            return
        }
        if (!isRedirect) {
            wx.navigateTo({ url });
        }else {
            wx.redirectTo({ url });
        }
    },
    /**
     * 点击底部导航跳转
     */
    switchToTab(url){
        wx.switchTab({ url })
    },
    /**
     * 关闭所有页面，打开到应用内的某个页面。
     * @param  {Object}    options          跳转参数
     * @param  {string}    options.url      需要跳转的应用页面路径，路径后可以带参数
     * @param  {Function}  options.success  接口调用成功的回调函数
     * @param  {Function}  options.fail     接口调用失败的回调函数
     * @param  {Function}  options.complete 接口调用结束的回调函数
     */
    reLaunch(options) {
        wx.reLaunch({
            url: options.url,
            success: options.success,
            fail: options.fail,
            complete: options.complete
        })
    },
    /**
     * 返回上一页
     */
    turnBack(options){
        options = options || {}
        wx.navigateBack({ delta: options.delta || 1 })
    },
    /**
     * 跳转小程序
     */
    navigateToXcx(param = {}){
        if (wx.navigateToMiniProgram) {
            wx.navigateToMiniProgram({
                appId: param.appId,
                path: param.path,
                fail: (res) => {
                    this.showModal({ content: res.errMsg })
                }
            })
        }else {
            // 提示更新版本
        }
    },
    /**
     * 设置页面标题
     */
    setPageTitle(title){
        wx.setNavigationBarTitle({ title: title })
    },
    /**
     * 显示提醒文字
     */
    showToast(param){
        wx.showToast({
            title: param.title,
            icon: param.icon,
            duration: param.duration || 1500,
            success: (res) => { typeof param.success == 'function' && param.success(res) },
            fail: (res) => { typeof param.fail == 'function' && param.fail(res) },
            complete: (res) => { typeof param.complete == 'function' && param.complete(res) }
        })
    },
    /**
     * 隐藏提醒文字
     */
    hideToast(){
        wx.hideToast()
    },
    /**
     * 展示确认弹窗
     */
    showModal(param) {
        wx.showModal({
            title: param.title || '提示',
            content: param.content,
            showCancel: param.showCancel || false,
            cancelText: param.cancelText || '取消',
            cancelColor: param.cancelColor || '#000000',
            confirmText: param.confirmText || '确定',
            confirmColor: param.confirmColor || '#3CC51F',
            success: (res) => {
                if (res.confirm) {
                    typeof param.confirm == 'function' && param.confirm(res)
                } else {
                    typeof param.cancel == 'function' && param.cancel(res)
                }
            },
            fail: (res) => {
                typeof param.fail == 'function' && param.fail(res)
            },
            complete: (res) => {
                typeof param.complete == 'function' && param.complete(res)
            }
        })
    },
    /**
     * 选择视频
     */
    chooseVideo(callback, maxDuration) {
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: maxDuration || 60,
            camera: ['front', 'back'],
            success: (res) => {
                typeof callback == 'function' && callback(res.tempFilePaths[0]);
            }
        })
    },
    /**
     * 选择照片上传
     */
    chooseImage(callback, count) {
        wx.chooseImage({
            count: count || 1, // 最多可以选择的图片张数，默认1
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: (res) => {
                const tempFilePaths = res.tempFilePaths
                let imageUrls = []
                this.showToast({ title: '提交中...', icon: 'loading', duration: 10000 })
                tempFilePaths.map(item => {
                    wx.uploadFile({
                        url: this.globalData.siteBaseUrl + this.globalData.uploadUrl,
                        filePath: item,
                        name: 'Upload[file]',
                        success: (res) =>{
                            // 做业务处理
                        },
                        fail: (res) => {
                            this.hideToast()
                            // this.showModal({ content: res.msg })
                        }
                    })
                })
            },
            fail: (res) => {
                if (res.errMsg != 'chooseImage:fail cancel') { 
                    this.showModal({ content: res.errMsg }) 
                }
            }
        })
    },
    /**
     * 预览图片
     */
    previewImage(options) {
        wx.previewImage({
            current: options.current || '',
            urls: options.urls || [options.current]
        })
    },
    /**
     * 播放音频
     */
    playVoice(filePath) {
        wx.playVoice({ filePath: filePath });
    },
    /**
     * 暂停音频
     */
    pauseVoice() {
        wx.pauseVoice();
    },
    /**
     * 统计用户分享
     */
    countUserShareApp(){
        // 发送请求给服务器接口来进行统计
    },
    /**
     * 分享小程序信息
     */
    shareAppMessage(options){
        return {
            title: options.title || this.getAppTitle() || 'BenBen Application',
            desc: options.desc || this.getAppDescription() || 'BenBen Application give you to create apps easy',
            path: options.path,
            success: () => { this.countUserShareApp() } 
        }
    },
    /**
     * 调用微信支付接口
     */
    wxPay(param){
        wx.requestPayment({
            timeStamp: param.timeStamp,
            nonceStr: param.nonceStr,
            package: param.package,
            signType: 'MD5',
            paySign: param.paySign,
            success: function(res){
                // success
            },
            fail: function() {
                // fail
            }
        })
    },
    /**
     * 微信支付成功
     */
    wxPaySuccess(param){
        // 走相对的业务，例如去通知服务器，小程序已经支付成功了，更新订单的操作
    },
    /**
     * 微信支付失败
     */
    wxPayFail(param){
        // 走相对的业务，例如去通知服务器，小程序已经支付失败了
    },
    /**
     * 拨打电话
     */
    makePhoneCall(number, callback){
        if (number.currentTarget) {
            const dataset = number.currentTarget.dataset
            number = dataset.number
        }
        wx.makePhoneCall({
            phoneNumber: number,
            success: callback
        })
    },
    /**
     * 获取地理位置
     */
    getLocation(options){
        wx.getLocation({
            type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: (res) => { options.success(res) },
            fail: options.fail
        })
    },
    /**
     * 选择地理位置
     */
    chooseLocation(options){
        wx.chooseLocation({
            success: (res) => {
                typeof options.success === 'function' && options.success(res)
            },
            fail: () => {
                if (resizeBy.errMsg === 'chooseLocation:fail auth deny') {
                    this.showModal({
                        content: '您之前拒绝授权我们使用您的定位，致使我们无法定位，是否重新授权定位？',
                        showCancel: true,
                        cancelText: "否",
                        confirmText: "是",
                        confirm: () => {
                            wx.openSetting({
                                success: (res) => {
                                    if (resizeBy.authSetting['scope.userLocation'] === true) {
                                        this.chooseLocation(options)
                                    }
                                }
                            })
                        },
                        cancel: () => {
                            typeof options.fail === 'function' && options.fail()
                        }
                    })
                }else {
                    typeof options.fail === 'function' && options.fail()
                }
            }
        })
    },
    /**
     * 在小程序内置地图里面打开当前位置
     */
    openLocation(options){
        wx.openLocation(options)
    },
    /**
     * 设置剪切板内容
     */
    setClipboardData(options){
        wx.setClipboardData({
            data: options.data || '',
            success: options.success,
            fail: options.fail,
            complete: options.complete
        })
    },
    /**
     * 获取剪切板内容
     */
    getClipboardData(options){
        wx.getClipboardData({
            success: options.success,
            fail: options.fail,
            complete: options.complete
        })
    },
    /**
     * 显示分享菜单
     */
    showShareMenu(options){
        options = options || {}
        wx.showShareMenu({
            withShareTicket: options.withShareTicket || false,
            success: options.success,
            fail: options.fail,
            complete: options.complete
        })
    },
    /**
     * 扫码
     */
    scanCode(options){
        options = options || {};
        wx.scanCode({
            onlyFromCamera: options.onlyFromCamera || false,
            success: options.success,
            fail: options.fail,
            complete: options.complete
        })
    },
    /**
     * 将页面滚动到目标位置
     */
    pageScrollTo(scrollTop) {
        if (wx.pageScrollTo) {
            wx.pageScrollTo({ scrollTop: scrollTop });
        } else {
            // 提示更新版本
        }
    },
    /**
     * 获取认证设置
     */
    getAuthSetting(){
        wx.getSetting({
            success: (res) => { return res.authSetting },
            fail: () => { return {} }
        })
    },
    /**
     * 获取存储得信息
     */
    getStorage(options) {
        options = options || {};
        wx.getStorage({
            key: options.key || '',
            success: (res) => { typeof options.success === 'function' && options.success(res) },
            fail: () => { typeof options.fail === 'function' && options.fail() },
            complete: () => { typeof options.complete === 'function' && options.complete() }
        })
    },
    /**
     * 设置存储信息
     */
    setStorage(options){
        options = options || {};
        wx.setStorage({
            key: options.key || '',
            data: options.data || '',
            success: () => { typeof options.success === 'function' && options.success() },
            fail: () => { typeof options.fail === 'function' && options.fail() },
            complete: () => { typeof options.complete === 'function' && options.complete() }
        })
    },
    /**
     * 删除存储的信息
     */
    removeStorage(options) {
        options = options || {};
        wx.removeStorage({
            key: options.key || '',
            success: () => { typeof options.success === 'function' && options.success() },
            fail: () => { typeof options.fail === 'function' && options.fail() },
            complete: () => { typeof options.complete === 'function' && options.complete() }
        })
    },
    /**
     * 创建动画
     */
    createAnimation (options) {
        options = options || {};
        return wx.createAnimation({
            duration: options.duration,
            timingFunction: options.timingFunction,
            transformOrigin: options.transformOrigin,
            delay: options.delay
        });
    },
    /**
     * 选择地址
     */
    chooseAddress(options) {
        options = options || {}
        wx.chooseAddress({
            success: (res) => {     // 选择地址完成
                typeof options.success === 'function' && options.success(res);
            },
            fail: () => {     // 取消选择地址
                typeof options.fail === 'function' && options.fail();
            },
            complete: (res) => {
                if (res && res.errMsg === 'chooseAddress:fail auth deny') {
                    // 用户拒绝授权通讯地址
                    wx.showModal({
                        title: '提示',
                        content: '获取通信地址失败，这将影响您使用小程序，是否重新设置授权？',
                        showCancel: true,
                        cancelText: "否",
                        confirmText: "是",
                        success: (res) => {
                            if (res.confirm) {
                                wx.openSetting({
                                    success: (res) => {
                                        if (res.authSetting['scope.address'] === true) {
                                            typeof options.success === 'function' && options.success(res);
                                        }
                                    }
                                })
                            } else if (res.cancel) {
                                typeof options.fail == 'function' && options.fail();
                            }
                        }
                    })
                }
                typeof options.complete === 'function' && options.complete();
            }
        })
    },
    /**
     * 下载文件
     */
    downloadFile: function (url, successfn) {
        wx.downloadFile({
            url: url,
            success: function (res) {
                successfn && successfn(res);
            }
        })
    },





    /*****************************************************************
     * 微信登录相关部分
     * @auth: Ben赖珏豪
     * @Wechat：892156860
     ******************************************************************/
    /**
     * 主动调起微信登录
     * @param {Object} options 配置登录后的操作
     * @param {Function} options.success 登录成功后的回调函数
     * @param {Function} options.fail 登录失败后的回调函数
     */
    goLogin(options){
        this.sendSessionKey(options)
    },
    /**
     * 向服务器发送本地存储的sessionKey
     * 如果没有sessionKey就调用微信登录接口
     */
    sendSessionKey(options){
        try {
            const key = wx.getStorageSync('session_key')
            if (!key) {
                console.log("check login key")
                this.login(options)
            }else {
                this.globalData.sessionKey = key
                this.sendRequest({
                    hideLoading: true,
                    url: '/登录',
                    success: () => {},
                    fail: () => {},
                })
            }
        } catch (error) {
            console.log('wx.getStorageSync session_key error');
            console.log(error);
        }
    },
    /**
     * 登录小程序
     */
    login(options){
        
    },





    /*****************************************************************
     * 其他一些工具方法
     * @auth: Ben赖珏豪
     * @Wechat：892156860
     ******************************************************************/
    /**
     * 提示更新版本
     */
    showUpdateTip(){
        this.showModal({ title: '提示', content: '您的微信版本不支持该功能，请升级更新后重试'});
    },



    /*****************************************************************
     * 全局的方法，就是一些获取或者全局的方法，例如设置用户信息，获取AppId等
     * @auth: Ben赖珏豪
     * @Wechat：892156860
     ******************************************************************/
    /**
     * 获取主页路由
     */
    getHomepageRouter(){
        return this.globalData.homepageRouter
    },
    /**
     * 获取AppId
     */
    getAppId(){
        return this.globalData.appId
    },
    /**
     * 获取默认占位图链接
     */
    getDefaultPhoto(){
        return this.globalData.defaultPhoto
    },
    /**
     * 获取sessionKey
     */
    getSessionKey(){
        return this.globalData.sessionKey
    },
    /**
     * 设置sessionKey
     */
    setSessionKey(session_key){
        this.globalData.sessionKey = session_key
        this.setSessionKey({
            key: 'session_key',
            data: session_key
        })
    },
    /**
     * 获取用户信息
     */
    getUserInfo(){
        return this.globalData.userInfo
    },
    /**
     * 设置用户信息到本地
     */
    setUserInfoToStorage(user_info){
        for (const key in user_info) {
            this.globalData.userInfo[key] = user_info[key]
        }
        this.setStorage({
            key: 'userInfo',
            data: this.globalData.userInfo
        })
    },
    /**
     * 设置用户信息到当前页面
     */
    setUserInfoToCurrentPage(){
        const currentPage = this.getAppCurrentPage()
        const newData = {}
        newData['userInfo'] = this.getUserInfo()
        currentPage.setData(newData)
    },
    /**
     * 获取当前页面实例
     */
    getAppCurrentPage() {
        var pages = getCurrentPages();
        return pages[pages.length - 1];
    },
    /**
     * 获取App的标题
     */
    getAppTitle(){
        return this.globalData.appTitle
    },
    /**
     * 获取App的描述
     */
    getAppDescription(){
        return this.globalData.appDescription
    },
    /**
     * 获取地理位置信息
     */
    getLocationInfo(){
        return this.globalData.locationInfo
    },
    /**
     * 设置地理位置信息
     */
    setLocationInfo(location_info){
        this.globalData.locationInfo = location_info
    },
    /**
     * 获取是否已经登录
     */
    getIsLogin(){
        return this.globalData.isLogin
    },
    /**
     * 设置是否已经登录
     */
    setIsLogin(isLogin){
        this.globalData.isLogin = isLogin
    },
    /**
     * 获取可切换的路径数组
     */
    getTabPagePathArr(){
        return JSON.parse(this.globalData.tabBarPagePathArr)
    },
    /**
     * 获取保存在全局变量里的系统信息。
     * 获取系统信息请调用该方法。
     * @return {Object} 系统信息 (具体字段请参考小程序官方文档 https://mp.weixin.qq.com/debug/wxadoc/dev/api/systeminfo.html)
     */
    getSystemInfoData(){
        let res
        if (this.globalData.systemInfo) {
            return this.globalData.systemInfo
        }
        try {
            res = wx.getSystemInfoSync()
            this.setSystemInfoData(res)
        } catch (error) {
            // error
        }
        return res || {}
    },
    /**
     * 设置系统信息
     */
    setSystemInfoData: function (res) {
        this.globalData.systemInfo = res;
    },

    /**
     * 全局的数据
     * userInfo: 用户信息
     * homepageRouter： 主页路由
     * appId： AppId
     * defaultPhoto：默认占位图
     * sessionKey: sessionKey
     * appTitle: App的标题
     * appDescription：App的描述
     * locationInfo： 地理位置
     * notBindXcxAppId: 没有绑定小程序的AppId
     * isLogin: 是否登录
     * systemInfo: 系统相关信息
     * tabBarPagePathArr: 底部栏的路径
     * siteBaseUrl: 接口地址
     * uploadUrl: 上传的地址
     */
    globalData: {
        userInfo: null,
        homepageRouter: '',
        appId: '',
        defaultPhoto: '',
        sessionKey: '',
        appTitle: '',
        appDescription: '',
        locationInfo: {
            latitude: '',
            longitude: '',
            address: ''
        },
        notBindXcxAppId: false,
        siteBaseUrl: 'https://juzhongke.com/api/',
        isLogin: false,
        systemInfo: null,
        tabBarPagePathArr: '["/pages/page10000/page10000","/pages/page10001/page10001"]',
        uploadUrl: 'https://上传的地址！！'
    }
}

App(app)