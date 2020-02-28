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
    showData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toPlayer() {
      wx.navigateTo({
        url: '/pages/player/player'
      });
    },
    play() {
      this.data.play ? this.store.data.bgm.pause() : this.store.data.bgm.play()
    },
    /**
     * 播放下一曲
     */
    playNext() {
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