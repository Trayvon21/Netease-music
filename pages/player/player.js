import create from '../../utils/store/create'
import store from '../../store/index'
import api from "../../http/api"

create.Page(store, {
  //使用共享的数据 
  use: ['bgm', 'playlist', 'playIndex', 'playType'],
  // 指针对store中的数据，不会对组件内部的数据生效
  computed: {},
  /**
   * 页面的初始数据
   */
  data: {
    offset: 0,
    duration: 100,
    show: {},
    play: false,
    controlMove: {},
    cdmove: {},
    n: 1, //旋转动画基数
    timer: null, //don
    hide: false,
    ids: null,
    type: 1
  },
  /**
   * 滚动进度条
   * @param {*} e 滚动条
   */
  onChange(e) {
    var offset = parseInt(e.detail);
    this.store.data.bgm.play();
    this.store.data.bgm.seek(offset);
    this.setData({
      play: true
    })
  },
  /**
   * 类型变化
   */
  typeChange() {
    let num = this.data.type
    num === 2 ? num = 0 : num++
    wx.showToast({
      title: `${num===1?'列表循环':num===2?'单曲循环':'随机循环'}`,
      icon: 'none',
      duration: 1500
    });
    this.store.data.playType = num
    this.setData({
      type: num
    })
  },
  /**
   * 播放/暂停
   */
  playStop() {
    this.data.play ? this.store.data.bgm.pause() : this.store.data.bgm.play()
    this.goAnimation()
  },
  /**
   * 动画
   */
  goAnimation() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    });
    var animation1 = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
      transformOrigin: '20.93% 22.37% 0'
    });
    let n = this.data.n
    let _this = this
    let timer = this.data.timer
    //如果定时器存在，则清除
    clearInterval(timer)
    animation.rotate(n * 20).step();
    animation1.rotate(-10).step();
    _this.setData({
      cdmove: animation.export(),
      controlMove: animation1.export(),
      n: n,
    })
    timer = setInterval(function () {
      if (_this.data.play) {
        animation.rotate(n * 20).step();
        animation1.rotate(-10).step();
        _this.setData({
          cdmove: animation.export(),
          controlMove: animation1.export(),
          n: n,
          timer: timer
        })
        n++
      } else {
        clearInterval(timer)
        animation1.rotate(-40).step();
        _this.setData({
          controlMove: animation1.export(),
          cdmove: animation.export(),
          timer: null
        })
      }
    }, 500)
  },
  /**
   * 播放下一曲
   */
  playNext() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 800)
    let type = this.store.data.playType
    if (type === 1) {
      let playIndex = this.store.data.playIndex;
      if (playIndex < (this.store.data.playlist.length - 1)) {
        playIndex = playIndex + 1
      } else {
        playIndex = 0
        wx.showToast({
          title: '滚到第一曲',
          icon: 'none',
          duration: 1500
        });
      }
      this.store.data.playIndex = playIndex;
    } else if (type === 0) {
      let index = parseInt(Math.random() * (this.store.data.playlist.length - 1))
      this.store.data.playIndex = index
    } else if (type === 2) {
      this.store.data.bgm.seek(0)
    }
    clearInterval(this.data.timer)
    this.startPlay();
  },
  /**
   * 播放上一首
   */
  playPrev() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 800)
    let type = this.store.data.playType
    if (type === 1) {
      let playIndex = this.store.data.playIndex;
      if (playIndex > 0) {
        playIndex = playIndex + 1
      } else {
        playIndex = this.store.data.playlist.length - 1
        wx.showToast({
          title: '滚到最后一曲',
          icon: 'none',
          duration: 1500
        });
      }
      this.store.data.playIndex = playIndex;
    } else if (type === 0) {
      let index = parseInt(Math.random() * (this.store.data.playlist.length - 1))
      this.store.data.playIndex = index
    } else if (type === 2) {
      this.store.data.bgm.seek(0)
    }
    clearInterval(this.data.timer)
    this.startPlay();
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '播放歌曲'
    });
    //区分歌曲和节目
    options.songId ? this.getSong(options.songId, options.ids ? JSON.parse(options.ids) : null) : options.programId ? this.getProgram(options.programId) : ''
  },
  getSong(id, ids) {
    //获取歌曲详情和地址并保存
    let playlist,
      displaylist = []
    //如果有多个id，则清空播放列表
    ids ? playlist = [] : playlist = this.store.data.playlist
    api.getSongdetail(ids ? ids : id).then(res => {
      if (res.code === 200) {
        let arr = []
        res.songs.map(item => {
          if (playlist.some(i => i.id === item.id)) return
          arr.push({
            id: item.id,
            title: item.name,
            epname: item.al.name,
            singer: item.ar[0].name,
            coverImgUrl: item.al.picUrl,
          })
        })
        api.getSongUrl(ids ? ids : id).then(res1 => {
          if (res1.code === 200) {
            arr.map(item => {
              res1.data.map(i => {
                if (i.id === item.id) {
                  if (i.url) {
                    item.src = i.url
                    playlist.push(item)
                  } else {
                    displaylist.push(item.title)
                  }
                }
              })
            })
            if (displaylist.length > 0) {
              let temp = displaylist.join(',')
              wx.showModal({
                title: `以下${displaylist.length}首歌曲无法加入播放列表`,
                content: `${temp}`,
                success: (res => {
                  if (playlist.length === 0) {
                    wx.showToast({
                      title: '歌单为空，返回上一页',
                      icon: 'none',
                      duration: 1500,
                      success: (result) => {
                        wx.navigateBack({
                          delta: 1
                        });
                      }
                    })
                  }
                })
              })
            }
            if (playlist.length > 0) {
              let i = 0
              playlist.map((item, index) => {
                console.log(item.id);
                if (item.id == id) {
                  i = index
                  console.log(index);
                }
              })
              console.log(i);
              this.store.data.playIndex = i
              this.store.data.playlist = playlist
              //开始播放
              this.startPlay()
            }
          }
        })
      }
    })
  },
  getProgram(id) {
    api.programDetail(id).then(res => {
      if (res.code === 200) {
        api.getSongUrl(res.program.mainTrackId).then(res1 => {
          if (res1.code === 200) {
            let playlist = this.store.data.playlist
            if (res1.data[0].url) {
              playlist.push({
                id: res.program.id,
                title: res.program.name,
                epname: '电台',
                singer: res.program.dj.nickname,
                coverImgUrl: res.program.coverUrl,
                src: res1.data[0].url
              })
              console.log(playlist);
              this.store.data.playIndex = playlist.length - 1
              this.store.data.playlist = playlist
              this.startPlay()
            } else {
              wx.showToast({
                title: '节目丢失',
                icon: 'none',
                duration: 1500,
                success: (result) => {
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    });
                  }, 500)
                }
              });
            }

          }
        })
      }
    })
  },
  startPlay() {
    //获取播放歌曲
    let playNow = this.store.data.playlist[this.store.data.playIndex]
    const bgm = wx.getBackgroundAudioManager()
    bgm.title = playNow.title
    bgm.epname = playNow.epname
    bgm.singer = playNow.singer
    bgm.coverImgUrl = playNow.coverImgUrl
    // 设置了 src 之后会自动播放
    bgm.src = playNow.src
    this.store.data.bgm = bgm
    //开始监听播放状态
    this.onTimeUpdate(bgm)
  },
  onTimeUpdate(bgm) {
    bgm.onEnded(() => {
      this.playNext()
    })
    bgm.onPlay(() => {
      this.setData({
        play: true
      })
    })
    bgm.onPause(() => {
      this.setData({
        play: false
      })
    })
    bgm.onTimeUpdate(() => {
      //获取总时长
      var duration = parseInt(bgm.duration)
      //实时更新
      var currentTime = parseInt(bgm.currentTime);
      this.setData({
        duration: duration,
        offset: currentTime,
        show: this.store.data.playlist[this.store.data.playIndex],
        play: !bgm.paused
      })
    })
    //触发动画
    setTimeout(() => {
      this.goAnimation()
    }, 200)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let bgm = this.store.data.bgm
    bgm ? this.onTimeUpdate(bgm) : ''
  },
  /**
   * 离开时清除定时器
   */
  onUnload() {
    console.log('clear');
    clearInterval(this.data.timer)
  }
})