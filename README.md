# 网易云音乐

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

## 功能实现

- [x] 推荐歌曲首页展示
- [x] 歌曲信息搜索（9种分类查看）
- [x] 歌曲播放页面（含唱片动画与播放列表管理）
- [x] 我的页面（含登录注册与用户资料修改）
- [x] 歌单专辑电台与歌手详情展示
- [x] 全局迷你播放器（实现播放列表管理、切歌、底部置顶）



## 关键点

1. wxs实现过滤器效果
2. 背景音乐的监听、操作
3. 事件操作与动画之间的同步
4. 播放列表管理
5. scroll-view的运用(锚点跳转和滚动时的界面效果变换)

## 项目API地址

   <https://www.trayvon21.cn>
