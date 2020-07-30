Cookies.set('qb_datetime', (new Date()).valueOf(), {
  path: '/'
})
var clientId;

var value = {
  detailData: {}, //获取的详情数据
  isBack: false,
  layout: '',
  GetPlayUrl: '',
  detailUrl: "", //cookies get (detailUrl)
  isOrder: 1, //订购order
  itemPlay: 0, //选集
  list: null, //资产子集数组
  timers: null,
  blackJson: '', //黑白名单JOSN
  userToken: '',
  vtoken: '', //腾讯用户token
  vuId: '', //腾讯用户
  tvsKey: '',
  resJSON: null,
  BlackList: 0, // 重复请求次数
  historyTime: {
    time: 0,
    index: 0,
  },
  siteId: "",
  historyTimes: 0,
  getValue: function () {
    player.initPlayer();
    // this.detailUrl = Cookies.get('detailUrl');
    console.log('获取播放');
    videoOptions.onStart = function (res) {
      console.log('准备播放')
    }
    videoOptions.onPlay = function (res) {
      console.log('开始播放')
      getId('loading').style.display = 'none';
      areaObj = playContent;
      console.log('%cZJDX 浙江电信主页跳转到栏目埋点', 'color: #4169E1');
      var type = {
        // mediacode: getParam("contentId", value.detailData.itemList[value.itemPlay].vodList[0].playUrl),
        // mediaduration: value.detailData.itemList[value.itemPlay].vodList[0].duration,
        // seriescode: value.detailData.assetId,
        // seriesflag: '0',
        // start_Time: Cookies.get('qb_datetime'),
        // currentplaytime: playmode.startTime, // 当前播放时间
        // refer_type: '0',//refer_type,
        // refer_page_id: '0',//refer_page_id,
        // refer_page_name: '', //refer_page_name,
        // refer_pos_id: '',//refer_pos_id,
        // refer_pos_name: '',//refer_pos_name,
        // refer_mediacode: '',//refer_mediacode,
        // refer_parent_id: '',//refer_parent_id
        // type: "1"
        "action_type": "vod_playing",
        "sys_id": "m",
        "user_id": clientId,
        "user_group_id": value.resJSON.EPGGroupNMB,
        "epg_group_id": value.resJSON.EPGGroupNMB,
        "mediacode": getParam("contentId", value.detailData.itemList[value.itemPlay].vodList[0].playUrl),
        "seriescode": value.detailData.layout == "Detail_Movie" ? "" : value.detailData.assetCode,
        "seriesflag": value.detailData.layout == "Detail_Movie" ? "0" : "1",
        "start_time": Cookies.get('qb_datetime'),
        "currentplaytime": playmode.startTime,
        "refer_type": value.resJSON.refer_type,
        "refer_page_id": value.resJSON.refer_page_id,
        "refer_pos_id": value.resJSON.refer_page_id,
        "refer_page_name": value.detailData.assetName,
        "tryview": "0",
        "type": "1"
      }
      ZJDXlog.timeStart(type)
    }
    videoOptions.onProgress = function (res) {
      // console.log('每秒调用');
      playmode.refreshProgressView(res.curPlayTime, res.allTime);
    }
    videoOptions.onPause = function (res) {
      console.log('暂停')
      playmode.stopPlay = true;
    }
    videoOptions.onResume = function (res) {
      console.log('续播')
      document.getElementById("moveTime").style.cssText = "display:none";
      // playmode.cachePlayTime =-1;
      playmode.stopPlay = false;
    }
    videoOptions.onStop = function (res) {
      console.log('手动停止')
      // playRecord();
      // var json = {
      //   time: playmode.startTime * 1,
      //   index: value.itemPlay * 1
      // };
      // Cookies.set(value.detailData.assetId, JSON.stringify(json), {
      //   path: '/'
      // })
      // try {
      //   var json = {}
      //   json.userId = clientId;
      //   json.siteId = value.resJSON.siteId;
      //   json.asset_id = value.detailData.assetId;
      //   json.item_id = value.detailData.itemList[value.itemPlay].itemId
      //   json.qb_datetime = Cookies.get('qb_datetime')
      //   json.zb_datetime = (new Date()).valueOf()
      //   json.time = json.zb_datetime - json.qb_datetime
      //   json.ep = value.detailData.episodes
      //   json.fee = '1'
      //   json.isFullScreen = '0'
      //   json.pos_id = value.resJSON.refer_page_id
      //   json.recmd_id = value.resJSON.refer_page_id
      //   json.parent_page_type = '0301'
      //   json.parent_page_id = value.detailData.assetId
      //   bi.vod(json)
      // } catch (e) {
      //   console.log('错误信息' + e)
      // }
    }
    videoOptions.onCompleted = function (res) {
      console.log('播放完毕' + JSON.stringify(res))
      try {
        var json = {}
        json.userId = clientId;
        json.siteId = value.resJSON.siteId;
        json.asset_id = value.detailData.assetId;
        json.item_id = value.detailData.itemList[value.itemPlay].itemId
        json.qb_datetime = Cookies.get('qb_datetime')
        json.zb_datetime = (new Date()).valueOf()
        json.time = json.zb_datetime - json.qb_datetime
        json.ep = value.detailData.episodes
        json.fee = '1'
        json.isFullScreen = '0'
        json.pos_id = Cookies.get('pos_id')
        json.recmd_id = Cookies.get('recmd_id')
        json.parent_page_type = '0301'
        json.parent_page_id = value.detailData.assetId
        bi.vod(json)
        Cookies.set('qb_datetime', (new Date()).valueOf(), {
          path: '/'
        })
      } catch (e) {
        console.log('错误信息' + e)
      }
      var isZero = Cookies.get('specialType');
      if (value.itemPlay >= value.list.length - 1) {
        value.itemPlay = 0;
        playRecord("0");
        // window.location.href = "./../detail/detail.html";
        player.stop();
        setTimeout(function () {
          prompt("yanhua://epg/exitProcess");
        }, 3000)
        return
      }
      if (value.detailData.itemList[value.itemPlay + 1].fee == "2" && value.isOrder == 1 && isZero != 0) {
        // value.itemPlay = 0;
        playRecord("0");
        toast("返回详情页订购，优享视觉盛宴");
        // window.location.href = "./../detail/detail.html";
        setTimeout(function () {
          prompt("yanhua://epg/exitProcess");
        }, 3000)
        return
      } else {
        playRecord();
        playmode.playNext();
      }
    }
    videoOptions.onError = function (res) {
      console.log('报错');
      toast('播放失败' + '(' + res.errorCode + ')' + '视频暂时无法观看，请稍后重试');
    }
  },
  // 播放器
  play: function (obj) {
    try {
      player.setCallback(player.videoStateChange);
      view.hideTopBottom();
      player.setDisplayerLocation();
      player.toggleShow('showPlayer');
      // var playUrl ='http://iptvdirect.gs.chinamobile.com/270000000322/6990015801111110000000001064231/index.m3u8'
      var playUrl = value.list[obj.index].vodList[0].playUrl;
      // var playUrl = "http://iptvdirect.gs.chinamobile.com/270000000322/" + value.list[obj.index].vodList[0].playUrl.split(":")[1] + "/index.m3u8";
      var OpJson = {
        playUrl: playUrl,
        historyTime: obj.time
      }
      player.play(OpJson)
    } catch (error) {
      console.log(error);
      console.log('播放器初始化失败');
    }
  },
  TxPaly: function (obj) {
    player.stop();
    try {
      player.setCallback(player.videoStateChange);
      view.hideTopBottom();
      player.setDisplayerLocation();
      player.toggleShow('showPlayer');
      var OpJson = {
        playUrl: obj,
        historyTime: value.historyTimes
      }
      console.log('播放器时长' + JSON.stringify(OpJson));
      player.play(OpJson)
    } catch (error) {
      console.log(error);
      console.log('播放器初始化失败');
    }
  }
}

