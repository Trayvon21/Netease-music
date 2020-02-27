import api from "../../http/api"

// pages/playListDetail/playListDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playlist: {},
    album: {},
    songs: []
  },
  toplay(e) {
    wx.navigateTo({
      url: `/pages/player/player?songId=${e.currentTarget.dataset.id}`
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
        this.setData({
          album: res.album,
          songs: res.songs
        })
      }
    })
  },
  getPlaylistDetails(id) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    api.getPlaylistDetails(id).then(res => {
      if (res.code === 200) {
        this.setData({
          playlist: res.playlist
        })
        wx.hideLoading();
      }
    })
  },
  navBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

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
  onPullDownRefresh: function () {

  },

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