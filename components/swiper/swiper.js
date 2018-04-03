/**
 * 轮播
 * indicatorDots: 是否显示面板指示点
 * indicatorColor: 指示点颜色
 * indicatorActiveColor: 当前选中的指示点颜色
 * autoplay: 是否自动切换
 * current：当前所在页面的 index
 * interval：自动切换时间间隔
 * duration：滑动动画时长
 * circular：是否采用衔接滑动
 * images: 图片数组
 * vertical：滑动方向是否为纵向
 * bindchange：current 改变时会触发 change 事件，event.detail = {current: current, source: source}
 * alias: 别名
 * eventType: 事件类型(swiperChange)
 */
Component({
    properties: {
        indicatorDots: {
            type: Boolean,
            value: true
        },
        indicatorColor: {
            type: String,
            value: '#f60'
        },
        indicatorActiveColor: {
            type: String,
            value: '#000000'
        },
        autoplay: {
            type: Boolean,
            value: true
        },
        current: {
            type: Number,
            value: 0
        },
        interval: {
            type: Number,
            value: 5000
        },
        duration: {
            type: Number,
            value: 500
        },
        circular: {
            type: Boolean,
            value: false
        },
        images: {
            type: Array,
            value: []
        },
        alias: {
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
         * 点击轮播
         */
        tapSwiperHandler(event) {
            const currentItem = event.target.dataset.current_item
            this.triggerEvent('tapSwiperHandler', { currentItem })
        },
        /**
         * 轮播图片发生改变
         */
        swiperChange(event) {
            this.triggerEvent('swiperChange', { event })
        }
    }
})