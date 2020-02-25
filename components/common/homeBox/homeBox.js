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
      } else if (this.properties.type === 'song') {
        console.log(1);
      }else if(this.properties.type==='dj'){
        console.log('dj');
      }

    }
  }
})