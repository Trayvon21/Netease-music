# 网易云音乐

## 开发工具

- [x] 微信开发者工具
- [x] vantWeapp组件
- [x] weui组件
- [x] 1

## 项目API地址

   <https://www.trayvon21.cn>

- WXS
      微信小程序的架构分为 app-service 和 page-frame，分别运行于不同的线程。你在开发时写的所有 JS 都是运行在 app-service 线程里的，而每个页面各自的 WXML/WXSS 则运行在 page-frame 中。app-service 与 page-frame 之间通过桥协议通信（包括 setData 调用、canvas指令和各种DOM事件），涉及消息序列化、跨线程通信与evaluateJavascript()。这个架构的好处是：分开了业务主线程和显示界面，即便业务主线程非常繁忙，也不会阻塞用户在 page-frame 上的交互。一个小程序可以有多个 page-frame （webview），页面间切换动画比SPA更流畅。坏处是：在 page-frame 上无法调用业务 JS。跨线程通信的成本很高，不适合需要频繁通信的场景。业务 JS 无法直接控制 DOM。
      作者：鲁小夫
      链接：<https://segmentfault.com/a/1190000012246412>

   了解了wxs 设计初衷，我们也就知道能做什么事情了.
   wxs 目前主要是增强 wxml 标签的表达能力

   ps : 因为运行在不同线程所以 js与wxs 不能相互引用的. 这就有可能在js中使用公共方法 在wxs中需要重新写一份(为了共享filter) 造成代码冗余.