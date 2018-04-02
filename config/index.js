const { resolve } = require('path')
const r = url => resolve(__dirname, url)
const assetsPath = resolve(process.cwd(), './dist')

module.exports = {
    "json": {
        "pages": [
            "pages/index/index",
            "pages/logs/logs"            
        ],
        "tabBar": {
            "selectedColor": "#5aaca5",
            "color": "#565656",
            "list": [
                {
                    "iconPath": "static/img/home.png",
                    "selectedIconPath": "static/img/home-selected.png",
                    "pagePath": "pages/index/index",
                    "text": "首页"
                },
                {
                    "iconPath": "static/img/shopping.png",
                    "selectedIconPath": "static/img/shopping-selected.png",
                    "pagePath": "pages/logs/logs",
                    "text": "日志"
                },
            ]
        }
    },
    "window": {
        "backgroundTextStyle": "light",
        "navigationBarBackgroundColor": "#fff",
        "navigationBarTextStyle": "#fff"
    },
    "assetsPath": assetsPath,
    "app": r('../app.js')
}