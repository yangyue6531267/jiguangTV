var enter_time = new Date().getTime()
function init() {
  if (window.location.search.length > 1) {
    history.itemNo = Number(getParam("type"));
    history.init();
    toggleClass(getId('nav-connent'), 'hover');
    if (getParam("pindex")) {
      history.isBack = true;
      history.pos = 1;
      connentBox.pindex = Number(getParam("pindex"));
      connentBox.itemNo = Number(getParam("contentItemNo"));
    }
    history.historyData(history.itemNo, connentBox.pindex);

    // 页面访问上报
    var url = document.location.search
    url = url.slice(0, 9)
    var jump = Cookies.get('jump')
    if (jump) {
      jump = JSON.parse(jump)
      try {
        var jsonOb = {}
        if (url == '?itemNo=0') {
          jsonOb.page_type = '0501'
          jsonOb.page_id = '103-1'
        } else {
          jsonOb.page_type = '0601'
          jsonOb.page_id = '101-1'
        }
        jsonOb.parent_page_type = jump.parent_page_type
        jsonOb.parent_page_id = jump.parent_page_id
        bi.jump(jsonOb)
        Cookies.set('jump', '', { path: '/' })
      } catch (error) {
        console.log('埋点错误', error)
      }
    }
  }
}

// 按键
var history = {};
history.id = 0;
history.name = 'history'
history.text = ''
history.totalNum = 0;
history.totalPage = 0;
history.searchList = [];
history.itemNo = 0;
history.pos = 0;
history.isBack = false;
history.changeClass = function () {
  if (this.itemNo == 1) {
    getId('keycode-connect').children[this.itemNo].setAttribute('class', 'select hover')
    getId('keycode-connect').style.top = 150 - getId('keycode-connect').clientHeight / 2 + 'px';
  } else {
    getId('keycode-connect').children[this.itemNo].setAttribute('class', 'select hover')
    getId('keycode-connect').style.top = '150px';
  }
};
history.up = function (params) {
  if (history.itemNo == 0) return
  getId('keycode-connect').children[this.itemNo].setAttribute('class', '')
  this.itemNo = 0;
  history.changeClass();
  history.historyData(this.itemNo, 1);
  history.updated();
}

history.down = function (params) {
  if (this.itemNo == 1) return;
  getId('keycode-connect').children[this.itemNo].setAttribute('class', '')
  this.itemNo = 1;
  history.changeClass();
  history.historyData(this.itemNo, 1);
  history.updated();
}

history.left = function (params) { }

