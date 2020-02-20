// components/searchHot/searchHot.js
Component({
  options:{
    addGlobalClass:true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    hotList: {
      type: Array,
      value: []
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
    searchNow(e){
      this.triggerEvent('send',e.currentTarget.dataset.keyword)
    }
  }
})