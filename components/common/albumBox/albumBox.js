Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    size: {
      type: String,
      value: ''
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
    gotoDetail() {
      wx.navigateTo({
        url: `/pages/playListDetail/playListDetail?albumId=${this.properties.item.id}`
      });
    }
  }
})