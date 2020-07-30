var playConfig = {
  isRelease: true, //// playConfig.isRelease   默认false 开发环境  true线上环境(内网)
  isOrder: 1, //0 鉴权通过  1 未订购
}

var yh = {}

try {
  yh.siteId = '1001' // 站点ID
  yh.stbId = Authentication.CTCGetConfig("STBID") || '123456';
  yh.userId = Authentication.CTCGetConfig("UserID") || '123456'; // 用户ID
  yh.usergroupid = Authentication.CTCGetConfig("UserGroupNMB") || '123456';
  yh.sys_v = 'zhejiang' // 系统版本
  yh.soft_v = '1.0.1' // 用户软件版本
  yh.device_id = "12345"; // 设备号获取不到取userId
  yh.mobileNo = Authentication.CTCGetConfig("UserID") || '123456';
  yh.payForId = "701063";
} catch (error) {
  yh.siteId = '26' // 站点ID
  yh.sys_v = 'zhejiang' // 系统版本
  yh.soft_v = '1.0.1' // 用户软件版本

  yh.payForId = "701063";
  yh.mobileNo = "CS18393817034";
  yh.userId = "TV9311494111";
  yh.device_id = "005801FF0001090001C810D21CD050B6";
  yh.stbId = "005801FF0001090001C810D21CD050B6";
  // yh.switchs = 'dev' // dev:测试  pub：线上  
  console.log('yh------' + error);
}


// 判断类型的方法
function judgeObj(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
};

// 提交prompt的方法
function submitPrompt(key, params) {
  var p = 'yanhua://epg/';
  p += key;
  if (params && judgeObj(params) == 'Object') {
    p = p + '?';
    for (var i in params) {
      p += i + '=' + params[i] + '&'
    }
    p = p.slice(0, p.length - 1);
  }
  var a = prompt(p);
};

// 退出apk
function exit() {
  // 退出应用埋点
  try {
    bi.end()
  } catch (e) {
    console.log(e)
  }
  // toast(Cookies.get('backLauncherkUrl'));
  var url = Cookies.get('backLauncherkUrl') || 'http://220.191.136.42:33200/EPG/jsp/gdhdpublictest/Ver.1/pageHome.jsp'
  window.location.replace(url)
}

// 重写
function lazyLoadImage() {
  //获取全部带有data-img的img
  var limg = document.querySelectorAll("img[data-img]")
  var timer;
  // Array.prototype.forEach.call()是一种快速的方法访问forEach，并将空数组的this换成想要遍历的list
  timer && clearTimeout(timer);
  timer = setTimeout(function () {
    Array.prototype.forEach.call(limg, function (item, index) {
      var rect
      //假如data-img为空跳出
      if (item.getAttribute("data-img") === "")
        return
      //getBoundingClientRect用于获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left等属性。
      rect = item.getBoundingClientRect()
      // 图片一进入可视区，动态加载
      if (rect.bottom >= 0) {
        (function () {
          //给图片添加过渡效果，让图片显示
          var img = new Image()
          img.src = item.getAttribute("data-img")
          item.src = img.src
          item.removeAttribute('data-img')
        })()
      }
    })
  }, 100)
}


// 懒加载
function imgLazyLoad() {
  var timer = null;
  var len = document.querySelectorAll("img[data-img]").length;
  function getPos(node) {
    var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
      scrollt = document.documentElement.scrollTop || document.body.scrollTop;
    var pos = node.getBoundingClientRect();
    return {
      top: pos.top + scrollt,
      right: pos.right + scrollx,
      bottom: pos.bottom + scrollt,
      left: pos.left + scrollx
    }
  }

  function loadings() {
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        imgs = document.querySelectorAll("img[data-img]");
      // screenHeight = document.documentElement.clientHeight;
      for (var i = 0; i < imgs.length; i++) {
        var pos = getPos(imgs[i]),
          posT = pos.top,
          posB = pos.bottom,
          screenTop = 720 //盒端screenHeight+scrollTop不准||所以采用单屏高度
        // Babu.Debugging.writeLine((posT > scrollTop && posT < screenTop) + '------------' + (posB > scrollTop && posB < screenTop));
        if ((posT > scrollTop && posT < screenTop) || (posB > scrollTop && posB < screenTop)) {
          if (imgs[i].getAttribute('data-img')) {
            imgs[i].src = imgs[i].getAttribute('data-img');
            imgs[i].removeAttribute('data-img');
            imgs[i].classList.remove('lazyload');
          }
        }
      }
    }, 100);
  }
  if (!len) return;
  loadings();
  // var timer1 = null;

  // document.onkeyup = function (e) {

  //   var keyCode = e.keyCode || e.which;
  //   timer1 && clearTimeout(timer1);
  //   timer1 = setTimeout(function () {
  //     var keyCode = e.keyCode || e.which;
  //     // 40  38  上下    8、27、22、461、340、283返回键值
  //     if (keyCode == 40 || keyCode == 38 || keyCode == 8 || keyCode == 27 || keyCode == 22 || keyCode == 461 || keyCode == 340 || keyCode == 283) {
  //       if (!document.querySelectorAll("img[data-img]").length) {
  //         return;
  //       } else {
  //         loadings();
  //       }
  //     }
  //   }, 250)
  // }
}
// 日期操作 
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

