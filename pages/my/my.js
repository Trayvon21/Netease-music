import api from "../../http/api";

// pages/my/my.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    user: {}
  },
  toLogin() {
    wx.navigateTo({
      url: '../../pages/login/login'
    });
  },
  getUserInfo() {
    api.userInfo(this.data.uid).then(res => {
      if (res.code === 200) {
        if (!wx.getStorageSync(`userInfo-${this.data.uid}`)) {
          let obj = {
            nickname: res.profile.nickname,
            gender: res.profile.gender,
            signature: res.profile.signature,
            province: res.profile.province,
            city: res.profile.city,
            birthday: res.profile.birthday,
          }
          wx.setStorageSync(`userInfo-${this.data.uid}`, JSON.stringify(obj));
        } else {
          let obj = JSON.parse(wx.getStorageSync(`userInfo-${this.data.uid}`))
          res.profile.nickname = obj.nickname
          res.profile.gender = obj.gender
          res.profile.province = obj.province
          res.profile.city = obj.city
          res.profile.birthday = obj.birthday
          res.profile.signature = obj.signature
        }
        this.setData({
          user: res
        })
      }
    }).catch(err => {
      console.log(err);
    });
  },
  outLogin() {
    if (wx.getStorageSync("uid")) {
      wx.showModal({
        title: '退出提示',
        content: '您确定要退出登录吗',
        success: (res => {
          if (res.confirm) {
            wx.removeStorageSync("uid");
            this.setData({
              uid: ''
            })
          } else if (res.cancel) {}
        })
      })
    }

  },
  changeEditor() {
    wx.navigateTo({
      url: `../../pages/editor/editor?uid=${this.data.uid}`,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (wx.getStorageSync("uid")) {
      this.setData({
        uid: wx.getStorageSync("uid")
      })
      this.getUserInfo();
    }
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