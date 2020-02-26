// components/homeBox/homeBox.js
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    List: {
      type: Array,
      value: []
    },
    flag: {
      type: Boolean,
      value: false
    },
    type: {
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
    goDetail(e) {
      if (this.properties.type === 'playlist') {
        wx.navigateTo({
          url: `/pages/playListDetail/playListDetail?id=${e.currentTarget.dataset.id}`
        });
      } else if (this.properties.type === 'album') {
        wx.navigateTo({
          url: `/pages/playListDetail/playListDetail?albumId=${e.currentTarget.dataset.id}`
        });
      } else if (this.properties.type === 'dj') {
        wx.navigateTo({
          url: `/pages/djRadioDetail/djRadioDetail?id=${e.currentTarget.dataset.id}`
        });
      } else if (this.properties.type === 'song') {
        wx.navigateTo({
          url: `/pages/player/player?songId=${e.currentTarget.dataset.id}`
        });
      } else if (this.properties.type === 'program') {
        wx.navigateTo({
          url: `/pages/player/player?programId=${e.currentTarget.dataset.id}`
        });
      }

    }
  }
})