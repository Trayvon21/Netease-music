import api from "../../http/api"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //首页数据
    topNav: [{
        pic: 'list',
        name: '每日推荐'
      },
      {
        pic: 'song',
        name: '歌单'
      },
      {
        pic: 'rank',
        name: '排行榜'
      },
      {
        pic: 'dj',
        name: '电台'
      },
      {
        pic: 'online',
        name: '直播'
      },
    ],
    banners: [],
    newDisc: [],
    newsong: [],
    recommendList: [],
    djprograms: [],
    recommends: [],
    actived: '1',
    //搜索数据
    searchFlag: false,
    keywords: {},
    value: "",
    result: null,
    suggest: [],
    sugFlag: false,
    hotList: [],
    histories: [],
    scrollTop: '',
    page: 1
  },

  changeNew(e) {
    this.setData({
      actived: e.currentTarget.dataset.active
    })
  },
  swiperGo() {
    wx.showToast({
      title: '功能开发中...',
      icon: 'none',
      duration: 1500,
    });
  },
  //进入/离开搜索页面/清除搜索
  goSearch() {
    if (this.data.result !== null) {
      this.setData({
        result: null,
        value: ''
      })
      wx.showLoading({
        title: "加载中...",
        mask: true,
      });
      this.getSearchDefalut()
    } else {
      this.setData({
        searchFlag: !this.data.searchFlag
      })
    }
  },
  bindinput(e) {
    this.setData({
      value: e.detail.value,
      sugFlag: true
    })
    if (e.detail.value.trim() !== '') {
      api.searchSuggest(e.detail.value).then(res => {
        if (res.code === 200) {
          this.setData({
            suggest: res.result.allMatch
          })
        }
      })
    } else {
      this.setData({
        suggest: []
      })
    }

  },
  //点击搜索
  SearchNow(e) {
    //搜索框
    let keyword = e.detail.value
    if (e.currentTarget.dataset.sug) {
      //搜索推荐
      keyword = e.currentTarget.dataset.sug
      console.log('搜索推荐');
    } else if (typeof (e.detail) === 'string') {
      //热搜
      keyword = e.detail
      console.log('热搜');
    } else if (e.detail.value === '') {
      //默认值搜索
      console.log('默认值搜索');
      keyword = this.data.keywords.realkeyword
    }
    let histories = this.data.histories
    histories = histories.filter(item => item !== keyword)
    histories.unshift(keyword)
    wx.setStorageSync("histories", JSON.stringify(histories));
    this.setData({
      value: keyword,
      histories: histories
    })
    this.getResult()
  },
  //搜索之后
  getResult(e) {
    wx.showLoading({
      title: "加载中...",
      mask: true,
    });
    let keyword = this.data.value
    let searchType = 1018
    if (e) {
      searchType = e.detail
    }
    api.keywordSearch(keyword, searchType, 0).then(res => {
      if (res.code === 200) {
        this.setData({
          result: res.result,
          sugFlag: false,
          scrollTop: 0
        })
        wx.hideLoading();
      }
    })
  },
  //上拉加载
  pullUp(e) {
    wx.showLoading({
      title: "加载中...",
      mask: true,
    });
    let info = e.detail
    let keyword = this.data.value
    let result = this.data.result
    api.keywordSearch(keyword, info.id, info.count).then(res => {
      if (res.code === 200) {
        info.id === 1 ? result.songs.push(...res.result.songs) :
          info.id === 1014 ? result.videos.push(...res.result.videos) :
          info.id === 100 ? result.artists.push(...res.result.artists) :
          info.id === 10 ? result.albums.push(...res.result.albums) :
          info.id === 1000 ? result.playlists.push(...res.result.playlists) :
          info.id === 1009 ? result.djRadios.push(...res.result.djRadios) :
          info.id === 1002 ? result.userprofiles.push(...res.result.userprofiles) :
          info.id === 1004 ? result.mvs.push(...res.result.mvs) : ''
        this.setData({
          result: result
        })
        console.log(result);
        wx.hideLoading();
      }
    })
  },
  showSug() {
    if (this.data.value !== '') {
      this.setData({
        sugFlag: true
      })
    }
  },
  closeSug() {
    this.setData({
      sugFlag: false
    })
  },
  clearKeywords() {
    this.setData({
      value: '',
      suggest: [],
      sugFlag: false
    })
    this.getSearchDefalut();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getData()
    this.getPersonalized()
    this.getNewDisc()
    this.getNewSong()
    this.getDj()
    this.getSearchHot()
    // this.setData({
    //   value: "陈奕迅"
    // })
    // let e = null
    // this.getResult(e)
    // //测试接口结束
  },
  //获取数据
  getData() {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    //获取轮播图
    api.getHeader().then(res => {
      if (res.code === 200) {
        this.setData({
          banners: res.banners
        })
        wx.hideLoading();
      }
    })

  },
  getPersonalized() {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    //获取推荐歌单
    api.getPersonalized().then(res => {
      if (res.code === 200) {
        res.result.map(item => {
          item.playCount > 100000000 ?
            item.playCount = `${(item.playCount/100000000).toFixed(2)}亿` :
            item.playCount > 10000 ?
            item.playCount = `${(item.playCount/10000).toFixed(0)}万` : ''
        })
        this.setData({
          recommendList: res.result
        })
        wx.hideLoading();
      }
    })
  },
  getNewDisc() {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    api.newDisc().then(res => {
      if (res.code === 200) {
        this.setData({
          newDisc: res.albums
        })
        wx.hideLoading();
      }
    })
  },
  getNewSong() {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    api.newSong().then(res => {
      if (res.code === 200) {
        this.setData({
          newsong: res.result
        })
        wx.hideLoading();
      }
    })
  },
  getDj() {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    api.djprogram().then(res => {
      if (res.code === 200) {
        this.getRecommend()
        this.setData({
          djprograms: res.result
        })
        wx.hideLoading();
      }
    })
  },
  getRecommend() {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    api.recommend().then(res => {
      if (res.code === 200) {
        this.setData({
          recommends: res.programs
        })
        wx.hideLoading();
      }
    })
  },

  getSearchHot() {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    api.hotSearchList().then(res => {
      if (res.code === 200) {
        this.getSearchDefalut()
        this.setData({
          hotList: res.data
        })
        wx.hideLoading();
      }
    })
  },
  getSearchDefalut() {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    api.searchDefalut().then(res => {
      if (res.code === 200) {
        this.setData({
          keywords: res.data
        })
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getStorge()
  },
  getStorge() {
    if (wx.getStorageSync('histories')) {
      this.setData({
        histories: JSON.parse(wx.getStorageSync('histories'))
      })
    } else {
      this.setData({
        histories: []
      })
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