history.right = function (params) {
  if (history.totalNum == 0) return
  removeClass(getId('keycode' + history.itemNo), 'hover');
  connentBox.init();
  toggleClass(connentBox.getCurr(), 'hover');
  connentBox.marquee('add');
}
history.enter = function () { }
history.updated = function () {
  connentBox.pindex = 1;
  connentBox.itemNo = 0;
}
// 模板内初始化方法
history.init = function (state) {
  // console.log('栏目导航绑定键值监听');
  areaObj = history;
  history.pos = 0;
  // toggleClass(getId('nav-connent'), 'hover');
  // 初始化焦点样式
  history.changeClass();
}
// 模板字符串
history.template = function (obj) {
  //如果某一页删除最后一项
  if (history.pos == 1 && obj.resultList.length == 0 && connentBox.pindex > 0) {
    connentBox.pindex--;
    history.itemNo = 0;
    history.historyData(history.itemNo, connentBox.pindex);
    return
  }
  history.totalNum = obj.resultNum;
  history.searchList = obj.resultList;
  connentBox.props(history.searchList);
  this.totalPage = Math.ceil(this.totalNum / 8)
  //右侧滑块，页数
  connentBox.movebar(connentBox.pindex);
  getId('history-num').innerHTML = connentBox.pindex + '/' + this.totalPage;
  getId('history-bar').style.height = 543 / this.totalPage + 'px';

  if (this.totalPage >= 1) {
    getId('history-num').style.display = 'block';
    getId('history-scroll').style.display = 'block';
  } else {
    getId('history-num').style.display = 'none';
    getId('history-scroll').style.display = 'none';
  }
  getId('top-c').style.display = 'none'
  if (history.totalNum <= 0) {
    getId('top-c').style.display = 'block';
    getId('upCorner').style.display = 'none';
    getId('downCorner').style.display = 'none';
    getId('top-c').style.display = 'block';
    getId('hisClear').style.visibility = 'hidden';
  } else {
    getId('hisClear').style.visibility = 'visible';
  }
  var element = getId('history-connent');
  element.innerHTML = '';
  var html = '';
  for (var i = 0; i < obj.resultList.length; i++) {
    var elementDom = obj.resultList[i];
    var div =
      '<li class="middle-li li-item' + i + '" id="li-item' + i + '" jsonurl="' + elementDom.relateUrl + '">'
      + '<div class="imgbox">'
      + "<img src='" + elementDom.relateImg + "'/>"
      + '</div>'
      + '<div class="word" id="word' + i + '">' + elementDom.relateTitle; +'</div></li>'
    html += div;
  }
  element.innerHTML = html;
  lazyLoadImage();
  if (history.isBack && history.pos == 1) {
    removeClass(getId('keycode' + history.itemNo), 'hover');
    if (connentBox.pindex * 8 - 7 + connentBox.itemNo > history.totalNum) {
      history.pos == 0;
      connentBox.itemNo = 0;
      removeClass(connentBox.getCurr(), 'hover');
      history.init();
    } else if (connentBox.pindex == 0 && history.totalNum == 0) {
      history.pos == 0;
      connentBox.itemNo = 0;
      history.init();
    } else {
      connentBox.init();
      history.pos == 1;
      removeClass(getId('nav-connent'), 'hover');
      toggleClass(connentBox.getCurr(), 'hover');
      connentBox.marquee('add');
    }
    history.isBack = false;
  } else {
    if (history.pos == 1) {
      removeClass(getId('keycode' + history.itemNo), 'hover');
      toggleClass(connentBox.getCurr(), 'hover');
      connentBox.marquee('add');
    }
    history.isBack = false;
  }
}

history.historyData = function (type, pindex) {
  getId('history-connent').innerHTML = '';
  var url = historylUrl + '/list?version=1&siteId=' + yh.siteId + '&userId=' + yh.userId + '&pindex=' + (pindex - 1) * 8 + '&psize=8'
  if (type == 1) {
    url = url + "&collectType=3"
  } else {
    url = url + "&collectType=1,2"
  }
  getYhSpecialSC(url, '', function (response) {
    if (JSON.parse(response).data.resultNum == 0) {
      getId('top-c').style.display = 'block';
      getId('top-c').innerHTML = "暂无内容";
    }
    if (JSON.parse(response).code !== 200) {
    } else {
      console.log(JSON.parse(response).data);
      history.template(JSON.parse(response).data);
    }
  }, function (err) {
    console.log(err)
  })
}

init();

onKeyPress = function (keyCode) {
  switch (keyCode) {
    case "up": //上边
      areaObj.up();
      break;
    case "down": //下边
      areaObj.down();
      break;
    case "left": //左边
      areaObj.left();
      break;
    case "right": //右边
      areaObj.right();
      break;
    case "back":
      var backUrl = Cookies.get('columnName') || '../../index.html';
      window.location = backUrl;
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
    case "keyDown":
      areaObj.next();
      break;
    case "keyUp":
      areaObj.prev();
      break;
  }
};
//事件绑定
document.onkeydown = grepEvent;

// 浙江电信历史页面上报心跳埋点
console.log('%cZJDX 浙江电信历史页面上报心跳埋点', 'color: #4169E1')
try {
  var type = {
    page_id: 'history.html',
    page_name: '',
    refer_pos_id: '',
    refer_pos_name: '',

    refer_page_id: 'history.html',
    refer_page_name: '',

    refer_type: '',
    refer_parent_id: '',

    mediacode: '',
    medianame: '',

    type: 0
  }
  ZJDXlog.timeStart(type)
} catch (error) {
  console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
}