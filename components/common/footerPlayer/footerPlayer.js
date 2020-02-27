import create from '../../../utils/store/create'
import store from '../../../store/index'
create.Component(store, {
  //使用共享的数据 
  use: ['backgroundAudioManager', 'playlist'],
  // 指针对store中的数据，不会对组件内部的数据生效
  computed: {

  },
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    status: 2,
    show: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toPlayer() {
      wx.navigateTo({
        url: '/pages/player/player'
      });
    },
    play() {
      if (this.data.status === 1) {
        console.log(this.store.data.backgroundAudioManager.title);
        this.store.data.backgroundAudioManager.pause()
        this.setData({
          status: 0
        })
      } else {
        this.store.data.backgroundAudioManager.play()
        this.setData({
          status: 1
        })
      }
    }
  },
  pageLifetimes: {
    show() {
      let _this = this
      wx.getBackgroundAudioPlayerState({
        success(res) {
          setTimeout(() => {
            _this.setData({
              status: res.status,
              show: _this.store.data.playlist[0]
            })
          }, 200)
        }
      })
    }

    // let systemInfo = wx.getSystemInfoSync()
    // // px转换到rpx的比例
    // let pxToRpxScale = 750 / systemInfo.windowWidth;
    // // 状态栏的高度
    // let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
    // // 导航栏的高度
    // let navigationHeight = 44 * pxToRpxScale
    // // window的宽度
    // let ktxWindowWidth = systemInfo.windowWidth * pxToRpxScale
    // // window的高度
    // let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
    // // 屏幕的高度
    // let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
    // // 底部tabBar的高度
    // let tabBarHeight = ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight
    // console.log(tabBarHeight);
  }
})