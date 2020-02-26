import api from "../../http/api";

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    user: '',
    password: ''
  },
  onChange(e) {
    this.setData({
      active: e.detail.index,
      user: '',
      password: ''
    })
  },
  login() {
    wx.navigateTo({
      url: '/pages/my/my'
    });
    if (this.data.user === '' || this.data.password === '') {
      wx.showToast({
        title: `${this.data.active===0?'手机':'邮箱'}和密码不能为空`,
        icon: 'none',
        duration: 1500
      });
      return
    }
    this.data.active === 0 ? this.phoneCheck() : this.emailCheck()
  },
  toRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  },
  phoneCheck() {
    var pattern = /^1[3456789]\d{9}$/
    if (pattern.test(this.data.user)) {
      api.loginbyTel(this.data.user, this.data.password).then(res => {
        if (res.code === 200) {
          wx.showToast({
            title: '登录成功',
            duration: 1500
          });
          wx.setStorageSync("uid", res.account.id);
          wx.switchTab({
            url: '/pages/my/my'
          });
        } else if (res.code === 501) {
          //账号不存在
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500,
          });
        } else if (res.code === 502) {
          //密码错误
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500,
          });
        }
      }).catch(err => {
        if (err.status === 501) {
          wx.showToast({
            title: '您的手机号未注册',
            icon: 'none',
            duration: 1500,
          })
        }
      });
    } else {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 1500,
      });
    }
    this.setData({
      user: '',
      password: ''
    })
  },
  emailCheck() {
    var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (pattern.test(this.data.user)) {
      api.loginbyEmail(this.data.user, this.data.password).then(res => {
        if (res.code === 200) {
          wx.showToast({
            title: '登录成功',
            duration: 1500
          });
          wx.setStorageSync("uid", res.account.id);
          wx.switchTab({
            url: '/pages/my/my'
          });
        } else if (res.code === 502) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500,
          });
        }
      }).catch(err => {
        if (err.status === 501) {
          wx.showToast({
            title: '您的邮箱未注册',
            icon: 'none',
            duration: 1500,
          });
        }
      });

    } else {
      wx.showToast({
        title: '邮箱格式错误',
        icon: 'none',
        duration: 1500,
      });
    }
    this.setData({
      user: '',
      password: ''
    })
  },
  changeUser(e) {
    this.setData({
      user: e.detail
    })
  },
  changePass(e) {
    this.setData({
      password: e.detail
    })
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
    wx.setNavigationBarTitle({
      title: '登录'
    });
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