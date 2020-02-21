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
    searchFlag: true,
    keywords: {},
    value: "",
    result: null,
    suggest: [],
    sugFlag: false,
    hotList: [],
    histories: [],
    scrollTop: ''
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
    if (this.data.result!==null) {
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
    this.setData({value: keyword})
    console.log(keyword);
    this.getResult()
  },
  getResult(e) {
    wx.showLoading({
      title:"加载中...",
      mask: true,
    });
    let keyword=this.data.value
    let searchType=1018
    if(e){
      searchType=e.detail
    }
    api.keywordSearch(keyword,searchType).then(res => {
      if (res.code === 200) {
        let histories = this.data.histories
        if (!histories.includes(keyword)) {
          histories.push(keyword)
        }
        wx.setStorageSync("histories", JSON.stringify(histories));
        this.setData({
          result: res.result,
          sugFlag: false,
          histories: histories,
          scrollTop: 0
        })
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
     //测试接口
     this.setData({value:"陈奕迅"})
     let e=null
     this.getResult(e)
     //测试接口结束
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
        this.getPersonalized()
      }
    })

  },
  getPersonalized() {
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
        this.getNewDisc()
      }
    })
  },
  getNewDisc() {
    api.newDisc().then(res => {
      if (res.code === 200) {
        this.setData({
          newDisc: res.albums
        })
        this.getNewSong()
      }
    })
  },
  getNewSong() {
    api.newSong().then(res => {
      if (res.code === 200) {
        this.setData({
          newsong: res.result
        })
        this.getDj();
      }
    })
  },
  getDj() {
    api.djprogram().then(res => {
      if (res.code === 200) {
        this.getRecommend()
        this.setData({
          djprograms: res.result
        })
      }

    })
  },
  getRecommend() {
    api.recommend().then(res => {
      if (res.code === 200) {
        this.setData({
          recommends: res.programs
        })
        this.getSearchHot()
      }
    })
  },

  getSearchHot() {
    api.hotSearchList().then(res => {
      if (res.code === 200) {
        this.getSearchDefalut()
        this.setData({
          hotList: res.data
        })
      }
    })
  },
  getSearchDefalut() {
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