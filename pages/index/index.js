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
    page: 1,
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
      }
    })
  },
  //上拉加载
  pullUp(e) {
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
      }
    }).catch(err => {
      wx.showToast({
        title: '列表丢失',
        icon: 'none',
        duration: 1500
      });
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
      result: null,
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
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.store.data.screenMsg = {
          statusBarHeight: res.statusBarHeight,
          screenHeight: res.screenHeight,
          fixedCss: `top:${res.statusBarHeight+44}px;`
        }
      }
    })
    this.getData()
    this.getPersonalized()
    this.getNewDisc()
    this.getNewSong()
    this.djRecommend()
    this.getSearchHot()
    this.programRecommend()
  },
  //获取数据
  getData() {
    //获取轮播图
    api.getHeader().then(res => {
      if (res.code === 200) {
        this.setData({
          banners: res.banners
        })
      }
    })

  },
  getPersonalized() {
    //获取推荐歌单
    api.getPersonalized().then(res => {
      if (res.code === 200) {
        this.setData({
          recommendList: res.result
        })
      }
    })
  },
  getNewDisc() {
    api.newDisc().then(res => {
      if (res.code === 200) {
        this.setData({
          newDisc: res.albums
        })
      }
    })
  },
  getNewSong() {
    api.newSong().then(res => {
      if (res.code === 200) {
        this.setData({
          newsong: res.result
        })
      }
    })
  },
  djRecommend() {
    api.djRecommend().then(res => {
      if (res.code === 200) {
        this.setData({
          recommends: res.djRadios
        })
      }
    })
  },
  programRecommend() {
    api.programRecommend().then(res => {
      if (res.code === 200) {
        this.setData({
          djprograms: res.programs
        })
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