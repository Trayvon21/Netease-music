import create from '../../../utils/store/create'
import store from '../../../store/index'
create.Component(store, {
  //使用共享的数据 
  use: ['playlist', 'playIndex', 'playType', 'bgm'],
  // 指针对store中的数据，不会对组件内部的数据生效
  computed: {
    length() {
      return this.playlist.length
    },
    height() {
      return `${this.playIndex * 60}rpx`
    }
  },
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    type: 0,
    scrollTop: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    del(e) {
      let playlist = this.store.data.playlist
      this.store.data.playlist = playlist.filter(item => item.id !== e.currentTarget.dataset.id)
    },
    typeChange() {
      let num = this.store.data.playType
      num === 2 ? num = 0 : num++
      wx.showToast({
        title: `${num===1?'列表循环':num===2?'单曲循环':'随机循环'}`,
        icon: 'none',
        duration: 1500
      });
      this.store.data.playType = num
    },
    gotoPlay(e) {
      wx.navigateTo({
        url: `/pages/player/player?songId=${e.currentTarget.dataset.id}`
      });
    },
    delAll() {
      wx.showModal({
        title: `您是否删除播放列表`,
        content: `确定后将返回上一级`,
        success: (res => {
          if (res.confirm) {
            this.store.data.bgm.stop()
            this.store.data.bgm = null
            this.store.data.playIndex = 0
            this.store.data.playlist = []
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 500,
              mask: false,
              success: (result) => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 500)
              },
              fail: () => {},
              complete: () => {}
            });
          } else if (res.cancel) {
            wx.showToast({
              title: '您已取消删除',
              icon: 'none',
              duration: 500,
            });
          }
        })
      })

    }
  },
  lifetimes: {
    ready() {
      setTimeout(() => {
        this.setData({
          scrollTop: `${this.store.data.playIndex*80}rpx`
        })
      }, 500)
      console.log(this.data.scrollTop);
    }
  }
})