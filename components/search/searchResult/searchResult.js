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
    searchTypes: [{
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
      let name = ''
      e.detail.name ? name = e.detail.name : name = e.detail
      this.setData({
        active: Number(name)
      })
      console.log(e);
      console.log(this.data.active);
      this.triggerEvent("send", name)
    },
    pullUp() {
      let result = this.properties.result
      let count = 0
      result.songCount && result.songCount > result.songs.length ? count = result.songs.length : ''
      result.videoCount && result.videoCount > result.videos.length ? count = result.videos.length : ''
      result.artistCount && result.artistCount > result.artists.length ? count = result.artists.length : ''
      result.albumCount && result.albumCount > result.albums.length ? count = result.albums.length : ''
      result.playlistCount && result.playlistCount > result.playlists.length ? count = result.playlists.length : ''
      result.djRadiosCount && result.djRadiosCount > result.djRadios.length ? count = result.djRadios.length : ''
      result.userprofileCount && result.userprofileCount > result.userprofiles.length ? count = result.userprofiles.length : ''
      result.mvCount && result.mvCount > result.mvs.length ? count = result.mvs.length : ''
      console.log(count);
      if (count !== 0) {
        this.triggerEvent("pullUp", {
          id: this.data.active,
          count: count
        })
      } else {
        wx.showToast({
          title: '到底了...',
          icon: 'none',
          duration: 1500
        })
      }
    },
    getStorge(e) {
      console.log(e);
      this.triggerEvent('getStorge', e.detail)
    }
  },
  observers() {
    result: (val) => {
      console.log(res);
    }
  },

  ready() {

    api.searchType
  }

})