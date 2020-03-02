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
    active: '5001',
    typeList: [{
        id: '5001',
        name: '入驻歌手'
      },
      {
        id: '1001',
        name: '华语男歌手'
      },
      {
        id: '1002',
        name: '华语女歌手'
      },
      {
        id: '1003',
        name: '华语组合/乐队'
      },
      {
        id: '2001',
        name: '欧美男歌手'
      },
      {
        id: '2002',
        name: '欧美女歌手'
      },
      {
        id: '2003',
        name: '欧美组合/乐队'
      },
      {
        id: '6001',
        name: '日本男歌手'
      },
      {
        id: '6002',
        name: '日本女歌手'
      },
      {
        id: '6003',
        name: '日本组合/乐队'
      },
      {
        id: '7001',
        name: '韩国男歌手'
      },
      {
        id: '7002',
        name: '韩国女歌手'
      },
      {
        id: '7003',
        name: '韩国组合/乐队'
      },
      {
        id: '4001',
        name: '其他男歌手'
      },
      {
        id: '4002',
        name: '其他女歌手'
      },
      {
        id: '4003',
        name: '其他组合/乐队'
      }
    ],
    initial: ["热", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    artistList: [],
    active2: '热',
    scrollLeft: 0,
    scrollTop: 0
  },
  onChange(e) {
    this.getArtists(e.detail.name)
  },
  changeInt(e) {
    if (e.currentTarget.dataset.each !== this.data.active2) {
      this.setData({
        active2: e.currentTarget.dataset.each
      })
      this.getArtists()
    }
  },
  getArtists(type, offset = 0) {
    let initial = null
    let temp = ''
    type ? temp = type : temp = this.data.active
    this.data.active2 !== '热' ? initial = this.data.active2 : ''
    api.artistList(temp, offset, initial).then(res => {
      if (res.code === 200) {
        if (res.artists.length === 0 || !res.artists) {
          wx.showToast({
            title: '到底了',
            icon: 'none',
            duration: 1500
          });
          return
        }
        if (type) {
          this.setData({
            active: temp,
            artistList: res.artists,
            scrollLeft: 0,
            active2: '热',
            scrollTop: 0
          })
        } else if (offset > 0) {
          let artistList = this.data.artistList
          artistList.push(...res.artists)
          this.setData({
            artistList: artistList,
          })
        } else {
          this.setData({
            artistList: res.artists,
            scrollTop: 0
          })
        }
      }
    })
  },
  pullUp() {
    this.getArtists(null, this.data.artistList.length)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArtists()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(1);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})