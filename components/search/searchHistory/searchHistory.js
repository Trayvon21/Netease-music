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
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    goClear(e) {
      wx.showModal({
        title: '删除历史记录',
        content: '确定将清除历史记录',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            wx.removeStorageSync('histories');
            this.triggerEvent('send', [])
            wx.showToast({
              title: '清除成功',
              icon: 'success',
              duration: 1500,
            });
          }
        },
        fail: () => {},
        complete: () => {}
      });
    },
    goSearch(e) {
      this.triggerEvent('goSearch', e.currentTarget.dataset.keyword)
    }
  }
})