var loading = {
  back: function () {
    prompt("yanhua://epg/exitProcess");
  }
}

function qeryHistory(call) {
  // 查询播放历史记录
  value.historyTimes = 0;
  console.log("集数" + value.detailData.assetId);
  var url = historylUrl + '/list?version=1&siteId=' + value.resJSON.siteId + '&userId=' + clientId + '&pindex=0&psize=16&collectType=3'
  console.log("查询播放记录:" + value.itemPlay);
  var data = ""
  getYhSpecialSC(url, data, function (response) {
    console.log("查询播放记录:" + response)
    var response = JSON.parse(response);
    if (response.code !== 200) { } else {
      // if (Cookies.get('isOrder') && Cookies.get('isOrder') == 0) {
      for (var i = 0; i < response.data.resultList.length; i++) {
        var element = response.data.resultList[i];
        if (element.relateId == value.detailData.assetId) {
          console.log("收藏集数id相同");
          console.log("集数" + element.relateTitle + (element.relateId == value.detailData.assetId));
          // console.log(JSON.stringify(element));
          // console.log(value.detailData.assetId);
          // console.log("播放集数为" + value.itemPlay);
          // console.log("历史集数为" + element.relateEpisode);
          // console.log("历史集数时长为" + element.relateTime);
          if ((element.relateEpisode * 1 - 1) == value.itemPlay) {
            console.log("收藏集数时长" + element.relateTime);
            value.historyTimes = element.relateTime * 1;
            if (element.relateTime * 1 >= 10000) {
              playmode.firstTime = true;
              getId("firstHistoryinfo").innerHTML = '上次观看到' + playmode.getTimeFormat(element.relateTime * 1) + '，按左键快速从头播放'
              getId("firstHistoryinfo").style.display = "block"
              setTimeout(function () {
                playmode.firstTime = false;
                getId("firstHistoryinfo").style.display = "none"
              }, 7000)
            }
          }
          call() && call
          // 有播放记录，并返回集数
          // indexSingle.itemNo = element.relateEpisode * 1 - 1;
          // indexSingle.indexPlay = indexSingle.itemNo;

          // obj.index = element.relateEpisode || 1;
        }
      }
      call() && call
      // }
    }
    // topContent.play(obj);
  }, function (responses) {
    // 初始化播放器
    console.log("查询播放记录失败" + responses)
    call() && call
  })
}

function BlackWriteList() {
  // 白名单正式代理环境
  // var clientId = value.resJSON.clientId;
  // var spCode = value.resJSON.spCode; //运营商代
  console.log("用户id:" + clientId);
  var spCode = "1008"; //运营商代
  var url = blackUrl + "/ums/vui?s=1&v=2&clientId=" + clientId + "&spCode=" + spCode;
  getYhSpecialList_nc(url, function (datas) {
    console.log('黑白名单');
    var data = JSON.parse(datas);
    if (data.code == 200) {
      if (data.data.specialType != undefined) {
        if (data.data.specialType == 2) {
          Cookies.set('specialType', 0, {
            path: '/'
          })
          // 白名单
        } else if (data.data.specialType == 1) {
          Cookies.set('specialType', 1, {
            path: '/'
          })
          // 黑名单
        }
      } else {
        Cookies.set('specialType', 2, {
          path: '/'
        })
        // 普通
      }
      value.blackJson = data.data;
      value.vuId = data.data.vuid;
      value.userToken = value.blackJson.token.userToken;
      value.vtoken = value.blackJson.vtoken;
      getAccessKey();
    }
    console.log("黑白名单值" + Cookies.get('specialType'));
  }, function (error) {
    console.log(error);
  }, true)
}