// 获取原生dom
function getId(arg) {
  return document.getElementById(arg);
}
// 获取class对应的元素dom
function getClass(arg) {
  // console.log(arg);
  // return document.querySelector(arg);
  return document.getElementsByClassName(arg);
}

// 方法1
function addClass(ele, cls) {
  if (ele.classList) {
    ele.classList.add(cls);
  } else {
    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
  }

}

function arrIndexOf(arr, v) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == v) {
      return i;
    }
  }
  return -1;
}
//删除指定dom元素的样式
function removeClass(ele, cls) {
  if (ele.classList) {
    ele.classList.remove(cls);
  } else {
    if (ele.className != '') {
      var arrClassName = ele.className.split(' ');
      var classIndex = arrIndexOf(arrClassName, cls);
      if (classIndex !== -1) {
        arrClassName.splice(classIndex, 1);
        ele.className = arrClassName.join(' ');
      }
    }
  }
}
//如果存在(不存在)，就删除(添加)一个样式
function toggleClass(ele, cls) {
  if (hasClass(ele, cls)) {
    removeClass(ele, cls);
  } else {
    addClass(ele, cls);
  }
}

function hasClass(tagStr, classStr) {
  if (tagStr.classList) {
    return tagStr.classList.contains(classStr);
  } else {
    var arr = tagStr.className.split(/\s+/); //这个正则表达式是因为class可以有多个,判断是否包含
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == classStr) {
        return true;
      }
    }
    return false
  }
}

//获取首页传来的"backUrl"函数
function getParam(_key, _url) {
  _url = _url || window.location.href;
  if (new RegExp('.*\\b' + _key + '\\b(\\s*=([^&]+)).*', 'gi').test(_url)) {
    return RegExp.$2;
  } else {
    return '';
  }
}
//toast
function toast(msg) {
  var div = document.createElement('div');
  var div1 = document.createElement('div');
  var body = document.body;
  if (getId('toast')) {
    body.removeChild(getId('toast'));
  }
  div.id = "toast";
  div.style.cssText = "position: absolute; top: 50%; left: 50%;  -webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform:translate(-50%,-50%); text-align:center;z-index:99999;word-break: break-all; word-wrap: break-word;";
  div1.style.cssText = "display:inline-block;background:rgba(1,1,1,0.6); color:#fff; padding:20px; min-width:120px; text-align:center; font-size:22px; border-radius:5px;height100%;width: 100%;word-wrap: break-word;";
  div1.textContent = msg;
  div.appendChild(div1);
  body.appendChild(div);
  setTimeout(function () {
    body.removeChild(getId('toast'));
  }, 300000);
}

//计算字符长度
function strlen(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return parseInt(len / 2);
}

function getTimeString(timeType) {
  if (!timeType) {
    timeType = "min"
  }

  function pad2(n) {
    return n < 10 ? '0' + n : n
  }
  var date = new Date()
  if (timeType == "hour") {
    return (
      date.getFullYear().toString() +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      pad2(date.getHours())
    )
  } else if (timeType == 'min') {
    return (
      date.getFullYear().toString() +
      pad2(date.getMonth() + 1) +
      pad2(date.getDate()) +
      pad2(date.getHours()) +
      pad2(date.getMinutes())
    )
  } else if (timeType == 'yy-pp') {
    return (
      date.getFullYear().toString() + '-' +
      pad2(date.getMonth() + 1) + '-' +
      pad2(date.getDate()) + ' ' +
      pad2(date.getHours()) + ':' +
      pad2(date.getMinutes()) + ':' +
      pad2(date.getSeconds())
    )
  }
}

