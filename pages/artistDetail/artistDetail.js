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
  /**
   * 页面的初始数据
   */
  data: {
    artists: {},
    id: '',
    navList: [{
      title: "主页"
    }, {
      title: "歌曲",
      num: 0
    }, {
      title: "专辑",
      num: 0
    }, {
      title: "视频",
      num: 0
    }],
    active: '主页',
    desc: {},
    hotAlbums: [],
    mvs: [],
    ids: [],
    showName: true,
    statusBarHeight: 0,
    screenHeight: 0,
    opacity: 0,
    fixed: false,
    fixedCss: '',
    scrollTop: null,
    scrollHeight: null
  },
  toplay(e) {
    wx.navigateTo({
      url: `/pages/player/player?songId=${e.currentTarget.dataset.id}`
    });
  },
  navBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  getArtistDetails(id) {
    api.getArtistDetails(id).then(res => {
      if (res.code === 200) {
        this.setData({
          desc: res
        })
      }
    })
  },
  getAlbum(id, offset = 0) {
    let hotAlbums = this.data.hotAlbums
    api.getAlbums(id, offset).then(res => {
      if (res.code === 200) {
        hotAlbums.push(...res.hotAlbums)
        this.setData({
          hotAlbums: hotAlbums
        })
      }
    })
  },
  getArtists(id) {
    api.artists(id).then(res => {
      if (res.code === 200) {
        let navList = this.data.navList
        navList[1].num = res.artist.musicSize
        navList[2].num = res.artist.albumSize
        navList[3].num = res.artist.mvSize
        let arr = []
        res.hotSongs.map(item => {
          arr.push(item.id)
        })
        this.setData({
          ids: arr,
          artists: res,
          navList: navList
        })
      }
    })
  },
  getArtistMv(id, offset = 0) {
    api.getArtistMv(id, offset).then(res => {
      if (res.code === 200) {
        this.setData({
          mvs: res.mvs
        })
      }
    })
  },
  moreSongs() {
    this.setData({
      active: "歌曲"
    })
  },
  more() {
    wx.showToast({
      title: '暂无更多歌曲',
      icon: 'none',
      duration: 1500
    });
  },
  changNav(e) {
    this.setData({
      active: e.currentTarget.dataset.title,
      scrollTop: this.data.scrollHeight - this.data.statusBarHeight - 44,
      showName: false
    })
  },
  toPlayAll() {
    wx.navigateTo({
      url: `/pages/player/player?songId=${this.data.ids[0]}&ids=${JSON.stringify(this.data.ids)}`
    });
  },
  opacityChange(e) {
    let showName = true
    console.log(e.detail.scrollTop, (this.data.scrollHeight - this.data.statusBarHeight - 44));
    e.detail.scrollTop >= 120 ? showName = false : showName = true
    if (e.detail.scrollTop > (this.data.scrollHeight - this.data.statusBarHeight - 44)) {
      this.setData({
        fixed: true,
        opacity: 1,
      })
    } else {
      this.setData({
        fixed: false,
        opacity: (e.detail.scrollTop / (this.data.scrollHeight - this.data.statusBarHeight - 44)),
        showName: showName
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getArtistDetails(options.id)
    this.getAlbum(options.id)
    this.getArtists(options.id)
    this.getArtistMv(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.createSelectorQuery().select('#nav').boundingClientRect(rect => {
      this.setData({
        scrollHeight: rect.top
      })
    }).exec()
    this.setData({
      statusBarHeight: this.store.data.screenMsg.statusBarHeight,
      screenHeight: this.store.data.screenMsg.screenHeight,
      fixedCss: this.store.data.screenMsg.fixedCss
    })
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
    if (this.data.active === '专辑') {
      if (this.data.hotAlbums.length < this.data.navList[2].num) {
        this.getAlbum(this.data.id, this.data.hotAlbums.length)
      } else {
        wx.showToast({
          title: '没有更多内容了',
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