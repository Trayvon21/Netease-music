import area from '../../lib/area/area'
// pages/editor/editor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    nickname: '',
    gender: '未知',
    birthday: '',
    province: '510000',
    city: '510100',
    cityShow: '',
    signature: '',
    genderFlag: false,
    birthFlag: false,
    cityFlag: false,
    genders: [{
        name: '男'
      },
      {
        name: '女'
      },
      {
        name: '保密'
      }
    ],
    areaList: area,
    currentDate: new Date().getTime(),
    minDate: -2209017600000,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return `${value}日`;
    }
  },
  changeNickname(e) {
    this.setData({
      nickname: e.detail
    })
  },
  changeGender() {
    this.setData({
      genderFlag: !this.data.genderFlag
    })
  },
  selectGender(e) {
    console.log(e);
    let genderNum = 0
    e.detail.name === '男' ? genderNum = 1 : e.detail.name === '女' ? genderNum = 2 : ''
    this.setData({
      gender: genderNum
    });
  },
  selectBirth(e) {
    this.setData({
      birthday: e.detail,
      birthFlag: false
    })
  },
  changeBirth() {
    this.setData({
      birthFlag: !this.data.birthFlag
    })
  },
  selectCity(e) {
    console.log(e);
    this.setData({
      cityShow: e.detail.values[0].name + e.detail.values[1].name,
      province: e.detail.values[0].code,
      city: e.detail.values[1].code,
      cityFlag: false
    })
  },
  changeCity() {
    this.setData({
      cityFlag: !this.data.cityFlag
    })
  },
  changeSignature(e) {
    this.setData({
      signature: e.detail
    })
  },
  confirm() {
    let obj = {
      nickname: this.data.nickname,
      gender: this.data.gender,
      signature: this.data.signature,
      province: this.data.province,
      city: this.data.city,
      birthday: this.data.birthday,
    }

    wx.showModal({
      title: '确认修改',
      content: '点击确认将保存修改，取消则恢复',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          wx.setStorageSync(`userInfo-${this.data.uid}`, JSON.stringify(obj));
          wx.showToast({
            title: '修改成功',
            duration: 500
          });
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/my/my'
            });
          }, 500)
        }
        if (result.cancel) {
          this.setDefault()
        }
      },
      fail: () => {},
      complete: () => {}
    });
  },
  setDefault() {
    let uid = wx.getStorageSync('uid')
    console.log(uid);
    let obj = JSON.parse(wx.getStorageSync(`userInfo-${uid}`))
    this.setData({
      uid: uid,
      nickname: obj.nickname,
      gender: obj.gender,
      province: obj.province,
      city: obj.city,
      birthday: obj.birthday,
      signature: obj.signature,
      cityShow: area.province_list[obj.province] + area.city_list[obj.city]
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setDefault()
  }
})