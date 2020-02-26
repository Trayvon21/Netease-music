import api from "../../http/api";

// pages/register/register.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    //验证码
    captcha: '',
    //昵称
    nickname: '',
    disabled: false,
    btnValue: '发送验证码'
  },
  goToLogin() {
    wx.navigateTo({
      url: '../../pages/login/login',
    });
  },
  //点击注册
  register() {
    if (this.data.phone === '' ||
      this.data.password === '' ||
      this.data.captcha === '' ||
      this.data.nickname === '') {
      wx.showToast({
        title: '内容输入不完善',
        icon: 'none',
        duration: 1500
      });
      return
    }
    api.register(this.data.captcha, this.data.phone, this.data.password, this.data.nickname).then(res => {
      if (res.code === 200) {
        wx.showToast({
          title: "注册成功",
          icon: 'none',
          duration: 1500,
        });
        this.goToLogin()
      }
      //验证码错误
      else if (res.code === 503) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        });
        this.setData({
          captcha: ''
        })
      }
    }).catch(err => {
      if (err.status === 505) {
        wx.showToast({
          title: '昵称被占用',
          icon: 'none',
          duration: 1500,
        });
        this.setData({
          nickname: ''
        })
      }
      console.log(err);
    });
  },
  // 绑定手机号
  changePhone(e) {
    this.setData({
      phone: e.detail
    })
  },
  //绑定密码
  changePass(e) {
    this.setData({
      password: e.detail
    })

  },
  //绑定验证码
  changeCaptcha(e) {
    this.setData({
      captcha: e.detail
    })
  },
  //绑定昵称
  changeNickname(e) {
    this.setData({
      nickname: e.detail
    })
  },
  // 发送验证码
  sendCaptcha() {
    var pattern = /^1[3456789]\d{9}$/
    if (this.data.phone === '' || !pattern.test(this.data.phone)) {
      wx.showToast({
        title: "手机号输入有误",
        icon: 'none',
        duration: 1500,
      });
      this.setData({
        phone: ''
      })
      return;
    }
    api.checkTel(this.data.phone).then(res => {
      if (res.exist === -1) {
        let timer = null;
        clearInterval(timer);
        let time = 5;
        timer = setInterval(() => {
          if (time <= 0) {
            this.data.btnValue = "";
            this.data.btnValue = "点击重新发送";
            this.data.disabled = false;
            this.setData({
              btnValue: this.data.btnValue,
              disabled: this.data.disabled
            })
            clearInterval(timer);
          } else {
            this.data.disabled = true;
            this.data.btnValue = "";
            this.data.btnValue = "剩余时间" + time + "秒";
            this.setData({
              btnValue: this.data.btnValue,
              disabled: this.data.disabled
            })
            time--;
          }
        }, 1000);
        api.sendCaptcha(this.data.phone).then(res => {
          if (res.code === 200) {
            wx.showToast({
              title: "短信已发送至您手机",
              icon: 'none',
              duration: 1500
            });
          }
        }).catch(err => {
          console.log(err);
        });
      }
      if (res.exist === 1) {
        wx.showToast({
          title: `已注册,用户名${res.nickname}`,
          icon: 'none',
          duration: 1500,
        });
      }
    }).catch(err => {});
  },
  //简单的密码正则
  verify(str) {
    // let a = /[\u4e00-\u9fa5]/; //汉字正则
    let a = /[a-z]/; //小写验证
    let b = /[A-Z]/; //大写验证
    let c = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"); //特殊符号验证
    let d = /[0-9]/; //数字验证
    let zx = [a, b, c, d] //方便遍历
    let nx = 0;
    for (let i in zx) {
      if (zx[i].test(str)) {
        nx++
      }
    }
    if (nx > 2) {
      return true;
    } else if (nx <= 2) {
      return false
    }
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
      title: '注册'
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