//腾讯accesskey接口
function getAccessKey() {
  var url = blackUrl + "/ums/uak?v=2&s=1&userToken=" + value.userToken;
  getYhSpecialList_nc(url, function (res) {
    var data = JSON.parse(res);
    if (data.code == 200) {
      var ak = encodeURIComponent(data.data.ak)
      console.log('腾讯accesskey' + data.data.ak);
      console.log("加密token" + ak);
      // if (clientId == "1571915054012030") {
      //   toast('测试用户:' + data.data.ak + "+");
      //   ak = encodeURIComponent(data.data.ak + "+")
      // }
      var TXPlayJson = {
        vuid: value.vuId,
        vtoken: value.vtoken,
        accesstoken: ak,
        return: "GetTxPlayVoucher"
      }
      console.log("GetTxPlayVoucher" + JSON.stringify(TXPlayJson));
      submitPrompt("GetTxPlayVoucher", TXPlayJson);
    } else if (data.code == 201) {
      //无效token
      BlackWriteList();
    }
  }, function (error) {
    console.log(error)
  }, true)
}

// 播放历史记录
function playRecord(time) {
  var collectType = '3';
  var relateId = value.detailData.assetId;
  var relateTitle = value.detailData.assetName;
  var relateImg = value.detailData.assetImg;
  var relateUrl = value.resJSON.DetailUrl;
  var relateLayout = value.detailData.layout;
  var relateScore = value.detailData.score == undefined ? '' : value.detailData.score;
  var relateEpisode = (value.itemPlay * 1 + 1).toString();
  var relateTime
  if (time) {
    relateTime = (time * 1).toString();
    console.log("清空历史0000" + relateTime);
  } else {
    relateTime = (playmode.startTime * 1).toString();
  }
  if (value.detailData.score && value.detailData.score.length == 1) {
    relateScore += '0'
  }
  var data = '{"siteId":' + '"' + value.resJSON.siteId + '"' + ',"relateEpisode":' + '"' + relateEpisode + '"' + ',"relateTime":' + '"' + relateTime + '"' + ',"userId":' + '"' + clientId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + ',"relateScore":' + '"' + relateScore + '"' + '}';
  // var data = {
  //   "siteId": yh.siteId,
  //   "relateEpisode": relateEpisode,
  //   "relateTime": relateTime,
  //   "userId": yh.userId,
  //   "collectType": collectType,
  //   "relateId": relateId,
  //   "relateTitle": relateTitle,
  //   "relateImg": relateImg,
  //   "relateUrl": relateUrl,
  //   "relateLayout": relateLayout,
  //   "relateScore": relateScore
  // };
  console.log("清空历史0000" + data);
  var urls = historylUrl + '/collect?version=1'
  getYhSpecialSC(urls, data, function (res) {
    console.log("播放历史记录时长" + JSON.stringify(res))
  }, function (error) {
    console.log("播放历史记录失败" + error)
    return
  })
  // getYhSpecialSC(urls, data, function (response) {
  //   console.log("播放历史记录成功" + JSON.stringify(response))
  // }, function (error) {
  //   console.log("播放历史记录失败" + error)
  // })
};

// 播放数据请求
var getData = function (url) {
  console.warn("=播放器" + url);
  $.ajax({
    type: "GET",
    url: url + '&returnType=jsonp',
    dataType: "jsonp",
    jsonpCallback: 'jsonpCallback',
    success: function (response) {
      value.detailData = response.data;
      console.log("请求整体信息" + JSON.stringify(value.detailData));
      // value.itemPlay = value.historyTime.index;
      value.list = value.detailData.itemList;
      playContent.init();
      if (value.detailData.layout == 'Detail_News') {
        zongyiList.init();
      } else {
        indexList.init();
      }
      // value.play(value.historyTime);
      BlackWriteList();
    },
    fail: function (error) {
      console.log(error);
    }
  })
}
// playContent
// 播放器操作内容，渲染
var playContent = {
  isStop: false,
  init: function () {
    // console.log(value.detailData.assetName);
    if (value.detailData.layout == 'Detail_Movie') {
      // console.log('电影隐藏播放');
      document.getElementById("play_name").innerHTML = value.detailData.assetName;
      document.getElementById("textVideo").innerHTML = value.detailData.assetName;
    } else {
      // document.getElementById("play_info").innerHTML = "第" + (value.itemPlay * 1 + 1) + "集";
      console.log(value.detailData.itemList[value.itemPlay]);
      document.getElementById("play_name").innerHTML = value.detailData.itemList[value.itemPlay].itemName;
      document.getElementById("textVideo").innerHTML = value.detailData.itemList[value.itemPlay].itemName;
      // document.getElementById("textindex").innerHTML = ;
      if (document.getElementById("textVideo").innerHTML.length > 20) {
        getId("textload").style.top = '244px';
      }
    }
    // console.log("显示集数" + value.itemPlay);
    // document.getElementById("description").innerHTML = value.detailData.description
    view.hideTopBottom();
  },
  right: function () {
    // playmode.pause();
    playmode.goForwardView();
  },
  left: function () {
    // playmode.pause();
    playmode.goBackView();
  },
  enter: function () {
    if (this.isStop) {
      this.isStop = false;
      document.getElementById("play_center").style.cssText = 'display:none'
      player.togglePlay('resume');
    } else {
      this.isStop = true;
      document.getElementById("play_center").style.cssText = 'display:table'
      view.hideTopBottom();
      player.togglePlay('pause');
    }
  },
  back: function () {
    playRecord();
    document.getElementById("play-top").style.cssText = 'display:none';
    document.getElementById("play-bottom").style.cssText = 'display:none'
    backFirm.init();
    areaObj = backFirm;
  },
  up: function () {
    if (value.detailData.layout == 'Detail_News') {
      areaObj = zongyiList;
      zongyiList.marquee();
      zongyiList.addCss();
      zongyiList.marquee("add");
    } else if (value.detailData.layout == "Detail_Series") {
      areaObj = indexList;
      indexList.addCss();
    } else {
      return
    }
    document.getElementById("play-top").style.cssText = 'display:none';
    document.getElementById("play-bottom").style.cssText = 'display:none'
    document.getElementById('play_list').style.display = 'block'
  }
}

