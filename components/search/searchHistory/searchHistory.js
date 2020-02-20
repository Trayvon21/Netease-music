import Dialog from '../../../lib/vant/dialog/dialog';
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    histories: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openClose() {
      this.setData({
        show: !this.data.show
      })
    },
    goClear(e) {
      if (e.detail.item.text === '取消') {
        this.openClose()
      } else {
        wx.removeStorageSync('histories');
        this.triggerEvent('send', [])
        wx.showToast({
          title: '清除成功',
          icon: 'success',
          duration: 1500,
        });
        this.openClose()
      }
    },
    goSearch(e){
      this.triggerEvent('goSearch', e.currentTarget.dataset.keyword)
    }
  }
})