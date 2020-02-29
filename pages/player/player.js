import create from '../../utils/store/create'
import store from '../../store/index'
import api from "../../http/api"

create.Page(store, {
  //使用共享的数据 
  use: ['bgm', 'playlist', 'playIndex', 'playType'],
  /**
   * 页面的初始数据
   */
  data: {
    ids: null, //id列表
    play: false, //播放状态
    offset: 0, //当前位置
    duration: 100, //媒体位置
    playlist: [],
    playIndex: 0,
    controlMove: {},
    cdmove: {},
    n: 1, //旋转动画基数
    timer: null, //动画定时器id
    show: false //弹出层
  },

  /**
   * 播放/暂停
   */
  playStop() {
    this.data.play ? this.store.data.bgm.pause() : this.store.data.bgm.play()
  },
  onClose() {
    this.setData({
      show: !this.data.show
    })
  },
  /**
   * 播放上一首
   */
  playPrev() {
    if (this.data.playlist.length === 1) {
      wx.showToast({
        title: '您只有一首歌曲',
        icon: 'none',
        duration: 1500
      });
    }
    //判断当前播放状态0-随机，1-列表，2-单曲
    let type = this.store.data.playType
    if (type === 2 || this.data.playlist.length === 1) {

      this.store.data.bgm.seek(0)
    } else if (type === 1) {
      let playIndex = this.store.data.playIndex;
      if (playIndex > 0) {
        playIndex = playIndex - 1
      } else {
        playIndex = this.store.data.playlist.length - 1
        wx.showToast({
          title: '滚到最后一曲',
          icon: 'none',
          duration: 1500
        });
      }
      this.store.data.playIndex = playIndex;
    } else {
      let index = parseInt(Math.random() * (this.store.data.playlist.length - 1))
      this.store.data.playIndex = index
    }
    this.startPlay();
  },

  /**
   * 播放下一曲
   */
  playNext() {
    if (this.data.playlist.length === 1) {
      wx.showToast({
        title: '您只有一首歌曲',
        icon: 'none',
        duration: 1500
      });
    }
    //判断当前播放状态0-随机，1-列表，2-单曲
    let type = this.store.data.playType
    console.log(type, this.data.playlist.length);
    if (type === 2 || this.data.playlist.length === 1) {

      this.store.data.bgm.seek(0)
    } else if (type === 1) {
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
    } else {
      let index = parseInt(Math.random() * (this.store.data.playlist.length - 1))
      this.store.data.playIndex = index
    }
    this.startPlay();
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
    let num = this.store.data.playType
    num === 2 ? num = 0 : num++
    wx.showToast({
      title: `${num===1?'列表循环':num===2?'单曲循环':'随机循环'}`,
      icon: 'none',
      duration: 1500
    });
    this.store.data.playType = num
  },

  /**
   * 获取播放列表
   * @param {*} id 单个id
   * @param {*} ids 播放列表
   */
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
                      title: '版权问题无法播放',
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
                })
              })
            }
            if (playlist.length > 0) {
              let i = 0
              playlist.map((item, index) => {
                if (item.id == id) {
                  i = index
                }
              })
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

  /**
   * 电台节目播放列表
   * @param {*} id 电台节目
   */
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

  /**
   * 开始播放
   */
  startPlay() {
    //获取播放歌曲
    let playNow = this.store.data.playlist[this.store.data.playIndex]
    const bgm = wx.getBackgroundAudioManager()
    bgm.title = playNow.title
    bgm.epname = playNow.epname
    bgm.singer = playNow.singer
    bgm.coverImgUrl = playNow.coverImgUrl
    bgm.src = playNow.src
    this.store.data.bgm = bgm
    //开始监听播放状态
    this.onTimeUpdate(bgm)
  },

  /**
   * 播放状态的监听
   * @param {*} bgm 播放实例
   */
  onTimeUpdate(bgm) {
    bgm.onEnded(() => {
      this.playNext()
    })
    bgm.onPlay(() => {
      this.setData({
        play: true
      })
    })
    bgm.onNext(() => {
      this.playNext()
    })
    bgm.onPrev(() => {
      this.playPrev()
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
        playIndex: this.store.data.playIndex,
        play: !bgm.paused,
        playlist: this.store.data.playlist
      });
      //如果正在播放并且动画定水器未工作则触发动画效果
      !bgm.paused && !this.data.timer ? this.goAnimation() : ''
    })
  },

  /**
   * 动画
   */
  goAnimation() {
    //创建动画实例
    var cdmove = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    });
    var controlMove = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
      transformOrigin: '20.93% 22.37% 0'
    });
    let n = this.data.n
    //定时器获取状态并控制动画
    let timer = setInterval(() => {
      if (this.data.play) {
        cdmove.rotate(n * 20).step();
        controlMove.rotate(-10).step();
        this.setData({
          cdmove: cdmove.export(),
          controlMove: controlMove.export(),
          n: n
        })
        n++
      } else {
        clearInterval(timer)
        controlMove.rotate(-40).step();
        this.setData({
          controlMove: controlMove.export(),
          timer: null
        })
      }
    }, 500)
    //控制cd与操作杆移动并输出
    cdmove.rotate(n * 20).step();
    controlMove.rotate(-10).step();
    this.setData({
      cdmove: cdmove.export(),
      controlMove: controlMove.export(),
      timer: timer
    })
  },

  /**
   * 生命周期--页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '播放歌曲'
    });
    //区分歌曲和节目
    options.songId ? this.getSong(options.songId, options.ids ? JSON.parse(options.ids) : null) : options.programId ? this.getProgram(options.programId) : ''
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.store.data.bgm ? this.onTimeUpdate(this.store.data.bgm) : ''
    this.setData({
      playlist: this.store.data.playlist,
      playIndex: this.store.data.playIndex
    })
  },
  /**
   * 离开时清除定时器
   */
  onUnload() {
    console.log('clear');
    clearInterval(this.data.timer)
  }
})