var backFirm = {
  item: true,
  init: function () {
    getId('backFirm').style.display = 'block';
    try {
      var json = {}
      json.userId = clientId;
      json.siteId = value.resJSON.siteId;
      json.asset_id = value.detailData.assetId;
      json.item_id = value.detailData.itemList[value.itemPlay].itemId
      json.qb_datetime = Cookies.get('qb_datetime')
      json.zb_datetime = (new Date()).valueOf()
      json.time = json.zb_datetime - json.qb_datetime
      json.ep = value.detailData.episodes
      json.fee = '1'
      json.isFullScreen = '0'
      json.pos_id = Cookies.get('pos_id')
      json.recmd_id = Cookies.get('recmd_id')
      json.parent_page_type = '0301'
      json.parent_page_id = value.detailData.assetId
      Cookies.set('qb_datetime', (new Date()).valueOf(), {
        path: '/'
      })
      bi.vod(json)
    } catch (e) {
      console.log('错误信息' + e)
      toast(JSON.stringify(e))
    }
  },
  back: function () {
    getId('backFirm').style.display = 'none';
    areaObj = playContent;
  },
  enter: function () {
    if (this.item) {
      // 返回
      player.stop();
      prompt("yanhua://epg/exitProcess");
    } else {
      // 恢复播放
      this.back();
    }
  },
  left: function () {
    this.item = true;
    removeClass(getId("backFalse"), 'active');
    addClass(getId('backTrue'), 'active');
  },
  right: function () {
    this.item = false;
    removeClass(getId("backTrue"), 'active');
    addClass(getId('backFalse'), 'active');
  }

}

