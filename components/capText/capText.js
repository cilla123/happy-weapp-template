/**
 * 文本
 * title: 文本内容
 * textAlign: 对齐方式(left, center, right)
 * fontSize: 字体大小(big, middle, small)
 * backgroundColor: 背景颜色
 * fontColor: 字体颜色
 * linkId: 链接Id
 * linkType: 链接类型
 * linkUrl: 链接url
 * alias: 别名
 * phone: 电话
 * turnTopage: 要跳转的页面
 * eventType: 事件类型(tapPhoneCallHandler, customTurnToPage)
 */
Component({
    properties: {
        title: {
            type: String,
            value: ''
        },
        textAlign: {
            type: String,
            value: 'left'
        },
        fontSize:{
            type: String,
            value: 'big'
        },
        backgroundColor: {
            type: String,
            value: '#fff'
        },
        fontColor: {
            type: String,
            value: '#333'
        },
        linkId: {
            type: String,
            value: ''
        },
        linkType: {
            type: String,
            value: ''
        },
        linkTitle: {
            type: String,
            value: ''
        },
        linkUrl: {
            type: String,
            value: ''
        },
        alias: {
            type: String,
            value: ''
        },
        phone: {
            type: String,
            value: ''
        },
        turnTopage: {
            type: String,
            value: ''
        },
        eventType: {
            type: String,
            value: ''
        }
    },
    data: {

    },
    methods: {
        /**
         * 点击事件
         */
        tapHandler() {
            const { eventType, phone, turnTopage } = this.properties
            switch (eventType) {
                case 'tapPhoneCallHandler':
                    this.triggerEvent('tapPhoneCallHandler', { phone })
                    break;
                case 'customTurnToPageHandler':
                    this.triggerEvent('customTurnToPageHandler', { turnTopage })
                    break;
                default:
                    break;
            }
        }
    }
})