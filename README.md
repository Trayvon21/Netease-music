# 网易云音乐

## 项目API地址

   <https://www.trayvon21.cn>

## 开发工具

1. 微信开发者工具
2. vsCode
3. 相关插件
   1. omix（小程序全局状态管理框架，类 vuex）

      <https://github.com/Tencent/omi/tree/master/packages/omix>

   2. flyio（http 请求库）

      <https://github.com/wendux/fly>

   3. wxs（小程序的一套脚本语言）
      <https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxs/>

   4. Vant Weapp（小程序UI组件库）

      <https://youzan.github.io/vant-weapp/#/intro>

   5. area.js（省市区列表数据）
   
   6. ...

## 功能实现

- [x] 推荐歌曲首页展示
- [x] 歌曲信息搜索（9种分类查看）
- [x] 歌曲播放页面（含唱片动画与播放列表管理）
- [x] 我的页面（含登录注册与用户资料修改）
- [x] 歌单专辑电台与歌手详情展示
- [x] 全局迷你播放器（实现播放列表管理、切歌、底部置顶）
- [ ] ...



## 关键点

1. wxs实现过滤器效果

   ```js
   //创建wxs文件,包含定义与输出
   var DateFr = {
      getDate: function (time) {
   
           if (!time) return '';
           var date = getDate(time);
           var M = date.getMonth() + 1;
           var y = date.getFullYear();
           var d = date.getDate();
           if (M < 10) M = "0" + M;
           if (d < 10) d = "0" + d;
           return y + '.' + M + '.' + d;
       },
   }
   module.exports = {
       getTime: DateFr.getTime
   }
   //在你要使用的界面中用wxs标签引入刚才定义的过滤器
   <wxs module="DateFr" src="wxs文件路径"></wxs>
   //使用过滤器
   DateFr.getTime(需要过滤的数据)
   ```

   

2. 背景音乐的播放、监听及其他操作

   - 设置音乐管理器

     ```js
     //利用wx.getBackgroundAudioManager()来获取小程序的后台音乐管理器
     const bgm = wx.getBackgroundAudioManager()
     //此时，bgm这个实例就可以用来控制后台音乐管理器
     bgm.title = playNow.title
     bgm.epname = playNow.epname
     bgm.singer = playNow.singer
     bgm.coverImgUrl = playNow.coverImgUrl
     bgm.src = playNow.src//当src设置之后音乐管理器就直接开始播放音乐
     ```

   - 监听管理器

     ```js
     //监听自然播放结束
     bgm.onEnded(() => {this.playNext()})
     //监听用户触发下一曲按钮
     bgm.onNext(() => {this.playNext()})
     //监听用户触发上一曲按钮
     bgm.onPrev(() => {this.playPrev()})
     //监听用户触发播放按钮
     bgm.onPlay(() => {this.setData({play: true})})
     //监听用户触发停止按钮
     bgm.onPause(() => {this.setData({play: false})})
     //监听音乐播放进度
     bgm.onTimeUpdate(() => {
       可使用bgm.duration等获取当前歌曲的长度和播放状态
     })
     ```

   - 拉取进度条

     ```js
     //利用.seek()的方法可以设置拉取进度条的效果
     bgm.seek(位置)
     ```

   

3. 事件操作与动画之间的同步

   ```js
   //利用背景音乐管理器的onTimeUpdate监听来控制动画，当打开监听时就触发动画，由于动画是循环动画，设置了定时器，所以可以在监听中使用
    !bgm.paused && !this.data.timer ? this.goAnimation() : ''
   //如果定时器不存在并且歌曲正在播放，则触发动画
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
   ```

   

4. 播放列表管理

   由于是背景音乐管理，所以列表存放于全局，本项目使用的是omix，类似于vue的vuex；当有歌曲加入列表，就立即存放在omix的store中，此时就可以用全局mini播放器或者播放页面来管理。

   ```js
   //playlist为播放列表，playIndex为当前播放歌曲的序列号
   
   //实现单体删除功能
   let playIndex = this.store.data.playIndex
   let playlist = this.store.data.playlist
   this.store.data.playlist = playlist.filter(item => item.id !== e.currentTarget.dataset.id)
   playIndex > e.currentTarget.dataset.index ? this.store.data.playIndex = playIndex - 1 : ''
   
   //全体删除（首先停止音乐播放，清空omix中存放的数据）
   this.store.data.bgm.stop()
   this.store.data.bgm = null
   this.store.data.playIndex = 0
   this.store.data.playlist = []
   ```

5. scroll-view的运用(锚点跳转和滚动时的界面效果变换)

   scroll-view提供了几种跳转方式，本项目主要运用scroll-up与scroll-into-view

   ```js
   //wxml中给两个属性设置变量
   scroll-up={{scrollUp}} scroll-into-view={{toId}}
   //触发事件给scrollUp赋值（距离scroll-view顶部的高度）
   //toId赋值（需要跳转到的元素的id名称）
   ```

6. 自定义导航栏的位置大小设置

   ```js
   //JSON文件设置自定义导航栏
     "navigitionStyle":"custom"
   //利用getSystemInfo来调取statusBar的高度和屏幕高度，方便后期制作页面滚动效果
     wx.getSystemInfo({
       success (res) {
         res.statusBarHeight,
         res.screenHeight,
       }
       })
   //获取到statusBar后可以设置导航栏的位置和大小，高度为44px，距离顶部statusBarHeight
   //设置fixed定位和z-index提高层级可保持自定义导航栏的头部置顶
   ```
   