// 单条选集栏
var indexList = {
  data: {},
  element: null,
  number: 0,
  indexWidth: 103,
  indexPlay: 0,
  init: function () {
    document.getElementsByClassName('play_intNumber')[0].style.display = 'block'
    this.data = value.list;
    this.element = getId('play_int');
    var html = '';
    var isZero = Cookies.get('specialType');
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].fee == "2" && value.isOrder == 1 && isZero != 0) {
        var div = '<div class="play_indexNumber" id = "indexNumber' + i + '"><img src="./../public/images/detail/vip.png" alt=""><div class="icon"></div>' + (i + 1) + '</div >'
      } else {
        var div = '<div class="play_indexNumber" id = "indexNumber' + i + '"><div class="icon"></div>' + (i + 1) + '</div >'
      }
      html += div;
    }
    this.element.innerHTML = html;
  },
  addCss: function () {
    addClass(getId("indexNumber" + indexList.number), 'active')
  },
  removeCss: function () {
    removeClass(getId("indexNumber" + indexList.number), 'active');
  },
  // 确定播放
  isplayCss: function () {
    for (var i = 0; i < this.data.length; i++) {
      removeClass(getId("indexNumber" + i), 'change');
      getId("indexNumber" + i).getElementsByClassName("icon")[0].style.display = "none";
    }
    addClass(getId("indexNumber" + indexList.number), 'change')
    getId("indexNumber" + indexList.number).getElementsByClassName("icon")[0].style.display = "block";
  },
  movelist: function (type) {
    //移动选集块
    // this.number = this.indexPlay;
    if (type == 'left') {
      this.element.style.left = -this.indexWidth * (this.number - 6) + 'px'; //单集按钮滚动
    } else {
      this.element.style.left = -this.indexWidth * (this.number - 5) + 'px'; //单集按钮滚动
    }
  },
  left: function () {
    if (this.number <= 0) {
      return
    }
    if (this.number > 5) {
      this.movelist('left')
    }
    this.removeCss();
    this.number--;

    this.addCss()
  },
  right: function () {
    if (this.number >= this.data.length - 1) {
      return
    }
    this.removeCss();
    this.number++;
    if (this.number > 5) {
      this.movelist('right')
    }
    this.addCss()
  },
  enter: function () {
    this.isplayCss();
    if (this.number == value.itemPlay) {
      return
    }
    if (playContent.isStop) {
      playContent.isStop = false;
      document.getElementById("play_center").style.cssText = 'display:none'
      view.hideTopBottom();
      player.togglePlay('resume');
    }
    value.itemPlay = this.number;
    value.historyTime.index = this.number;
    if (value.detailData.itemList[value.itemPlay].fee == "2" && value.isOrder == 1 && Cookies.get('specialType') != 0) {
      // playRecord();
      toast("返回详情页订购，优享视觉盛宴");
      setTimeout(function () {
        prompt("yanhua://epg/exitProcess");
      }, 3000)
      // return
    } else {
      // document.getElementById("play_center").style.cssText = 'display:none';
      // view.hideTopBottom();
      playContent.init();
      qeryHistory(playIndex);
      view.hideBottomList();
    }
    // value.play(value.historyTime);
  },
  down: function () {
    document.getElementById('play_list').style.display = 'none';
    areaObj = playContent;
  },
  back: function () {
    this.down();
  },
}
//z综艺选集栏目
var zongyiList = {
  data: {},
  element: null,
  number: 0,
  indexWidth: 253,
  indexPlay: 0,
  timer: null,
  init: function () {
    document.getElementsByClassName('play-zongyi')[0].style.display = 'block'
    this.data = value.list;
    this.element = getId('play-zongyi');
    var html = '';
    var isZero = Cookies.get('specialType');
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].fee == "2" && value.isOrder == 1 && isZero != 0) {
        var div = '<div class="zongyi_Number" id="zongyi_Number' + i + '"><img src="./../public/images/detail/vip.png" alt=""><div class="icon"></div><p class="Ptext" id="zongyi_Numbers' + i + '">' + this.data[i].itemName + '</p></div>'
      } else {
        var div = '<div class="zongyi_Number" id="zongyi_Number' + i + '"><div class="icon"></div><p class="Ptext" id="zongyi_Numbers' + i + '">' + this.data[i].itemName + '</p></div>'
        // var div = '<div class="zongyi_Number" id="zongyi_Number' + i + '"><div class="icon"></div><p class="Ptext">' + this.data[i].itemName + '</p></div>'
      }
      html += div;
    }
    this.element.innerHTML = html;
  },
  marquee: function (status) {
    // 滚动
    var scrollLeft = 0;
    clearInterval(this.timer);
    var div = getId("zongyi_Numbers" + this.number);
    var length = strlen(div.innerHTML);
    if (length < 10) return
    if (status == 'add') {
      this.timer = setInterval(function () {
        addClass(div, 'textChange')
        if (scrollLeft <= -20 * length) {
          scrollLeft = 220;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        } else {
          scrollLeft += -2;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        }
      }, 40);
    } else {
      removeClass(div, 'textChange')
      if (length >= 10) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
      }
    }
  },
  addCss: function () {
    addClass(getId("zongyi_Number" + this.number), 'active')
  },
  removeCss: function () {
    removeClass(getId("zongyi_Number" + this.number), 'active');
  },
  // 确定播放
  isplayCss: function () {
    for (var i = 0; i < this.data.length; i++) {
      removeClass(getId("zongyi_Number" + i), 'change');
      getId("zongyi_Number" + i).getElementsByClassName("icon")[0].style.display = "none";
    }
    addClass(getId("zongyi_Number" + this.number), 'change')
    getId("zongyi_Number" + this.number).getElementsByClassName("icon")[0].style.display = "block";
  },
  movelist: function (type) {
    //移动选集块
    // this.number = this.indexPlay;
    if (type == 'left') {
      this.element.style.left = -this.indexWidth * (this.number - 3) + 'px'; //单集按钮滚动
    } else {
      this.element.style.left = -this.indexWidth * (this.number - 2) + 'px'; //单集按钮滚动
    }
  },
  left: function () {
    if (this.number <= 0) {
      return
    }
    this.marquee()
    if (this.number > 2) {
      this.movelist('left')
    }
    this.removeCss();
    this.number--;
    this.addCss()
    this.marquee('add')
  },
  right: function () {
    if (this.number >= this.data.length - 1) {
      return
    }
    this.marquee()
    this.removeCss();
    this.number++;
    if (this.number > 2) {
      this.movelist('right')
    }
    this.addCss()
    this.marquee('add')
  },
  enter: function () {
    this.isplayCss();
    value.itemPlay = this.number;
    value.historyTime.index = this.number;
    if (value.detailData.itemList[value.itemPlay].fee == "2" && value.isOrder == 1 && Cookies.get('specialType') != 0) {
      // playRecord();
      toast("返回详情页订购，优享视觉盛宴");
      setTimeout(function () {
        prompt("yanhua://epg/exitProcess");
      }, 3000)
      // return
    } else {
      playContent.init();
      try {
        var json = {}
        json.userId = clientId;
        json.siteId = value.resJSON.siteId;
        json.asset_id = value.detailData.assetId;
        json.item_id = value.detailData.itemList[value.itemPlay].itemId
        json.qb_datetime = Cookies.get('qb_datetime')
        json.zb_datetime = (new Date()).valueOf()
        json.time = json.zb_datetime - json.qb_datetime
        json.ep = value.detailData.episodes
        json.fee = '1'
        json.isFullScreen = '0'
        json.pos_id = Cookies.get('pos_id')
        json.recmd_id = Cookies.get('recmd_id')
        json.parent_page_type = '0301'
        json.parent_page_id = value.detailData.assetId
        bi.vod(json)
        Cookies.set('qb_datetime', (new Date()).valueOf(), {
          path: '/'
        })
      } catch (e) {
        console.log('错误信息' + e)
      }
      qeryHistory(playIndex);
      view.hideBottomList();
    }
  },
  up: function () { },
  down: function () {
    document.getElementById('play_list').style.display = 'none';
    areaObj = playContent;
  },
  back: function () {
    this.down();
  },
}
//页面键值操作
var playmode = {
  firstTime: false, //有观看记录进入判断左键回0秒
  funViewInited: false,
  playState: 0,
  cachePlayTime: -1,
  currPlayTime: -1,
  startTime: 0,
  allTime: null,
  stopPlay: false,
  time: null,
  ret: null,
  timers: null,
  getTimeFormat: function (secondTimes) {
    var secondTime = secondTimes / 1000;
    if (secondTime <= 0) {
      return '00:00:00';
    }
    var hour = parseInt(secondTime / 3600) + '';
    if (hour.length == 1) {
      hour = '0' + hour;
    }
    var minute = parseInt((secondTime % 3600) / 60) + '';
    if (minute.length == 1) {
      minute = '0' + minute;
    }
    var second = parseInt(secondTime % 60) + '';
    if (second.length == 1) {
      second = '0' + second;
    }
    return hour + ':' + minute + ':' + second;
  },
  resume: function () {
    document.getElementById("play_center").style.cssText = 'display:none'
    player.togglePlay('resume');
  },
  pause: function (obj) {
    if (!obj) {
      document.getElementById("play_center").style.cssText = 'display:table'
    } else {
      view.moveShowBox(obj)
    }
    player.togglePlay('pause');
  },
  refreshProgressView: function (startTime, allTime) {
    // 若没有数据，则在1秒后再尝试
    if (allTime <= 0) {
      this.funViewInited = false;
      setTimeout(function () {
        this.refreshProgressView(startTime, allTime);
      }, 1000);
      return;
    }
    this.funViewInited = true;
    playmode.startTime = startTime;
    playmode.allTime = allTime * 1;
    // console.log("refreshProgressView total time = " + this.playerCore.getTotalTime() + " currtime = " + this.playerCore.getCurrentTime());
    // this.currPlayTime = this.playerCore.getCurrentTime();

    // if (this.playState == 2) {
    //   console.log('刷新进度条，暂停状态');
    // } else {
    //   console.log('刷新进度条,播放器状态' + this.playState);
    // }

    if (!this.stopPlay) {
      view.timeChange(startTime, allTime);
    }
  },
  goForwardView: function () {
    // 快进
    if (this.startTime == 0 || this.allTime == 0) return;
    if (this.time != null) {
      clearTimeout(this.time);
    }
    if (this.ret != null) {
      clearTimeout(this.ret);
      // console.log('清除时间');
    }
    view.hideTopBottom();
    if (!this.funViewInited) {
      return;
    }
    if (!this.stopPlay) {
      this.pause(true);
    }
    // if (!this.funViewInited) { return; }
    if (this.cachePlayTime < this.startTime) {
      this.cachePlayTime = -1;
    }
    // console.log('现在时间' + this.startTime);
    if (this.cachePlayTime != -1) {
      this.currPlayTime = this.cachePlayTime;
    } else {
      this.currPlayTime = this.startTime;
      this.ret = setTimeout(function () {
        playmode.currPlayTime = -1;
        // console.log(playmode.currPlayTime);
      }, 1000);
    }
    // console.log("全部时间" + this.allTime);
    // console.log(playmode.currPlayTime);
    // if (this.currPlayTime > this.allTime) { return; }
    // console.log(this.currPlayTime);
    this.currPlayTime = this.currPlayTime * 1 + 20000;
    // console.log('开始快进')
    if (this.currPlayTime > this.allTime) {
      this.currPlayTime = this.allTime - 5000;
    }
    // console.log('快进到底')
    this.cachePlayTime = this.currPlayTime;
    // console.log('开始跳转')
    view.timescrollmove(this.currPlayTime, this.allTime);
    this.time = setTimeout(function () {
      player.seekTime({
        seekTime: playmode.currPlayTime
      });
      // console.log('跳转成功')
      playmode.cachePlayTime = -1
      playmode.resume();
    }, 800)
  },
  goBackView: function () {
    if (playmode.firstTime) {
      if (!this.stopPlay) {
        this.pause(true);
      }
      view.timescrollmove(0, this.allTime);
      if (this.timers != null) {
        clearTimeout(this.timers);
      }
      this.timers = setTimeout(function () {
        player.seekTime({
          seekTime: 0
        });
        playmode.resume();
        playmode.cachePlayTime = -1
        getId('firstHistoryinfo').style.display = 'none';
      }, 800)
      return
    }
    // 快退
    if (this.startTime == 0 || this.allTime == 0) return;
    if (this.time != null) {
      clearTimeout(this.time);
    }
    if (this.ret != null) {
      clearTimeout(this.ret);
    }
    if (!this.funViewInited) {
      return;
    }
    view.hideTopBottom();
    if (!this.stopPlay) {
      this.pause(true);
    }
    if (playmode.cachePlayTime > playmode.startTime) {
      playmode.cachePlayTime = -1;
      return
    }
    if (this.cachePlayTime != -1) {
      this.currPlayTime = this.cachePlayTime;
    } else {
      this.currPlayTime = this.startTime;
      this.ret = setTimeout(function () {
        playmode.currPlayTime = -1;
      }, 1000);
    }
    if (this.currPlayTime < 0) {
      return;
    }
    this.currPlayTime = this.currPlayTime * 1 - 20000;
    if (this.currPlayTime < 0) {
      this.currPlayTime = 0;
    }
    this.cachePlayTime = this.currPlayTime;
    view.timescrollmove(this.currPlayTime, this.allTime);
    this.time = setTimeout(function () {
      player.seekTime({
        seekTime: playmode.currPlayTime
      });
      playmode.cachePlayTime = -1
      playmode.resume();
    }, 800)
  },
  playNext: function () {
    // player.stop();
    value.historyTimes = 0;
    console.log("切集前" + value.itemPlay)
    if (value.itemPlay >= value.list.length - 1) {
      value.itemPlay = 0;
      playRecord("0");
      // window.location.href = "./../detail/detail.html";
      player.stop();
      setTimeout(function () {
        prompt("yanhua://epg/exitProcess");
      }, 2000)
    } else {
      value.itemPlay = value.itemPlay * 1 + 1;
      playContent.init();
      console.log("切集后" + value.itemPlay);
      // value.play()
      backFirm.back();
      playIndex();
      document.getElementById('play_list').style.display = 'none';
      areaObj = playContent;
      // 播放
    }
  }
}
// 页面ui渲染
var view = {
  timer: null,
  hideTopBottom: function () {
    document.getElementById("play-top").style.cssText = 'display:block';
    document.getElementById("play-bottom").style.cssText = 'display:block'
    // 隐藏ui展示
    clearTimeout(view.timer);
    view.timer = setTimeout(function () {
      document.getElementById("play-top").style.cssText = 'display:none';
      document.getElementById("play-bottom").style.cssText = 'display:none'
    }, 7000)
  },
  moveShowBox: function (type) {
    if (type) {
      document.getElementById("moveTime").style.cssText = "display:block";
    } else {
      document.getElementById("moveTime").style.cssText = "display:none";
    }
    // clearTimeout(timer);
    // var timer = setTimeout(function () {
    //   document.getElementById("moveTime").style.cssText = "display:none";
    // }, 000)
  },
  hideBottomList: function () {
    document.getElementById('play_list').style.display = 'none';
    areaObj = playContent;
  },
  timeChange: function (startTime, allTime) {
    var progress = startTime / allTime;
    if (progress > 1) {
      progress = 1;
    }
    document.getElementById('allLongs').style.width = progress * 993 + 'px';
    document.getElementById('play_icon').style.left = (progress * 993) - 10 + 'px';
    document.getElementById('play_carsetime').innerHTML = playmode.getTimeFormat(startTime);
    document.getElementById('play_time').innerHTML = playmode.getTimeFormat(allTime);
  },
  timescrollmove: function (startTime, allTime) {
    var progress = startTime / allTime;
    if (progress > 1) {
      progress = 1;
    }
    document.getElementById('allLongs').style.width = progress * 993 + 'px';
    document.getElementById('play_icon').style.left = (progress * 993) - 10 + 'px';
    document.getElementById('moveTime').innerHTML = playmode.getTimeFormat(startTime);
    document.getElementById('play_time').innerHTML = playmode.getTimeFormat(allTime);
  }
}

