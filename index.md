## 浙江电信极光TV项目  

### source------整体代码包

#### index ------首页
```
首页入口为home.html,触发启动日志上报后跳转home1.html页面
```

#### detail-------详情页
```
根据不同的layout来init不同类别的详情页
```

#### filter-------塞选页

#### history ---------历史收藏页面

#### Public---------公共JS CSS代码以及公共图片
```
ajax.js---------基于XMLHttpRequest封装请求

interface--------通用公共请求

jquery--------jq库1.8.3，安全扫描通过，防LOCATION.HASH跨站漏洞

js.cookie------原生cookie封装方法 Cookies.set（），get（）， del（）

keyPress-------event按键控制

logApi---------岩华BI埋点探针请求封装js
  包括启动应用日志，退出日志，访问日志，点击推荐位上报日志，点击订购，订购，收藏，筛选，点播

md5--------md5加密

play.js---------播控封装调用安卓js

util.js---------封装公共重用function的js

ZJDXlog----------浙江广电局方探针埋点js
```

#### search--------搜索页面

#### special------专题页面

#### video ------播控页面

#### ZJDXdetail-----浙江电信融合包页面


## 详情页——播放流程图

![Image text](http://dev.yanhuamedia.tv:84/download/attachments/26051222/%E6%B5%99%E6%B1%9F%E7%94%B5%E4%BF%A1%E6%B5%81%E7%A8%8B%E5%9B%BE.png?version=1&modificationDate=1595839365657&api=v2);