// components/searchResult/resultSong/resultSong.js
Component({
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
    toPlayAll() {
      let arr = []
      this.properties.result.songs.map(item => {
        arr.push(item.id)
      })
      wx.navigateTo({
        url: `/pages/player/player?songId=${arr[0]}&ids=${JSON.stringify(arr)}`
      });
    }
  },
  ready() {
    console.log(this.properties);
  }
})