window.homePress = function () {
  console.log('首页键位');
}

// 安卓获取信息回调
function registerLifecycleCallback(res) {
  console.log('获取硬件信息-----------registerLifecycleCallback')
  console.log(JSON.stringify(res))
  if (res.status == 3) {
    player.togglePlay('pause');
  }
  if (res.status == 4) {
    player.stop();
    prompt("yanhua://epg/exitProcess");
  } else if (res.status == 1 || res.status == 2) {
    player.togglePlay('resume');
  }
}

// 获取播放串等必要信息
function otherMessage(data) {
  console.log("获取BS传输信息：" + data);
  if (typeof data == 'string') {
    value.resJSON = JSON.parse(data);
  } else {
    value.resJSON = data;
  }
  getData(value.resJSON.DetailUrl);
  console.log("SessionID值：" + value.resJSON.SessionID);
  console.log("PlayIndex" + value.resJSON.PlayIndex);
  console.log("DetailUrl值：" + value.resJSON.DetailUrl);
  BlackWriteList();
}

// function getJson() {
//   value.GetPlayUrl = value.resJSON.cdnUrl;
//   // var playUrl = "tencent://sdk/playUrl?cid=dxd1v76tmu0wjuj&vid=d0029kxlbv2&clientId=999999999004&cdnUrl=" +
//   //   encodeURIComponent("http://115.233.200.171:39001/d0029kxlbv2/d0029kxlbv2.321004.ts.m3u8") + "&vuid=" +
//   //   value.vuId + "&vusession=" + value.tvsKey;
//   var playUrl = "tencent://sdk/playurl?cid=" + value.resJSON.cid + "&vid=" + value.resJSON.vid +
//     "&clientId=" + clientId +
//     "&cdnUrl=" + encodeURIComponent(value.resJSON.cdnUrl) +
//     "&vuid=" + value.vuId +
//     "&vusession=" + value.tvsKey;
//   console.log("准备播放的播放串：" + playUrl);
//   value.TxPaly(playUrl);
// }

