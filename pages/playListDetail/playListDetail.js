import create from '../../utils/store/create'
import store from '../../store/index'
import api from "../../http/api"

create.Page(store, {
  //使用共享的数据 
  use: ['bgm', 'playlist', 'screenMsg'],
  // 指针对store中的数据，不会对组件内部的数据生效
  computed: {
    length() {
      return this.playlist.length
    }
  },
  data: {
    playlist: null,
    album: null,
    songs: [],
    ids: [],
    showName: true,
    statusBarHeight: 0,
    screenHeight: 0,
    opacity: 0,
    fixed: false,
    fixedCss: '',
    scrollTop: null
  },
  toplay(e) {
    wx.navigateTo({
      url: `/pages/player/player?songId=${e.currentTarget.dataset.id}`
    });
  },
  toplayAll() {
    wx.navigateTo({
      url: `/pages/player/player?songId=${this.data.ids[0]}&ids=${JSON.stringify(this.data.ids)}`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.id ? this.getPlaylistDetails(options.id) : this.getAlbum(options.albumId)
  },
  getAlbum(id) {
    api.getAlbum(id).then(res => {
      if (res.code === 200) {
        let ids = []
        res.songs.map(item => {
          ids.push(item.id)
        })
        this.setData({
          album: res.album,
          songs: res.songs,
          ids: ids
        })
        wx.createSelectorQuery().select('#toplayAll').boundingClientRect(rect => {
          this.setData({
            scrollTop: rect.top
          })
        }).exec()
      }
    })
  },
  getPlaylistDetails(id) {
    api.getPlaylistDetails(id).then(res => {
      if (res.code === 200) {
        let ids = []
        res.playlist.tracks.map(item => {
          ids.push(item.id)
        })
        this.setData({
          playlist: res.playlist,
          ids: ids
        })
        wx.createSelectorQuery().select('#toplayAll').boundingClientRect(rect => {
          this.setData({
            scrollTop: rect.top
          })
        }).exec()
      }
    })
  },
  navBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  opacityChange(e) {
    let showName = true
    let opacity = (e.detail.scrollTop / (this.data.scrollTop - this.data.statusBarHeight - 44))
    e.detail.scrollTop >= 120 ? showName = false : showName = true
    if (e.detail.scrollTop > (this.data.scrollTop - this.data.statusBarHeight - 44)) {
      this.setData({
        fixed: true,
        opacity: 1
      })
    } else {
      this.setData({
        fixed: false,
        opacity: opacity,
        showName: showName
      })
    }


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      statusBarHeight: this.store.data.screenMsg.statusBarHeight,
      screenHeight: this.store.data.screenMsg.screenHeight,
      fixedCss: this.store.data.screenMsg.fixedCss
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})