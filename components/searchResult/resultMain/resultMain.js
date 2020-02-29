Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    result: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    readmore(e) {
      this.triggerEvent('readmore', e.currentTarget.dataset.type)
    },
    gotoSearch(e) {
      this.triggerEvent('getStorge', e.currentTarget.dataset.keyword)
    },
    gotoPlay() {
      wx.navigateTo({
        url: `/pages/player/player?songId=${this.properties.result.song.resourceIds[0]}&ids=${JSON.stringify(this.properties.result.song.resourceIds)}`
      });
    }
  },
  ready() {
    console.log(this.properties.result);
  }
})