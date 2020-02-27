import create from '../../utils/store/create'
import store from '../../store/index'
import api from "../../http/api"

create.Page(store, {
  //使用共享的数据 
  use: ['backgroundAudioManager', 'playlist'],
  // 指针对store中的数据，不会对组件内部的数据生效
  computed: {

  },
  /**
   * 页面的初始数据
   */
  data: {
    offset: 0,
    show: {},
    play: false,
    controlMove: {},
    cdmove: {},
    starttime: '00:00', //正在播放时长
    duration: '',
    n: 1
  },
  onChange(e) {
    var offset = parseInt(e.detail);
    this.store.data.backgroundAudioManager.play();
    this.store.data.backgroundAudioManager.seek(offset);
    this.setData({
      play: true
    })
    this.go()
  },
  playStop() {
    this.data.play ? this.store.data.backgroundAudioManager.pause() : this.store.data.backgroundAudioManager.play()
    this.setData({
      play: !this.data.play
    })
    if (this.data.play) {
      this.go()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //动画
  go() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    });
    var animation1 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      transformOrigin: '20.93% 22.37% 0'
    });
    let n = this.data.n
    let _this = this
    animation1.rotate(-10).step();
    animation.rotate(n * 45).step();
    _this.setData({
      controlMove: animation1.export(),
      cdmove: animation.export(),
      n: n + 1
    })
    let timer = setInterval(function () {
      if (_this.data.play) {
        animation.rotate(n * 45).step();
        _this.setData({
          cdmove: animation.export(),
          n: n
        })
        n++
      } else {
        clearInterval(timer)
        animation1.rotate(-40).step();
        _this.setData({
          controlMove: animation1.export(),
          cdmove: animation.export()
        })
      }
    }, 1000)
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '播放歌曲'
    });
    options.songId ? this.getSong(options.songId) : this.getProgram(options.programId)
  },
  getSong(id) {
    api.getSongdetail(id).then(res => {
      if (res.code === 200) {
        console.log(res);
        let arr = []
        res.songs.map(item => {
          let ars = ''
          item.ar.length > 1 ? item.ar.map(i => {
            ars = ars + ',' + i.name
          }) : ars = item.ar[0].name
          arr.push({
            id: item.id,
            title: item.name,
            epname: item.al.name,
            singer: ars,
            coverImgUrl: item.al.picUrl
          })
        })
        this.store.data.playlist = arr
        this.getSongUrl(id)
      }
    })
  },
  getSongUrl(id) {
    let temp = this.store.data.playlist[0]
    console.log(temp);
    api.getSongUrl(temp.id).then(res => {
      if (res.data[0].url) {
        const backgroundAudioManager = wx.getBackgroundAudioManager()
        backgroundAudioManager.title = temp.title
        backgroundAudioManager.epname = temp.epname
        backgroundAudioManager.singer = temp.singer
        backgroundAudioManager.coverImgUrl = temp.coverImgUrl
        // 设置了 src 之后会自动播放
        backgroundAudioManager.src = res.data[0].url
        this.store.data.backgroundAudioManager = backgroundAudioManager
        this.onTimeUpdate()
      } else {
        wx.showToast({
          title: '歌曲无法播放',
          icon: 'none',
          duration: 1500
        });
        wx.switchTab({
          url: '/pages/index/index'
        });
      }

    })
  },
  onTimeUpdate() {
    let backgroundAudioManager = this.store.data.backgroundAudioManager
    backgroundAudioManager.onTimeUpdate(() => {
      //获取最大值和总时长等
      var max = parseInt(backgroundAudioManager.duration)
      var minAll = "0" + parseInt(max / 60)
      var secAll = max % 60;
      if (secAll < 10) {
        secAll = "0" + secAll;
      };
      var duration = minAll + ':' + secAll;
      //实时更新
      var currentTime = parseInt(backgroundAudioManager.currentTime);
      var min = "0" + parseInt(currentTime / 60);;
      var sec = currentTime % 60;
      if (sec < 10) {
        sec = "0" + sec;
      };
      var starttime = min + ':' + sec; /*  00:00  */
      this.setData({
        duration: duration,
        offset: currentTime,
        starttime: starttime,
        max: max,
        show: this.store.data.playlist[0]
      })
    })
    this.go()
    this.setData({
      play: true
    })
  },
  getProgram() {

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
    let _this = this
    wx.getBackgroundAudioPlayerState({
      success(res) {
        setTimeout(() => {
          _this.setData({
            play: res.status === 1 ? true : false,
            show: _this.store.data.playlist[0],
            duration: res.duration,
            currentPosition: res.currentPosition
          })
          _this.onTimeUpdate()
        }, 200)
      }
    })
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