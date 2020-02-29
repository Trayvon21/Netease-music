import create from '../../utils/store/create'
import store from '../../store/index'
import api from "../../http/api"

create.Page(store, {
  //使用共享的数据 
  use: ['bgm', 'playlist'],
  // 指针对store中的数据，不会对组件内部的数据生效
  computed: {
    length() {
      return this.playlist.length
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    djRadio: {},
    programs: [],
    navList: [{
      title: '详情'
    }, {
      title: '节目'
    }],
    active: '详情',
    showFlag: false,
    count: 0,
    id: ''
  },
  navBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  changNav(e) {
    this.setData({
      active: e.currentTarget.dataset.title
    })
  },
  changShow() {
    this.setData({
      showFlag: true
    })
  },
  gotoPlay(e) {
    wx.navigateTo({
      url: `/pages/player/player?programId=${e.currentTarget.dataset.id}`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDjDetail(options.id)
    this.getProgramList(options.id)
  },
  getDjDetail(id) {
    api.djDetail(id).then(res => {
      if (res.code === 200) {
        console.log(res.djRadio);
        this.setData({
          djRadio: res.djRadio
        })
      }
    })
  },
  getProgramList(id, offset = 0) {
    let programs = this.data.programs
    api.programList(id, offset).then(res => {
      if (res.code === 200) {
        programs.push(...res.programs)
        this.setData({
          programs: programs,
          count: res.count,
          id: id
        })
      }
    })
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
    if (this.data.active === '节目') {
      if (this.data.count > this.data.programs.length) {
        this.getProgramList(this.data.id, this.data.programs.length)
      } else {
        wx.showToast({
          title: '已经到底了...',
          icon: 'none',
          duration: 1500
        });
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})