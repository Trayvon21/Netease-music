import create from '../../../utils/store/create'
import store from '../../../store/index'
create.Component(store, {
  //使用共享的数据 
  use: ['bgm', 'playlist', 'playIndex', 'playType'],
  // 指针对store中的数据，不会对组件内部的数据生效
  computed: {

  },
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    play: false,
    showData: {},
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.setData({
        show: !this.data.show
      })
    },
    toPlayer() {
      wx.navigateTo({
        url: '/pages/player/player'
      });
    },
    play() {
      this.data.play ? this.store.data.bgm.pause() : this.store.data.bgm.play()
    },
    /**
     * 播放上一首
     */
    playPrev() {
      let type = this.store.data.playType
      let playlist = this.store.data.playlist
      let playIndex = this.store.data.playIndex;
      if (playlist.length === 1) {
        wx.showToast({
          title: '您只有一首歌曲',
          icon: 'none',
          duration: 1500
        });
      }
      //判断当前播放状态0-随机，1-列表，2-单曲
      if (type === 2 || playlist.length === 1) {
        this.store.data.bgm.seek(0)
      } else if (type === 1) {
        if (playIndex > 0) {
          playIndex = playIndex - 1
        } else {
          playIndex = playlist.length - 1
          wx.showToast({
            title: '滚到最后一曲',
            icon: 'none',
            duration: 1500
          });
        }
        this.store.data.playIndex = playIndex;
      } else {
        let index = parseInt(Math.random() * (playlist.length - 1))
        this.store.data.playIndex = index
      }
      this.startPlay();
    },
    /**
     * 播放下一曲
     */
    playNext() {
      let type = this.store.data.playType
      let playlist = this.store.data.playlist
      let playIndex = this.store.data.playIndex;
      if (playlist.length === 1) {
        wx.showToast({
          title: '您只有一首歌曲',
          icon: 'none',
          duration: 1500
        });
      }
      //判断当前播放状态0-随机，1-列表，2-单曲
      console.log(type, playlist.length);
      if (type === 2 || playlist.length === 1) {
        this.store.data.bgm.seek(0)
      } else if (type === 1) {
        if (playIndex < (playlist.length - 1)) {
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
        let index = parseInt(Math.random() * (playlist.length - 1))
        this.store.data.playIndex = index
      }
      this.startPlay();
    },
    startPlay() {
      //获取播放歌曲
      console.log(this.store.data.playlist);
      console.log(this.store.data.playIndex);
      let playNow = this.store.data.playlist[this.store.data.playIndex]
      let bgm = this.store.data.bgm
      bgm.title = playNow.title
      bgm.epname = playNow.epname
      bgm.singer = playNow.singer
      bgm.coverImgUrl = playNow.coverImgUrl
      // 设置了 src 之后会自动播放
      bgm.src = playNow.src
      this.store.data.bgm = bgm
      //开始监听播放状态
    },
  },
  pageLifetimes: {
    show() {
      setTimeout(() => {
        this.setData({
          showData: this.store.data.playlist[this.store.data.playIndex],
        })
      }, 200)
      let bgm = this.store.data.bgm
      //监听播放事件
      if (bgm) {
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
      }
      bgm.onNext(() => {
        this.playNext()
      })
      bgm.onPrev(() => {
        this.playPrev()
      })
      bgm.onEnded(() => {
        this.playNext()
      })
      bgm.onTimeUpdate(() => {
        this.setData({
          showData: this.store.data.playlist[this.store.data.playIndex],
          play: !bgm.paused
        })
      })
    }
  }
})