//apk代请求
function getHttp(res) {
  console.log("apk代请求" + JSON.stringify(res));
  // var foreignId = value.detailData.itemList[value.itemPlay].vodList[0].playUrl;
  if (value.detailData.itemList[value.itemPlay].vodList[1]) {
    if (res.status == '200') {
      var url = "";
      if (res.playUrl) {
        url = "http" + res.playUrl.split('rtsp')[1];
      } else {
        // toast("无法获取播放地址，请稍后尝试！")
        toast('播放失败（111007），视频暂时无法观看，请稍后重试')
        return;
      }
      console.log("获取未加密cdnurl" + url);
      value.TxPaly(url);
    } else {
      toast('播放失败（111007），视频暂时无法观看，请稍后重试')
      return;
    }
  } else {
    console.log('加密');
    var usPlayUrl = value.detailData.itemList[value.itemPlay].vodList[0].playUrl;
    var play = {
      code: getParam("contentId", usPlayUrl),
      cid: getParam("cid", usPlayUrl),
      vid: getParam("vid", usPlayUrl)
    }
    var cid = play.cid;
    var vid = play.vid;
    if (res.status == '200') {
      if (res.playUrl) {
        var url = "http" + res.playUrl.split('http')[1];
      } else {
        toast('播放失败（111007），视频暂时无法观看，请稍后重试')
        return;
      }
      console.log("获取cdn播放信息" + JSON.stringify(res));
      var playUrl = "tencent://sdk/playurl?cid=" + cid + "&vid=" + vid +
        "&clientId=" + clientId +
        "&cdnUrl=" + encodeURIComponent(url) +
        "&vuid=" + value.vuId +
        "&vusession=" + value.tvsKey;
      console.log("准备播放的播放串：" + playUrl);
      value.TxPaly(playUrl);
    } else {
      toast('播放失败（111007），视频暂时无法观看，请稍后重试')
      return;
    }
  }
}