//鉴权
function userPower(callBack, foreignId) {
  Cookies.set('isOrder', "1", {
    path: '/'
  })
  playConfig.isOrder = 1;
  var userId = getAuthenticationAttr("UserID");
  var EPGGroupNMB = getAuthenticationAttr("EPGGroupNMB"); //cdn分组
  var epgDomain = getAuthenticationAttr("EPGDomain"); //ip地址
  var fix = "/EPG/jsp";
  var preUrl = epgDomain.substring(0, epgDomain.indexOf(fix));
  var url = preUrl + "/EPG/jsp/" + EPGGroupNMB + "/serviceProvider/chances/vod_auth_hw.jsp?foreignId=" + foreignId + "&userId=" + userId;
  console.log("鉴权" + url);
  getYhSpecialList_nc(url, function (response) {
    console.log("鉴权订购信息" + response);
    var data = JSON.parse(response);
    if (data.status == 200) {
      if (data.retCode == 0) {
        Cookies.set('isOrder', "0", {
          path: '/'
        })
      }
    }
    callBack && callBack();
  }, function (error) {
    console.log(JSON.stringify(error));
    callBack && callBack();
  }, true)
}

var powerData = function (response) {
  console.log(response)
  //   // + '" subContentId="' + subContentId+ '"  path="' + path+ '"  preview="' + preview + '" channelId="' + channelId + '" productId="' + productId + '" token="' + token
  var parser = new DOMParser();
  //读取返回字符串
  var _xml = parser.parseFromString(response, "text/xml");
  //获取节点内容
  var domXml = _xml.getElementsByTagName("authorize")[0]
  //0：鉴权成功1：鉴权失败需要订购  10: 用户未登录 20：账户的计费标识需要验证 30：您的帐户不能消费 31：对应牌照方没可计费的产品 50:试看鉴权通过

  var result = domXml.getAttribute('result')
  var resultDesc = domXml.getAttribute('resultDesc')
  var result = domXml.getAttribute('result')
  if (result == 0 || result == 50) {
    Cookies.set('isOrder', "0", {
      path: '/'
    })
    playConfig.isOrder = 0;
  }
  callback && callback();
}

//loading
function loading(type) {
  var body = document.body;
  if (type == 'hidden') {
    getId('loading') && body.removeChild(getId('loading'));
    return
  }
  var div = document.createElement('div');
  var div1 = document.createElement('div');
  div.id = "loading";
  div.style.cssText = "position: fixed;top: 0;width: 1280px;height: 720px;    background: linear-gradient(to right, rgba(103, 110, 109, 1), rgba(48, 84, 115, 1));z-index: 99999;visibility: visible;";
  div1.style.cssText = "width: 120px;height: 120px;position: relative;margin: 0 auto;margin-top: 300px;background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAByCAYAAABp9E45AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDdCQ0YzQTI4RDIzMTFFNzk2NUJFODIzNkM5QTdFOEQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDdCQ0YzQTM4RDIzMTFFNzk2NUJFODIzNkM5QTdFOEQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowN0JDRjNBMDhEMjMxMUU3OTY1QkU4MjM2QzlBN0U4RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowN0JDRjNBMThEMjMxMUU3OTY1QkU4MjM2QzlBN0U4RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnIIWP0AAAaNSURBVHja7J1baBxl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);line-height: 0;font-size: 0;text-align: center;animation-name: load;animation-duration: 3s;animation-iteration-count: infinite;animation-timing-function: linear;-webkit-animation-name: load;-webkit-animation-duration: 2s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;white-space: nowrap;overflow: hidden;";
  div.appendChild(div1);
  body.appendChild(div);
}

//函数防抖
var timeout = null;

function debounce(func, wait) {
  var context = this;
  var args = arguments;
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(function () {
    func.apply(context, args)
  }, wait);
}