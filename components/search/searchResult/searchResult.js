import api from "../../../http/api";

// components/searchResult/searchResult.js
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
    active: 1018,
    searchType: [{
        id: 1018,
        name: "综合"
      },
      {
        id: 1,
        name: "单曲"
      },
      {
        id: 1014,
        name: "视频"
      },
      {
        id: 100,
        name: "歌手"
      },
      {
        id: 10,
        name: "专辑"
      },
      {
        id: 1000,
        name: "歌单"
      },
      {
        id: 1009,
        name: "电台"
      },
      {
        id: 1002,
        name: "用户"
      },
      {
        id: 1004,
        name: "MV"
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      this.setData({
        active: e.detail.name
      })
    }
  },
  ready() {

    api.searchType
  }

})