function playIndex() {
  // var UserGroupNMB = "gdhdpublictest";
  // index?：传入集数集数
  // value.itemPlay
  // indexSingle.itemNo
  // http://ip:port?contentId=YANHUA00000000070PITEM0007052605&cid=o0ytzgvq6o08e9o&vid=z0031s1ng8f
  console.log(value.detailData.itemList);
  console.log(value.itemPlay);
  var usPlayUrl = value.detailData.itemList[value.itemPlay].vodList[0].playUrl;
  if (value.detailData.itemList[value.itemPlay].vodList[1]) {
    console.log('非加密');
    var foreignId = value.detailData.itemList[value.itemPlay].vodList[1].playUrl;
  } else {
    console.log('加密');
    var play = {
      code: getParam("contentId", usPlayUrl),
      cid: getParam("cid", usPlayUrl),
      vid: getParam("vid", usPlayUrl)
    }
    console.log("播放子集url信息" + JSON.stringify(play));
    var foreignId = play.code;
  }
  console.log("播放子集url信息" + usPlayUrl)

  // gdhdpublictest
  // var url = value.resJSON.epgDomain + "/EPG/jsp/" + value.resJSON.UserGroupNMB + "/serviceProvider/chances/vod_playUrl_hw.jsp?foreignId=" + foreignId;
  var url = value.resJSON.epgDomain + "/EPG/jsp/" + value.resJSON.EPGGroupNMB + "/serviceProvider/chances/vod_playUrl_hw.jsp?foreignId=" + foreignId;
  // var url = value.resJSON.epgDomain + "/EPG/jsp/gdhdpublictest/serviceProvider/chances/vod_playUrl_hw.jsp?foreignId=" + foreignId;
  console.log("cdnUrl地址" + url);
  console.log("foreignId名字" + foreignId);
  var head = JSON.stringify({
    Cookie: "JSESSIONID=" + value.resJSON.SessionID
  })
  console.log(value.resJSON.SessionID);
  prompt("yanhua://epg/getHttp?return=getHttp&httpUrl=" + url + "&header=" + head);
}

function GetTxPlayVoucher(res) {
  var data = res;
  console.log(JSON.stringify(res));
  if (data.code == 200) {
    value.tvsKey = res.tvsKey;
    qeryHistory(playIndex);
  } else {
    value.BlackList++
    if (value.BlackList < 2) {
      BlackWriteList();
    } else {
      toast('播放失败（111005），视频暂时无法观看，请稍后重试' + JSON.stringify(res));
    }
  }
}

// // 通过接口获取信息
// function getotherMessage() {
//   var urls = DataUrl + "/zjdx/play/params?userId=" + clientId;
//   getYhSpecialList_nc(urls, function (data) {
//     console.log("存储：" + data);
//   }, function (error) {
//     console.log("存储失败" + error);
//   })
// }

// 接口播放串等必要信息
function userid(res) {
  console.log("用户id：" + JSON.stringify(res));
  var urls = DataUrl + "/zjdx/play/params?userId=" + res;
  console.log(urls);
  getYhSpecialList_nc(urls, function (data) {
    console.log("获取存储：" + JSON.stringify(data));
    value.resJSON = JSON.parse(decodeURIComponent(data));
    Cookies.set('SessionID', value.resJSON.SessionID, {
      path: '/'
    })
    clientId = value.resJSON.clientId;
    value.itemPlay = value.resJSON.PlayIndex;
    value.isOrder = value.resJSON.isOrder * 1;
    console.log("clientId值" + clientId);
    console.log("PlayIndex:" + value.itemPlay);
    console.log("SessionID值：" + value.resJSON.SessionID);
    console.log("DetailUrl值：" + value.resJSON.DetailUrl);
    console.log("isOrder值：" + value.isOrder);
    if (value.resJSON.DetailUrl) {
      getData(value.resJSON.DetailUrl);
    } else {
      console.log("从应用市场跳入")
      document.getElementsByClassName("debugBack")[0].style.display = "block";
      areaObj = firm;
      return
    }
  }, function (error) {
    console.log("获取存储失败1" + error);
  }, true)
}

var firm = {
  back: function () {
    prompt("yanhua://epg/exitProcess");
  }
}

value.getValue();
prompt('yanhua://epg/getData?return=userid&getKey=userid');
// prompt('yanhua://epg/getData?return=otherMessage&getKey=otherMessage');
// if (navigator.platform != "Win32" || navigator.platform != 'Windows') {
prompt('yanhua://epg/registerLifecycleCallback?return=registerLifecycleCallback');
// }

areaObj = loading; //初始焦点赋值
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
      // var backUrl = Cookies.get('backUrl')
      areaObj.back();
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
  }
};

document.onkeydown = grepEvent;