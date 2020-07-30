var upload = 1
// 获取黑白名单
var isZero = 2;
var AccessKey = '';
console.log('请求ums接口前');
var json = {
  "UserGroupNMB": getAuthenticationAttr("UserGroupNMB"),
  "EPGGroupNMB": getAuthenticationAttr("EPGGroupNMB"),
  "UserId": getAuthenticationAttr("UserID"),
  "Mac": getAuthenticationAttr("MAC"),
  "STBID": getAuthenticationAttr("STBID"),
  "IP": getAuthenticationAttr("IP"),
  "SessionID": getAuthenticationAttr("SessionID"),
  "UserToken": getAuthenticationAttr("UserToken"),
  "productCode": "701063"
}

try {
  console.log("是否安装apk" + STBAppManager.isAppInstalled('com.yanhua.tv.jiguang'));
  console.log("BS页面请求局方apk数据" + JSON.stringify(json));
} catch (err) {
  console.log(err)
}

// 第一次拉起apk时使用
function AAAuto() {
  // 3A认证
  var apkVersion = "1.0.001";
  var md5Sgin = {
    sign: hex_md5(json.UserId + "$$" + json.EPGGroupNMB + "$" + apkVersion + "$Ch@nces_2020")
  }
  console.log(JSON.stringify(md5Sgin));
  console.log("明文" + json.UserId + "$$" + json.EPGGroupNMB + "$" + apkVersion + "$Ch@nces_2020");
  var purl = "http://115.233.200.102:58006/aaa/Service/ApkLogin";
  // var url = preUrl + "/aaa/Service/ApkLogin"
  console.log("3a鉴权地址" + purl);
  var data = {
    userId: json.UserId,
    epgGroup: json.UserGroupNMB,
    apkName: "极光TV",
    apkVersion: apkVersion,
    deviceMac: "",
    ipAddress: "",
    deviceModel: ""
  }
  console.log(JSON.stringify(data));
  PostData(purl, JSON.stringify(data), md5Sgin, function (res) {
    console.log("3a认证" + JSON.stringify(res));
  }, function (error) {
    console.log("3a失败" + error)
  }, getAuthenticationAttr("STBType"))
}
// aaa鉴权
function AAAorder() {
  var purl = "http://115.233.200.94:58002/aaa/Service/QueryOrders";
  var STBType = getAuthenticationAttr("STBType");
  var md5Sgin = {
    sign: hex_md5(json.UserId + "$" + json.productCode + "$Ch@nces_2020")
  }
  var data = {
    userId: json.UserId,
    productCode: json.productCode,
  }
  PostData(purl, JSON.stringify(data), md5Sgin,
    function (res) {
      // toast("aaa鉴权:" + res.result);
      // {"result":"20002","message":"","orders":[]}
      console.log("aaa鉴权:" + JSON.stringify(res));
      if (res.result == "000") {
        console.log('存在订购');
        var startDate = res["orders"][0].startTime;
        var endDate = res["orders"][0].startTime;
        BlackWriteListPOST(startDate, endDate);
      } else if (res.result == "20002") {
        console.log('无订购');
        BlackWriteList();
      } else if (res.result == "20003") {
        console.log('订购未同步');
        if (Cookies.get('isOrder') == 0) {
          var startDate = res["orders"][0].startTime;
          var endDate = res["orders"][0].startTime;
          BlackWriteListPOST(startDate, endDate);
        } else {
          BlackWriteList();
        }
      }
      if (res.result == "000" || res.result == "20003") {
        value.isAAAOrder = true;
      } else {
        value.isAAAOrder = false;
      }
      upload = 0
    }, function (error) {
      console.log("aaa鉴权:" + error)
      BlackWriteList();
      upload = 0
      value.isAAAOrder = false;
    }, STBType)
  // 3a错误仍然渲染页面
  setTimeout(function () {
    if (upload == 1) {
      BlackWriteList();
      value.isAAAOrder = false;
      console.log('AAA无返回开始执行');
    }
  }, 1000)
}

//第一次下载极光apk
function SDKDownload() {
  console.log("是否订购：" + topContent.isPlay);
  if (!EpgSwitch) {
    // 支持白名单
    var pindex;
    if (value.detailData.layout == "Detail_Series") {
      pindex = indexSingle.itemNo;
    } else if (value.detailData.layout == "Detail_Movie") {
      pindex = 0
    } else if (value.detailData.layout == "Detail_News") {
      pindex = indexNews.itemNo;
    }
    if (!topContent.isPlay && !value.isAAAOrder && value.detailData.itemList[pindex].fee == 2) {
      // 提示页
      getId("textLogOrder").innerHTML = '您的极光TV服务遇到一些问题，正在飞速开通中，稍后请尝试重启机顶盒。如仍未解决，您可以拨打10000号咨询，由技术专家为您排除故障。'
      getId("isAAAOrders").style.display = 'block';
      try {
        var type = {
          page_id: "1080HDJTJGTS-0000",
          page_name: '1080高清极光AAA提示页',
          refer_pos_id: '',
          refer_pos_name: '',

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: Cookies.get('refer_page_name'),

          refer_type: '',
          refer_parent_id: '',

          mediacode: "",
          medianame: "",
          type: 0
        }
        setTimeout(function () {
          ZJDXlog.timeStart(type)
        }, 1000)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }
      return;
    }
  }
  if (STBAppManager.isAppInstalled('com.yanhua.tv.jiguang')) {
    console.log("非第一次极光apk");
    // jumpApk();
  } else {
    console.log("第一次下载极光apk");
    AAAuto();
    console.log("上报完成");
  }
  IpApk();
}

function IpApk() {
  var id = hex_md5(json.UserId + "2019itv").toUpperCase();
  console.log("加密id" + id)
  var url = DataUrl + "/zjdx/play/clear?userId=" + id;
  console.log(url);
  getYhSpecialList_nc(url, function (data) {
    console.log("清理：" + JSON.stringify(data));
    setJson();
  }, function (error) {
    console.log("清理成功" + JSON.stringify(error));
    setJson();
  }, true)
}

//计算版本号大小,转化大小
function toNum(a) {
  var a = a.toString();
  var c = a.split('.');
  var num_place = ["", "0", "00", "000", "0000"], r = num_place.reverse();
  for (var i = 0; i < c.length; i++) {
    var len = c[i].length;
    c[i] = r[len] + c[i];
  }
  var res = c.join('');
  return res;
}

// 设置参数
function setJson() {
  var id = hex_md5(json.UserId + "2019itv").toUpperCase();
  console.log("加密id" + id)
  var epgDomain = getAuthenticationAttr("EPGDomain");
  var fix = "/EPG/jsp";
  var preUrl = epgDomain.substring(0, epgDomain.indexOf(fix));
  var pindex;
  if (value.detailData.layout == "Detail_Series") {
    pindex = indexSingle.itemNo;
  } else if (value.detailData.layout == "Detail_Movie") {
    pindex = 0
  } else if (value.detailData.layout == "Detail_News") {
    pindex = indexNews.itemNo;
  }
  var content = encodeURIComponent(JSON.stringify({
    SessionID: getAuthenticationAttr("SessionID"),
    DetailUrl: value.detailUrl,
    UserGroupNMB: getAuthenticationAttr("UserGroupNMB"),
    EPGGroupNMB: getAuthenticationAttr("EPGGroupNMB"),
    epgDomain: preUrl,
    clientId: json.UserId,
    PlayIndex: pindex,
    isOrder: playConfig.isOrder,
    refer_page_id: Cookies.get("refer_page_id"),
    refer_type: Cookies.get('refer_type'),
    refer_page_name: Cookies.get('refer_page_name'),
    siteId: value.siteId
  }))
  var urls = DataUrl + "/zjdx/play/params?userId=" + id + "&content=" + content;
  console.log(urls);
  getYhSpecialList_nc(urls, function (data) {
    console.log("存储：" + data);
    var version = STBAppManager.getAppVersion("com.toltech.appstore");
    var a = toNum(version);
    var b = toNum("2.3.6");
    var c = toNum("2.3.1");
    if (a >= b) {
      console.log("版本号相同！版本号为:" + a);
      setTimeout(function () {
        STBAppManager.startAppByIntent("{\"intentType\":0,\"appName\":\"com.toltech.appstore\", \"className\":\"com.toltech.appstore.activity.DetailActivity\", \"extra\":[{\"name\":\"ids\",\"value\":\"1049\"}]}");
      }, 1000)
    } else if (a >= c && a < b) {
      console.log("版本号不同！版本号为:" + a);
      setTimeout(function () {
        STBAppManager.startAppByIntent("{\"intentType\":0,\"appName\":\"com.toltech.appstore\", \"className\":\"com.toltech.appstore.activity.MainActivity\", \"extra\":[{\"name\":\"ids\",\"value\":\"1049\"}]}");
      }, 1000)
    } else if (a < c) {
      // toast("应用市场版本过低,请联系客服升级版本" + version);
      getId("textLogOrder").innerHTML = '您的应用市场版本过低，暂不支持本应用服务，建议您升级机顶盒。您可以拨打10000号咨询，或前往附近营业厅办理。'
      getId("isAAAOrders").style.display = 'block';
      try {
        var type = {
          page_id: "1080HDJTJGTS-0001",
          page_name: '1080高清极光应用市场提示页',
          refer_pos_id: '',
          refer_pos_name: '',

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: Cookies.get('refer_page_name'),

          refer_type: '',
          refer_parent_id: '',

          mediacode: "",
          medianame: "",
          type: 0
        }
        setTimeout(function () {
          ZJDXlog.timeStart(type)
        }, 1000)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }
      // window.location.href = "http://10.255.247.105/web/wisdom_family/appstore_test.jsp?epg_info=true&backUrl=" + encodeURIComponent(window.location.href);
      return
    }
  }, function (error) {
    console.log("存储失败" + error);
  }, true)
}

// 跳转播放apk
function jumpApk() {
  // http://ip:port/EPG/jsp/gdhdpublic/serviceProvider/chances/vod_playUrl_hw.jsp
  // 播放请求地址
  // var UserGroupNMB = "gdhdpublictest";
  var play = {
    code: "YANHUA00000000070PITEM0006021403",
    cid: "062sys61xfojod4",
    vid: "n0022q6isbf"
  }
  var UserGroupNMB = getAuthenticationAttr("UserGroupNMB");
  // var epgDomain = "http://220.191.136.42:33200/EPG/jsp/gdhdpublic/en/Category.jsp";
  var epgDomain = getAuthenticationAttr("EPGDomain");
  var fix = "/EPG/jsp";
  var foreignId = play.code;
  var preUrl = epgDomain.substring(0, epgDomain.indexOf(fix));
  var url = preUrl + "/EPG/jsp/" + UserGroupNMB + "/serviceProvider/chances/vod_playUrl_hw.jsp?foreignId=" + foreignId;
  console.log("cdnUrl地址" + url);
  console.log("foreignId名字" + foreignId);
  getYhSpecialList_nc(url, function (data) {
    var res = JSON.parse(data);
    console.log(data);
    if (res.status == '200') {
      if (res.playUrl == "" || res.playUrl == undefined) {
        return;
      }
      var url = "http" + res.playUrl.split('http')[1];
      var json = {
        cdnUrl: url,
        clientId: json.UserId,
        spCode: "1008",
        vid: play.vid,
        cid: play.cid,
        SessionID: getAuthenticationAttr("SessionID"),
        DetailUrl: value.detailUrl
      }
      value.playUrl = encodeURIComponent(JSON.stringify(json))
    }
    console.log("获取cdn播放信息" + JSON.stringify(res));
    var id = '123'; //预留
    var pageUrl = baseUrl + "/auroratv/source/video/player.html"; //跳转地址
    var appName = 'com.yanhua.tv.jiguang'; //包名
    var className = 'com.yanhua.tv.yhweb.Dispatcher'; //类名
    console.log('调用传送apkurl:' + JSON.stringify(json));
    STBAppManager.startAppByIntent(
      "{\"intentType\":0,\"appName\":\"" + appName +
      "\", \"className\":\"" + className +
      "\", \"extra\":[{\"name\":\"ITV_ACCOUNT\",\"value\":\"" + id +
      "\"},{\"name\":\"otherMessage\",\"value\":\"" + value.playUrl +
      "\"},{\"name\":\"page_url\",\"value\":\"" + pageUrl + "\"}]}");
  },
    function (error) {
      console.log(JSON.stringify(error))
    }, true)

}

function BlackWriteList() {
  // 白名单正式代理环境
  var clientId = json.UserId; //用户id
  // var clientId = "999999999004";
  var spCode = "1008"; //运营商代
  console.log("用户id:" + clientId);
  var url = blackUrl + "/ums/vui?s=1&v=2&clientId=" + clientId + "&spCode=" + spCode;
  console.log(url);
  getYhSpecialList_nc(url, function (datas) {
    console.log('黑白名单:' + datas);
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
      Cookies.set('userToken', data.data.token.userToken, {
        path: '/'
      })
      Cookies.set('vtoken', data.data.vtoken, {
        path: '/'
      })
      console.log("vtoken值：" + data.data.vtoken);
    }
    isZero = Cookies.get('specialType');
    uploadDom()
  }, function (error) {
    console.log(error);
    var foreignId = value.detailData.assetCode;
    uploadDom()
  }, true)
}

function BlackWriteListPOST(startDate, endDate) {
  console.log("开始时间" + startDate)
  console.log("结束时间" + endDate)
  // 白名单正式代理环境
  var clientId = json.UserId; //用户id
  // var clientId = "999999999004";
  var spCode = "1008"; //运营商代
  console.log("用户id:" + clientId);
  var url = blackUrl + "/ums/vui?s=1&v=2&clientId=" + clientId + "&spCode=" + spCode;
  var equities = {
    "equities": [{
      productId: json.productCode,
      startDate: startDate,
      endDate: endDate
    }]
  }
  console.log("黑白名单上传信息" + JSON.stringify(equities));
  getYhSpecialSC(url, JSON.stringify(equities), function (datas) {
    console.log('黑白名单POST:' + datas);
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
      Cookies.set('userToken', data.data.token.userToken, {
        path: '/'
      })
      Cookies.set('vtoken', data.data.vtoken, {
        path: '/'
      })
      console.log("vtoken值：" + data.data.vtoken);
      // var foreignId = value.detailData.assetCode;
      // userPower(uploadDom, foreignId)
      uploadDom()
    }
  }, function (error) {
    console.log(error);
    uploadDom()
  })
  isZero = Cookies.get('specialType');
}

// 播放信息value
var value = {
  isAAAOrder: false,
  detailData: {},
  isBack: false,
  detailUrl: "",
  blackJson: {},
  TxUserToken: '',
  vuId: '',
  playUrl: "",
  list: null, //详情页集数
  number: 0, //当前播放的集数
  code: "", //预留埋点信息
  msg: "",
  name: "",
  backType: 0,
  historytime: {
    time: 0,
    id: 0,
    index: 0
  },
  indexSingleLeft: 530, //单集滑块距离左边距离(为了适配盒子)
  indexSingWidth: 111, //单集滑动距离
  indexNewsleLeft: 448, //单集滑块距离左边距离(为了适配盒子)
  indexNewsWidth: 267, //单集滑动距离
  component: ["topContent", "indexSingle", "indexNews", "indexTotal", "assetList"],
  // "specialList",
  componentNumber: 0, //组件焦点数
  siteId: "1001",
  getValue: function () {
    this.detailUrl = Cookies.get('detailUrl');
    if (this.detailUrl == null || this.detailUrl == '' || getParam('assetId')) {
      var backObj = getParam('assetId');
      this.backType = decodeURIComponent(getParam('epg_info').split("page_url")[1]).slice(1);
      this.backType = this.backType.substring(0, this.backType.length - 2);
      console.log(backObj);
      if (backObj) {
        Cookies.set("backUrl", "第三方退出", {
          path: '/'
        })
        this.detailUrl = baseUrl + "p=yhAssetDetail&k=1&v=2&assetId=" + backObj + "&c=10"
        Cookies.set('detailUrl', this.detailUrl, {
          path: '/'
        })
        console.log(this.detailUrl);
        try {
          bi.start('0201', null, backObj, "31");
        } catch (error) { }
      }
    }
    getData(value.detailUrl);
  },
  removeArray: function (value) {
    var index = this.component.indexOf(value);
    if (index > -1) {
      this.component.splice(index, 1);
    }
  }
}

// 获取详情页信息
var getData = function (url) {
  console.warn("详情页" + url + "&assetRec=0");
  $.ajax({
    type: "GET",
    url: url + '&returnType=jsonp',
    // &assetRec=0
    dataType: "jsonp",
    timeout: 5000,
    jsonpCallback: 'jsonpCallback',
    success: function (response) {
      value.detailData = response.data;
      console.warn(value.detailData);
      value.list = value.detailData.itemList;
      if (!value.detailData) { //资产下线/不存在，返回
        getId('toast2').style.display = 'block';
        getId('box-wrap').style.display = 'none';
        var urls = historylUrl + '/del?version=1';
        var collectType = '1'; //收藏类型(0-主播,1-资产,2-专题)
        var relateId = getParam('assetId', url);
        var dataList = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
        //  下线删除收藏
        getYhSpecialSC(urls, dataList);
        //  下线删除历史
        var dataList2 = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + 3 + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
        getYhSpecialSC(urls, dataList2);
        setTimeout(function () {
          Cookies.set('pos_id', '', {
            path: '/'
          })
          Cookies.set('recmd_id', '', {
            path: '/'
          })
          if (value.timers != null) {
            clearInterval(value.timers);
          }
          exit();
          // var backUrl = Cookies.get('backUrl') || '../../index.html';
          // if (backUrl == '第三方退出') {
          //   try {
          //     Cookies.set('detailUrl', '', {
          //       path: '/'
          //     });
          //     prompt("yanhua://epg/exit")
          //   } catch (e) {
          //     console.log(e)
          //   }
          // } else {
          //   window.location.href = backUrl;
          // }
        }, 3000)
        return;
      }

      if (navigator.appVersion.indexOf("Windows") == -1) {
        var foreignId = value.detailData.assetCode;
        userPower(AAAorder, foreignId);
      } else {
        uploadDom()
      }
      // "YANHUA00000000070PITEM0006021403"
      // 渲染详情页ui
    },
    fail: function (error) {
      toast("网络请求失败" + url);
      getId('toast2').style.display = 'block';
      getId('box-wrap').style.display = 'none';
      exit();
    },
    complete: function (XHR, TextStatus) {
      if (TextStatus == 'timeout') { //超时执行的程序
        console.log("请求超时！");
        toast("网络请求超时" + url);
      }
    }
  })
  // var type = {
  //   mediacode: getParam("contentId", value.detailData.itemList[0].vodList[0].playUrl),
  //   mediaduration: "0",
  //   seriescode: "0",
  //   seriesflag: '0',
  //   start_Time: Cookies.get('qb_datetime').toString(),
  //   currentplaytime: "1", // 当前播放时间
  //   refer_type: '0',//refer_type,
  //   refer_page_id: '0',//refer_page_id,
  //   refer_page_name: '0', //refer_page_name,
  //   refer_pos_id: '0',//refer_pos_id,
  //   refer_pos_name: '0',//refer_pos_name,
  //   refer_mediacode: '0',//refer_mediacode,
  //   refer_parent_id: '0',//refer_parent_id
  //   type: "1"
}

// 详情页渲染
function uploadDom() {
  areaObj = topContent; //初始焦点赋值
  playConfig.isOrder = Cookies.get('isOrder');
  console.log("订购：" + playConfig.isOrder);
  if (playConfig.isOrder == 0 || Cookies.get('specialType') == 0) {
    topContent.isPlay = true;
  }
  console.log("黑白名单：" + Cookies.get('specialType'))
  console.log("订购：" + topContent.isPlay);
  qeryHistory();
  if (value.detailData.layout == "Detail_Series") {
    indexSingle.init();
    indexTotal.init();
    value.removeArray('indexNews');
    value.name = "电视剧"
    // 删除组件indexNews
  } else if (value.detailData.layout == "Detail_Movie") {
    getId('btnBox-2').style.display = 'block';
    getId('itemList').style.display = 'none';
    value.removeArray('indexSingle');
    value.removeArray('indexTotal');
    value.removeArray('indexNews');
    value.name = '电影'
    // 删除组件indexNews indexTotal indexNews
  } else if (value.detailData.layout == "Detail_News") {
    value.removeArray('indexSingle');
    indexNews.init();
    indexTotal.init();
    value.name = '综艺'
  }
  // 浙江电信电影页面浏览
  try {
    var type = {
      page_id: '1080HDJTJGDYDetail' + value.detailData.assetType + "-0000",
      page_name: '1080高清极光详情页' + value.name,
      refer_pos_id: '',
      refer_pos_name: '',

      refer_page_id: Cookies.get('refer_page_id'),
      refer_page_name: Cookies.get('refer_page_name'),

      refer_type: '',
      refer_parent_id: '',

      mediacode: value.detailData.assetCode,
      medianame: value.detailData.assetName,
      type: 0
    }
    Cookies.set("refer_page_id", type.page_id, {
      path: '/'
    });
    Cookies.set("refer_page_name", type.page_name, {
      path: '/'
    });
    Cookies.set("refer_type", type.refer_type, {
      path: '/'
    });
    setTimeout(function () {
      ZJDXlog.timeStart(type)
    }, 1000)
  } catch (error) {
    console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
  }
  // specialList.init();
  assetList.init();
  topContent.init();
  descriptionBox.init();
  collectData();
  // if (topContent.isPlay || indexSingle.indexPlay == 0) {
  //   //计费限免
  //   // topContent.play(value.historytime);
  // }
  // 订购上报
  if (Cookies.get("firstOrder") == "点击订购" && playConfig.isOrder == 0) {
    try {
      var params = {
        pkg_type: '2',
        pkg_id: json.productCode,
        order_msg: '1',
        parent_page_id: Cookies.get("orderPkg"),
        parent_page_type: '0301',
        point: '1',
        point_id: value.detailData.assetId
      }
      bi.order(params)
    } catch (error) {
      console.log('埋点错误', error)
    }
    Cookies.set("firstOrder", "", {
      path: '/'
    })
  }
  // 页面访问上报
  var jsonOb = {}
  try {
    var jump = Cookies.get('jump')
    jump = JSON.parse(jump)

    jsonOb.page_type = '0301'
    jsonOb.page_id = value.detailData.assetId
    jsonOb.parent_page_type = jump.parent_page_type ? jump.parent_page_type : ""
    jsonOb.parent_page_id = jump.parent_page_id ? jump.parent_page_id : ""
    bi.jump(jsonOb)
    Cookies.set('jump', '', {
      path: '/'
    })
  } catch (error) {
    jsonOb.page_type = '0301'
    jsonOb.page_id = value.detailData.assetId
    jsonOb.parent_page_type = ""
    jsonOb.parent_page_id = ""
    bi.jump(jsonOb)
    Cookies.set('jump', '', {
      path: '/'
    })
    console.log('埋点错误', error)
  }
}

// 查询执行焦点
function focused(val) {
  if (val == 'down') {
    value.componentNumber++
  } else if (val == 'up') {
    value.componentNumber--
  } else if (typeof val == 'number') {
    value.componentNumber = val
  }
  var code = value.component[value.componentNumber];
  var codePyte
  switch (code) {
    case "topContent": //顶部
      codePyte = topContent
      break;
    case "indexSingle": //上选集
      codePyte = indexSingle
      break;
    case "indexTotal": //下选集
      codePyte = indexTotal
      break;
    case "specialList": //专题
      codePyte = specialList
      break;
    case "assetList": //推荐
      codePyte = assetList
      break;
    case "indexNews": //推荐
      codePyte = indexNews
      break;
  }
  areaObj = codePyte;
  codePyte.addCss(true)
}

//防报错
function getAuthenticationAttr(name) {
  if ((typeof Authentication) != "undefined") {
    return Authentication.CTCGetConfig(name);
  } else {
    return "---";
  }
}

//键盘监听事件
// 播放
// if (navigator.platform != "Win32" || navigator.platform != 'Windows') {
//   prompt('yanhua://epg/registerLifecycleCallback?return=registerLifecycleCallback');
//   prompt('yanhua://epg/deviceInfo?return=deviceInfo');
// } else {
// console.log("调试")
// }
value.getValue();

var topContent = {
  btnNum: -1, //按钮编号
  isCollect: false, //收藏判断
  element: null, //dom操作元素
  curPlayTime: 0,
  isPlay: false, //是否订购
  timers: null,
  init: function () { //初步渲染
    getId('btnBox-3').getElementsByTagName('img')[0].src = value.detailData.assetImg;
    getId("name").innerHTML = '<span class="header-name">' + value.detailData.assetName + '</span>'
    if (value.detailData.assetName.length > 19) {
      indexNews.marquee("add", "name");
    }
    var titles
    if (value.detailData.tags.split(",").length > 6) {
      titles = value.detailData.tags.split(",")[0] + "," + value.detailData.tags.split(",")[1] + "," + value.detailData.tags.split(",")[2] + "," + value.detailData.tags.split(",")[3]
    } else {
      titles = value.detailData.tags;
    }
    if (value.detailData.language == "") {
      getId("info").innerHTML = value.detailData.area + " | " + value.detailData.year + "|" + titles
    } else {
      getId("info").innerHTML = value.detailData.area + " | " + value.detailData.language + " | " + value.detailData.year + "|" + titles
    }
    getId("actor").innerHTML = value.detailData.description;
    if (value.detailData.layout == "Detail_Movie") {
      // 电影综艺
      addClass(getId("btnBox-1"), 'change');
      addClass(getId("btnBox-3"), 'change');
      // getId("btnBox").getElementsByTagName("div").
      getId("btnBox").getElementsByTagName("div")[0].style.width = "146px"
      getId("btnBox").getElementsByTagName("div")[2].style.width = "146px"
      getId("btnBox").getElementsByTagName("div")[2].style.left = "160px"
      getId("btnBox").getElementsByTagName("div")[1].getElementsByTagName("span")[0].style.left = "100px";
      getId("btnBox").getElementsByTagName("div")[2].getElementsByTagName("span")[0].style.left = "100px";
      addClass(getId("btnBox0"), 'textchange');
      getId('btnBox').style.top = '360px';
      getId('btnBox').style.left = '906px';
    } else {
      //电视剧

    }
    if (topContent.isPlay) {
      console.log("订购成功");
      // value.componentNumber = 1;
      addClass(getId("btnBox-1"), 'none');
      if (value.detailData.layout == "Detail_Movie") {
        this.btnNum = -2;
        // 电影
        addClass(getId("btnBox-1"), 'change');
        addClass(getId("btnBox-3"), 'change');
        removeClass(getId("btnBox0"), 'textchange');
        getId("btnBox").getElementsByTagName("div")[0].style.width = "276px"
        getId("btnBox").getElementsByTagName("div")[1].style.width = "276px"
        getId("btnBox").getElementsByTagName("div")[2].style.width = "276px"
        getId("btnBox").getElementsByTagName("div")[2].style.left = "300px"
        getId("btnBox").getElementsByTagName("div")[0].style.left = "-300px"
        getId("btnBox").getElementsByTagName("div")[1].getElementsByTagName("span")[0].style.left = "220px"
        getId("btnBox").getElementsByTagName("div")[0].getElementsByTagName("p")[1].style.left = "220px"
        getId("btnBox").getElementsByTagName("div")[2].getElementsByTagName("span")[0].style.left = "220px"
        getId('btnBox').style.top = '360px';
        getId('btnBox').style.left = '650px';
        addClass(getId("btnBox" + topContent.btnNum), 'active'); //初始化添加样式
      } else {
        //电视剧
        // 妙笔巧用精准定位焦点
        this.btnNum = 0;
        getId("btnBox").getElementsByTagName("div")[2].style.left = "300px"
        getId("btnBox").getElementsByTagName("div")[1].style.width = "276px"
        getId("btnBox").getElementsByTagName("div")[2].style.width = "276px"
        getId("btnBox").getElementsByTagName("div")[2].getElementsByTagName("span")[0].style.left = "220px"
        getId("btnBox").getElementsByTagName("div")[1].getElementsByTagName("span")[0].style.left = "220px"
        getId('btnBox').style.left = '356px';
        focused(1);
      }
    } else {
      if (value.detailData.layout == "Detail_Movie" && value.detailData.itemList[0].fee == 1) {
        addClass(getId("btnBox-1"), 'none');
        this.btnNum = -2;
        // 电影
        addClass(getId("btnBox-1"), 'change');
        addClass(getId("btnBox-3"), 'change');
        removeClass(getId("btnBox0"), 'textchange');
        getId("btnBox").getElementsByTagName("div")[0].style.width = "276px"
        getId("btnBox").getElementsByTagName("div")[1].style.width = "276px"
        getId("btnBox").getElementsByTagName("div")[2].style.width = "276px"
        getId("btnBox").getElementsByTagName("div")[2].style.left = "300px"
        getId("btnBox").getElementsByTagName("div")[0].style.left = "-300px"
        getId("btnBox").getElementsByTagName("div")[1].getElementsByTagName("span")[0].style.left = "220px"
        getId("btnBox").getElementsByTagName("div")[0].getElementsByTagName("p")[1].style.left = "220px"
        getId("btnBox").getElementsByTagName("div")[2].getElementsByTagName("span")[0].style.left = "220px"
        getId('btnBox').style.top = '360px';
        getId('btnBox').style.left = '650px';
        addClass(getId("btnBox" + topContent.btnNum), 'active'); //初始化添加样式
      } else {
        addClass(getId("btnBox-1"), 'active');
      }
    }
  },
  up: function () {
    // removeClass(getId("btnBox" + topContent.btnNum), 'active');
    // this.btnNum = -1;
    // addClass(getId("btnBox" + topContent.btnNum), 'active');
  },
  down: function () {
    this.removeCss()
    // if (value.detailData.layout == "Detail_Movie" & this.btnNum == -1) {
    //   this.btnNum = -2
    //   this.addCss()
    // } else {
    focused('down')
    // }
  },
  addCss: function () {
    addClass(getId("btnBox" + topContent.btnNum), 'active');
    getScrollbottom('#btnBox' + topContent.btnNum);
  },
  removeCss: function () {
    removeClass(getId("btnBox" + topContent.btnNum), 'active');
    getScrollbottom('#btnBox' + topContent.btnNum);
  },
  left: function () {
    if (this.btnNum == -1) {
      return
    }
    if (value.detailData.layout == "Detail_Movie") {
      if (topContent.isPlay && this.btnNum == -2) { return }
      removeClass(getId("btnBox" + topContent.btnNum), 'active');
      if (this.btnNum == 0) {
        this.btnNum = -2;
      } else if (this.btnNum == -2) {
        this.btnNum = -1;
      } else {
        this.btnNum--;
      }
      addClass(getId("btnBox" + topContent.btnNum), 'active');
    } else {
      if (topContent.isPlay && this.btnNum == 0) { return }
      if (this.btnNum < 0) return;
      removeClass(getId("btnBox" + topContent.btnNum), 'active')
      this.btnNum--;
      addClass(getId("btnBox" + topContent.btnNum), 'active');
    }

  },
  right: function () {
    if (this.btnNum >= 1) return
    // if (playConfig.isOrder == 0 || isZero != 2) {
    //   if (this.btnNum > 0) return
    // } else {
    //   if (this.btnNum > 1) return
    // }
    if (value.detailData.layout == "Detail_Movie") {
      removeClass(getId("btnBox" + topContent.btnNum), 'active')
      if (this.btnNum == -2) {
        this.btnNum = 0;
      } else if (this.btnNum == -1) {
        this.btnNum = -2;
      } else {
        this.btnNum++;
      }
      addClass(getId("btnBox" + topContent.btnNum), 'active')
    } else {
      removeClass(getId("btnBox" + topContent.btnNum), 'active')
      this.btnNum++
      addClass(getId("btnBox" + topContent.btnNum), 'active')
    }

  },
  enter: function () {
    if (this.btnNum == -2) {
      Cookies.set('detailUrl', value.detailUrl, {
        path: '/'
      })
      try {
        // value.detailData
        if (value.detailData.itemList[indexSingle.itemNo].fee == 1) {
          // 试看第一集
          console.log('试看第一集');
          try {
            var jsonob = {}
            jsonob.asset_id = value.detailData.assetId;
            jsonob.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
            jsonob.qb_datetime = Cookies.get('qb_datetime')
            jsonob.zb_datetime = (new Date()).valueOf()
            jsonob.time = jsonob.zb_datetime - jsonob.qb_datetime
            jsonob.ep = value.detailData.episodes
            jsonob.fee = '1'
            jsonob.isFullScreen = '1'
            jsonob.pos_id = Cookies.get('pos_id')
            jsonob.recmd_id = Cookies.get('recmd_id')
            jsonob.parent_page_type = '0301'
            jsonob.parent_page_id = value.detailData.assetId
            if (indexSingle.itemNo > 0) {
              jsonob.fee = '2'
            }
            bi.vod(jsonob)
          } catch (e) {
            console.log('错误信息' + e)
          }
          Cookies.set('qb_datetime', (new Date()).valueOf(), {
            path: '/'
          })
          SDKDownload();
          //播放判断
          return
        }
        if (!topContent.isPlay) {
          console.log("禁止播放")
          if (isZero == 1) {
            //黑名单
            toast("您的账号存在异常，请联系客服！");
            return
          }
          try {
            var param = {
              page_id: value.detailData.assetId,
              page_type: '0301'
            }
            bi.orderClick(param)
            Cookies.set('orderPkg', value.detailData.assetId, {
              path: '/'
            })
          } catch (error) {
            console.log('埋点错误', error)
          }
          var contentType = encodeURIComponent({
            page_id: '1080HDJTJGDYDetail' + value.detailData.assetType + "-0000",
            page_name: '1080高清极光详情页' + value.name
          })
          var OrderbackUrl = encodeURIComponent(window.location.href);
          window.location.href = 'http://115.233.200.60:58000/epg/entry/order.epg?siteCode=hdvod&bizCode=tx_hd_order&productId=701063&backUrl=' +
            OrderbackUrl + '&userId=' +
            json.UserId + "&contentCode=" +
            value.detailData.assetCode + "&contentType=" + contentType;
          return
        }
        SDKDownload();
      } catch (error) {

      }
    } else if (this.btnNum == -1) {
      // player.stop();
      try {
        var param = {
          page_id: value.detailData.assetId,
          page_type: '0301'
        }
        bi.orderClick(param)
        Cookies.set('orderPkg', value.detailData.assetId, {
          path: '/'
        })
      } catch (error) {
        console.log('埋点错误', error)
      }
      var contentType = encodeURIComponent({
        page_id: '1080HDJTJGDYDetail' + value.detailData.assetType + "-0000",
        page_name: '1080高清极光详情页' + value.name
      })
      var OrderbackUrl = encodeURIComponent(window.location.href);
      window.location.href = 'http://115.233.200.60:58000/epg/entry/order.epg?siteCode=hdvod&bizCode=tx_hd_order&productId=701063&backUrl=' +
        OrderbackUrl + '&userId=' +
        json.UserId + "&contentCode=" +
        value.detailData.assetCode + "&contentType=" + contentType;

      // 订购
    } else if (this.btnNum == 0) {
      getId('descriptionBox').style.visibility = "visible";
      areaObj = descriptionBox;
      return
    } else if (this.btnNum == 1) {
      if (topContent.isCollect) { //已收藏
        var collectType = '1'; //收藏类型(0-主播,1-资产,2-专题)
        var relateId = value.detailData.assetId;
        var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + '}';
        removeFav(data, function (rep) {
          if (rep.indexOf('success') !== -1) {
            topContent.isCollect = false;
            getId('collectWord').innerText = "收藏";
            getId('btnBox1').className = 'noCollect active'
            console.log('删除收藏');
          } else {
            console.log('删除收藏失败');
          }
        })
        // 取消收藏时上报
        console.log('取消收藏资产时上报')
        try {
          var jsonOb = {}
          jsonOb.cid = value.detailData.assetId
          jsonOb.click_type = '1'
          jsonOb.collect = '2'
          bi.collection(jsonOb)
        } catch (e) {
          console.log('错误信息' + e)
        }
      } else { //未收藏
        var collectType = '1'; //收藏类型(0-主播,1-资产,2-专题)
        var relateId = value.detailData.assetId;
        var relateTitle = value.detailData.assetName;
        var relateImg = value.detailData.assetImg;
        var relateUrl = value.detailUrl;
        var relateLayout = value.detailData.layout;
        var relateScore = value.detailData.score == undefined ? '' : value.detailData.score;
        if (value.detailData.score && value.detailData.score.length == 1) {
          relateScore += '0'
        }
        var data = '{"siteId":' + '"' + yh.siteId + '"' + ',"userId":' + '"' + yh.userId + '"' + ',"collectType":' + '"' + collectType + '"' + ',"relateId":' + '"' + relateId + '"' + ',"relateTitle":' + '"' + relateTitle + '"' + ',"relateImg":' + '"' + relateImg + '"' + ',"relateUrl":' + '"' + relateUrl + '"' + ',"relateLayout":' + '"' + relateLayout + '"' + ',"relateScore":' + '"' + relateScore + '"' + '}';
        addFav(data, function (rsp) {
          if (rsp.indexOf('success') !== -1) {
            topContent.isCollect = true;
            getId('collectWord').innerText = "已收藏"
            getId('btnBox1').className = 'noCollect active isCollect'
            console.log('添加收藏')
          } else {
            console.log('添加收藏失败')
          }
        });

        // 收藏时上报	
        console.log('收藏资产时上报')
        try {
          var jsonOb = {}
          jsonOb.cid = value.detailData.assetId
          jsonOb.click_type = '1'
          jsonOb.collect = '1'
          bi.collection(jsonOb)
        } catch (e) {
          console.log('错误信息' + e)
        }
      }
    }
  }
}

var indexSingle = {
  data: {},
  element: null,
  itemNo: 0,
  indexPlay: 0,
  init: function () {
    this.data = value.detailData.itemList;
    this.element = getId('slider1');
    var html = '';
    for (var i = 0; i < this.data.length; i++) {
      if (value.detailData.itemList[i].fee == "2" && topContent.isPlay == false) {
        var div = '<div class="buttomNum" id="buttomNum' + i + '">' + (i + 1) + '<img src="./../public/images/detail/vip.png" alt=""></div>';
      } else {
        var div = '<div class="buttomNum" id="buttomNum' + i + '">' + (i + 1) + '</div>';
      }
      html += div;
    };
    this.element.innerHTML = html;
  },
  removeCss: function () {
    var length = this.data.length;
    for (var i = 0; i < length; i++) {
      removeClass(getId("buttomNum" + i), 'active')
    };
  },
  addCss: function () {
    addClass(getId("buttomNum" + indexSingle.itemNo), 'active');
    getScrollbottom("#buttomNum" + indexSingle.itemNo);
    indexSingle.uploadIndexPay();
    this.element.style.left = value.indexSingleLeft + -value.indexSingWidth * this.itemNo + 'px'; //单集按钮滚动
    if (this.itemNo > 0 && this.itemNo % 10 === 0 || (this.itemNo + 1) % 10 === 0) { //单集跳转10的倍数，触发总集数滚动
      indexTotal.itemNo = Math.floor(this.itemNo / 10)
      indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
    }
  },
  uploadIndexPay: function () {
    var length = this.data.length;
    for (var i = 0; i < length; i++) {
      removeClass(getId("buttomNum" + i), 'select');
    };
    addClass(getId("buttomNum" + indexSingle.indexPlay), 'select');
  },
  initPayActive: function () {
    this.itemNo = this.indexPlay;
    this.element.style.left = value.indexSingleLeft + -value.indexSingWidth * this.indexPlay + 'px'; //单集按钮滚动
    if (this.itemNo > 0 && this.itemNo % 10 === 0 || (this.itemNo + 1) % 10 === 0) { //单集跳转10的倍数，触发总集数滚动
      indexTotal.itemNo = Math.floor(this.itemNo / 10)
      indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
    }
    removeClass(getId("buttomNum" + indexSingle.itemNo), 'active')
  },
  up: function () {
    indexSingle.removeCss();
    focused('up')
  },
  down: function () {
    this.removeCss();
    focused('down')
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo === this.data.length - 1) return;
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  enter: function () {
    this.indexPlay = this.itemNo;
    this.addCss();
    if (value.detailData.itemList[indexSingle.itemNo].fee == "1") {
      // 试看第一集
      console.log('试看');
      try {
        var jsonob = {};
        jsonob.asset_id = value.detailData.assetId;
        jsonob.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
        jsonob.qb_datetime = Cookies.get('qb_datetime')
        jsonob.zb_datetime = (new Date()).valueOf()
        jsonob.time = jsonob.zb_datetime - jsonob.qb_datetime
        jsonob.ep = value.detailData.episodes
        jsonob.fee = '1'
        jsonob.isFullScreen = '1'
        jsonob.pos_id = Cookies.get('pos_id')
        jsonob.recmd_id = Cookies.get('recmd_id')
        jsonob.parent_page_type = '0301'
        jsonob.parent_page_id = value.detailData.assetId
        if (indexSingle.itemNo > 0) {
          jsonob.fee = '2'
        }
        bi.vod(jsonob)
      } catch (e) {
        console.log('错误信息' + e)
      }
      Cookies.set('qb_datetime', (new Date()).valueOf(), {
        path: '/'
      })
      SDKDownload();
      return
    }
    // 去订购
    if (!topContent.isPlay) {
      if (isZero == 1) {
        //黑名单
        toast("您的账号存在异常，请联系客服！");
        return
      }
      try {
        var param = {
          page_id: value.detailData.assetId,
          page_type: '0301'
        }
        bi.orderClick(param)
        Cookies.set('orderPkg', value.detailData.assetId, {
          path: '/'
        })
      } catch (error) {
        console.log('埋点错误', error)
      }
      var contentType = encodeURIComponent({
        page_id: '1080HDJTJGDYDetail' + value.detailData.assetType + "-0000",
        page_name: '1080高清极光详情页' + value.name
      })
      var OrderbackUrl = encodeURIComponent(window.location.href);
      window.location.href = 'http://115.233.200.60:58000/epg/entry/order.epg?siteCode=hdvod&bizCode=tx_hd_order&productId=701063&backUrl=' +
        OrderbackUrl + '&userId=' +
        json.UserId + "&contentCode=" +
        value.detailData.assetCode + "&contentType=" + contentType;
      return
    }
    try {
      var jsonob = {};
      jsonob.asset_id = value.detailData.assetId;
      jsonob.item_id = value.detailData.itemList[indexSingle.itemNo].itemId
      jsonob.qb_datetime = Cookies.get('qb_datetime')
      jsonob.zb_datetime = (new Date()).valueOf()
      jsonob.time = jsonob.zb_datetime - jsonob.qb_datetime
      jsonob.ep = value.detailData.episodes
      jsonob.fee = '1'
      jsonob.isFullScreen = '1'
      jsonob.pos_id = Cookies.get('pos_id')
      jsonob.recmd_id = Cookies.get('recmd_id')
      jsonob.parent_page_type = '0301'
      jsonob.parent_page_id = value.detailData.assetId
      if (indexSingle.itemNo > 2) {
        jsonob.fee = '2'
      }
      bi.vod(jsonob);
    } catch (e) {
      console.log('错误信息' + e);
    }
    Cookies.set('qb_datetime', (new Date()).valueOf(), {
      path: '/'
    })
    setTimeout(function () {
      SDKDownload();
    }, 200)
  }
}

var indexNews = {
  data: {},
  element: null,
  itemNo: 0,
  indexPlay: 0,
  init: function () {
    this.data = value.detailData.itemList;
    this.element = getId('slider1');
    addClass(getId("indexSingle"), 'change');
    addClass(getId("slider1"), 'scrollLefts');
    var html = '';
    for (var i = 0; i < this.data.length; i++) {
      if (value.detailData.itemList[i].fee == "2" && topContent.isPlay == false) {
        var div = '<div class="buttomNums" id="buttomNum' + i + '"><p>' + this.data[i].itemName + '</p><img src="./../public/images/detail/vip.png" alt=""></div>';
      } else {
        var div = '<div class="buttomNums" id="buttomNum' + i + '"><p>' + this.data[i].itemName + '</p></div>';
      }
      html += div;
    };
    this.element.innerHTML = html;
  },
  removeCss: function () {
    var length = this.data.length;
    for (var i = 0; i < length; i++) {
      removeClass(getId("buttomNum" + i), 'active')
    };
  },
  addCss: function () {
    addClass(getId("buttomNum" + this.itemNo), 'active');
    getScrollbottom("#buttomNum" + this.itemNo);
    this.uploadIndexPay();
    this.element.style.left = value.indexNewsleLeft + -value.indexNewsWidth * this.itemNo + 'px'; //单集按钮滚动
    if (this.itemNo > 0 && this.itemNo % 10 === 0 || (this.itemNo + 1) % 10 === 0) { //单集跳转10的倍数，触发总集数滚动
      indexTotal.itemNo = Math.floor(this.itemNo / 10);
      indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
    }
    this.marquee("add");
  },
  uploadIndexPay: function () {
    var length = this.data.length;
    for (var i = 0; i < length; i++) {
      removeClass(getId("buttomNum" + i), 'select');
    };
    addClass(getId("buttomNum" + this.indexPlay), 'select');
  },
  initPayActive: function () {
    // this.itemNo = this.indexPlay;
    this.element.style.left = value.indexNewsleLeft + -value.indexNewsWidth * this.indexPlay + 'px'; //单集按钮滚动
    if (this.itemNo > 0 && this.itemNo % 10 === 0 || (this.itemNo + 1) % 10 === 0) { //单集跳转10的倍数，触发总集数滚动
      indexTotal.itemNo = Math.floor(this.itemNo / 10)
      indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
    }
    removeClass(getId("buttomNum" + this.itemNo), 'active');
  },
  marquee: function (status, id) {
    // 滚动
    var scrollLeft = 0;
    clearInterval(this.timer);
    if (id) {
      var div = getId(id).getElementsByTagName('span')[0];
    } else {
      var div = getId("buttomNum" + this.itemNo).getElementsByTagName('p')[0];
    }
    var length = strlen(div.innerHTML);
    if (length < 9) return
    if (status == 'add') {
      this.timer = setInterval(function () {
        if (scrollLeft <= -19 * length + 50) {
          scrollLeft = 250;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        } else {
          scrollLeft += -1;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
        }
      }, 30);
    } else {
      if (div.innerHTML.length >= 9) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: left;"
      }
    }
  },
  up: function () {
    this.marquee()
    this.removeCss();
    focused('up')
    // this.initPayActive();
  },
  down: function () {
    this.marquee()
    this.removeCss();
    focused('down')
    // this.initPayActive();
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.marquee()
    this.removeCss();
    this.itemNo--;
    this.addCss();
    // this.marquee('add')
  },
  right: function () {
    if (this.itemNo === this.data.length - 1) return;
    this.removeCss();
    this.marquee()
    this.itemNo++;
    this.addCss();
    // this.marquee('add')
  },
  enter: function () {
    this.indexPlay = this.itemNo;
    this.addCss();
    // 试看逻辑
    if (value.detailData.itemList[indexNews.itemNo].fee == "1") {
      // 试看第一集
      console.log('试看第一集')
      try {
        var jsonob = {}
        jsonob.aset_id = value.detailData.assetId;
        jsonob.istem_id = value.detailData.itemList[indexSingle.itemNo].itemId
        jsonob.qb_datetime = Cookies.get('qb_datetime')
        jsonob.zb_datetime = (new Date()).valueOf()
        jsonob.time = jsonob.zb_datetime - jsonob.qb_datetime
        jsonob.ep = value.detailData.episodes
        jsonob.fee = '1'
        jsonob.isFullScreen = '1'
        jsonob.pos_id = Cookies.get('pos_id')
        jsonob.recmd_id = Cookies.get('recmd_id')
        jsonob.parent_page_type = '0301'
        jsonob.parent_page_id = value.detailData.assetId
        if (indexSingle.itemNo > 2) {
          jsonob.fee = '2'
        }
        bi.vod(jsonob)
      } catch (e) {
        console.log('错误信息' + e)
      }
      Cookies.set('qb_datetime', (new Date()).valueOf(), {
        path: '/'
      })
      SDKDownload();
      return
    }
    if (!topContent.isPlay) {
      if (isZero == 1) {
        //黑名单
        toast("您的账号存在异常，请联系客服！");
        return
      }
      try {
        var param = {
          page_id: value.detailData.assetId,
          page_type: '0301'
        }
        bi.orderClick(param)
        Cookies.set('orderPkg', value.detailData.assetId, {
          path: '/'
        })
      } catch (error) {
        console.log('埋点错误', error)
      }
      var contentType = encodeURIComponent({
        page_id: '1080HDJTJGDYDetail' + value.detailData.assetType + "-0000",
        page_name: '1080高清极光详情页' + value.name
      })
      var OrderbackUrl = encodeURIComponent(window.location.href);
      window.location.href = 'http://115.233.200.60:58000/epg/entry/order.epg?siteCode=hdvod&bizCode=tx_hd_order&productId=701063&backUrl=' +
        OrderbackUrl + '&userId=' +
        json.UserId + "&contentCode=" +
        value.detailData.assetCode + "&contentType=" + contentType;
      return
    }
    try {
      try {
        var jsonob = {};
        jsonob.asset_id = value.detailData.assetId;
        jsonob.item_id = value.detailData.itemList[indexSingle.itemNo].itemId;
        jsonob.qb_datetime = Cookies.get('qb_datetime')
        jsonob.zb_datetime = (new Date()).valueOf()
        jsonob.time = jsonob.zb_datetime - jsonob.qb_datetime
        jsonob.ep = value.detailData.episodes
        jsonob.fee = '1'
        jsonob.isFullScreen = '1'
        jsonob.pos_id = Cookies.get('pos_id')
        jsonob.recmd_id = Cookies.get('recmd_id')
        jsonob.parent_page_type = '0301'
        jsonob.parent_page_id = value.detailData.assetId
        if (indexSingle.itemNo > 0) {
          jsonob.fee = '2'
        }
        bi.vod(jsonob)
      } catch (e) {
        console.log('错误信息' + e)
      }
      Cookies.set('qb_datetime', (new Date()).valueOf(), {
        path: '/'
      })
    } catch (error) {

    }
    SDKDownload();
  }
}

var indexTotal = {
  data: {},
  element: null,
  itemNo: 0,
  arrayNum: 0,
  init: function () {
    this.data = value.detailData.itemList;
    var total = this.data.length;
    this.arrayNum = Math.floor((total - 1) / 10) * 1;
    this.element = getId('slider2');
    var class1 = 'topNum';
    var html = '';
    for (var i = 0; i < this.arrayNum; i++) {
      var div = ''
      if (i == 0) {
        div = '<div class="' + class1 + '" id="topNum' + i + '">1-' + (i + 1) + '0</div>'
      } else {
        div = '<div class="' + class1 + '" id="topNum' + i + '">' + i + "1-" + (i + 1) + "0" + '</div>';
      }
      html += div
    };
    this.element.innerHTML = html;
    if (total > this.arrayNum * 10) {
      var div
      if (i == 0) {
        div = '<div class="' + class1 + '" id="topNum' + i + '">1-' + total + '</div>';
      } else {
        div = '<div class="' + class1 + '" id="topNum' + i + '">' + this.arrayNum + '1-' + total + '</div>';
      }
      html += div
      this.element.innerHTML = html;
    }
  },
  addCss: function (obj) {
    addClass(getId("topNum" + indexTotal.itemNo), 'active')
    getScrollbottom("#topNum" + indexTotal.itemNo);
    this.element.style.left = 530 + -100 * this.itemNo + 'px' //滚动方程

    if (obj) {
      return
    } else {
      if (value.detailData.layout == "Detail_News") {
        indexNews.itemNo = this.itemNo * 10;
        indexNews.element.style.left = value.indexNewsleLeft + -value.indexNewsWidth * indexNews.itemNo + 'px' //滚动方程
      } else {
        indexSingle.itemNo = this.itemNo * 10;
        indexSingle.element.style.left = value.indexSingleLeft + -value.indexSingWidth * indexSingle.itemNo + 'px' //滚动方程
      }
    }
  },
  removeCss: function () {
    for (var i = 0; i <= this.arrayNum; i++) {
      removeClass(getId("topNum" + i), 'active')
    };
  },
  up: function () {
    this.removeCss()
    focused('up')
  },
  down: function () {
    this.removeCss()
    focused('down')
  },
  left: function () {
    if (this.itemNo === 0) return;
    this.removeCss();
    this.itemNo--;
    this.addCss();
  },
  right: function () {
    if (this.itemNo === this.arrayNum) return
    this.removeCss();
    this.itemNo++;
    this.addCss();
  },
  enter: function () { }
}

// 推荐资产模板
var assetList = {
  data: {},
  itemNo: 0,
  element: null,
  init: function () {
    this.data = value.detailData.assetList;
    this.element = getId("scrollContent");
    var html = '';
    var length
    if (this.data.length > 6) {
      length = 6
    } else {
      length = this.data.length
    }
    for (var i = 0; i < length; i++) {
      var div = '<li class="content content' + i + '" id="li-item' + i + '"><img src=' + this.data[i].assetImg + '><div class="contentP60">' + this.data[i].assetName + '</div></li > '
      // var div = '<li class="content content' + i + '" id ="li-item' + i + '"><img src=' + this.data[i].assetImg + '></li > '
      html += div;
    }
    this.element.innerHTML = html;
  },
  addCss: function () {
    addClass(getId("li-item" + this.itemNo), 'hover');
    getScrollbottom("#li-item" + this.itemNo);
    if (getClass('contentP60')[this.itemNo].scrollWidth > getClass('contentP60')[this.itemNo].offsetWidth) {
      getClass('contentP60')[this.itemNo].innerHTML = '<marquee>' + getClass('contentP60')[this.itemNo].innerHTML + '</marquee>'
    }
  },
  removeCss: function () {
    removeClass(getId("li-item" + this.itemNo), 'hover');
    if (getClass('contentP60')[this.itemNo].innerHTML.indexOf('marquee') != -1) {
      var str = getClass('contentP60')[this.itemNo].innerHTML
      getClass('contentP60')[this.itemNo].innerHTML = str.replace('<marquee>', '').replace('</marquee>', '')
    }
  },
  up: function () {
    this.removeCss();
    focused('up')
  },

  down: function () { },

  left: function () {
    if (this.itemNo === 0) return
    if (this.itemNo >= 4) {
      this.element.style.left = -(this.itemNo - 4) * 196 + "px"
    }
    this.removeCss()
    this.itemNo--
    this.addCss()
  },

  right: function () {
    if (this.itemNo == 5) return
    this.removeCss()
    this.itemNo++
    if (this.itemNo >= 4) {
      this.element.style.left = -(this.itemNo - 4) * 196 + "px"
    }
    this.addCss()
  },
  enter: function () {
    // 点击推荐位上报
    try {
      console.log('点击推荐位上报')
      var jsonOb = {}
      jsonOb.pos_id = ''
      jsonOb.recmd_id = '3'
      jsonOb.page_type = '0301'
      jsonOb.page_id = value.detailData.assetId
      jsonOb.click_type = '1'
      jsonOb.cid = this.data[this.itemNo].assetId
      bi.jumpRecommend(jsonOb)
      // 页面访问储存
      var jump = {
        parent_page_type: '0301',
        parent_page_id: value.detailData.assetId
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, {
        path: '/'
      })

      Cookies.set('pos_id', '', {
        path: '/'
      })
      Cookies.set('recmd_id', '3', {
        path: '/'
      })
    } catch (error) {
      console.log('埋点错误', error)
    }
    // 停止播放
    // 刷新当前页
    areaObj = topContent;
    var detailURL = this.data[this.itemNo].jsonUrl //存储详情页url
    Cookies.set('detailUrl', detailURL, {
      path: '/'
    })
    // 浙江电信详情页跳转推荐的详情页
    console.log('%cZJDX 浙江电信详情页跳转推荐的详情页', 'color: #4169E1')
    console.log(value.detailData.assetId)
    console.log(value.detailData)
    try {
      var type = {
        page_id: '1080HDJTJGDYDetail' + value.detailData.assetType + "-0000",
        page_name: '1080高清极光详情页' + value.name,
        refer_pos_id: '',
        refer_pos_name: '',
        refer_page_id: Cookies.get('refer_page_id'),
        refer_page_name: Cookies.get('refer_page_name'),

        refer_type: '10',
        refer_parent_id: '',

        mediacode: value.detailData.assetCode,
        medianame: value.detailData.assetName
      }
      console.log(type)
      ZJDXlog.browsing(type)
    } catch (error) {
      console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
    }
    var pageUrl
    if (getParam('epg_info')) {
      pageUrl = "./detail.html?assetId=" + getParam('assetId', detailURL) + "&epg_info=" + getParam('epg_info');
    } else {
      pageUrl = "./detail.html";

    }
    window.location.replace(pageUrl);
  },
}
// 专题
var specialList = {
  // 专题模板
  data: {},
  itemNo: 0,
  element: null,
  arrayNum: 0,
  init: function () {
    this.data = value.detailData.specialList;
    this.element = getId("specialList");
    if (this.data.length == 0) {
      this.element.style.display = 'none'
      value.removeArray('specialList');
      return;
    }
    var html = '';
    var length = this.data.length;
    for (var i = 0; i < length; i++) {
      var div = '<div class="specialContent" id="specialContent' + i + '"><img src="../public/images/img_loading_160x230.png"  data-img=' + this.data[i].specialImg + '/></div>'
      html += div;
    }
    this.element.innerHTML = html;
  },
  removeCss: function () {
    for (var i = 0; i <= this.arrayNum; i++) {
      removeClass(getId("specialContent" + i), 'hover')
    };
  },
  addCss: function () {
    addClass(getId("specialContent" + this.itemNo), 'hover')
    getScrollbottom("#specialContent" + this.itemNo)
  },
  down: function () {
    this.removeCss();
    focused('down')
  },
  up: function () {
    this.removeCss();
    focused('up')
  }
}
// 详情页弹窗
var descriptionBox = {
  // 弹窗模板
  num: 0, //翻页数
  option: 0, //页数
  height: 0, //文字高度
  init: function () {
    getId("wordScroll").innerHTML = value.detailData.description;
    // this.height = getId('wordScroll').offsetHeight;
    this.option = parseInt(getId('wordScroll').offsetHeight * 1 / 450);
    if (this.option > 0) {
      getId('TopScroll').style.display = 'block';
    }
  },
  enter: function () {
    areaObj = topContent;
    getId('descriptionBox').style.visibility = "hidden";
  },
  up: function () {
    if (this.num == 0) return;
    this.num--;
    getId('TopScroll').style.top = '20px';
    getId('wordScroll').style.top = -265 * this.num + "px"
  },
  down: function () {
    if (this.num == parseInt(getId('wordScroll').offsetHeight * 1 / 450)) return;
    this.num++;
    getId('TopScroll').style.top = '88px';
    getId('wordScroll').style.top = -445 * this.num + "px"
  },
  back: function () {
    areaObj = topContent;
    getId('descriptionBox').style.visibility = "hidden";
  },
}
//滚动方式
function getScrollbottom(id) {
  // var wh = $(window).height(); 
  var wh = 720;
  var ot = $(id).offset().top; //是标签距离顶部高度
  // prompt("标签距离顶部高度" + ot);
  // var ds = $(document.documentElement).scrollTop(); //是滚动条高度 
  var icoimg_h = $(id).height() + 30; //是标签高度
  // bh+$("div").height()+[$("div").offset().top-$(document).scrollTop()]=$(window).height();
  bh = wh - icoimg_h - ot; //距离底部的高度
  var len = getId("scroll-box").style.top;
  var lens
  if (len == '') {
    lens = -bh + 60;
  } else {
    var value = getId("scroll-box").style.top.split('px')[0];
    // toast("获取顶部距离值" + getId("scroll-box").style.top);
    lens = -bh - (value * 1) + 60;
    // setTimeout(function () {
    //   // toast("获取顶部距离值" + value);
    // }, 1000)
  }
  if (bh < 0) {
    // getId('scroll-box').style.top = -lens + 'px';
    $("#scroll-box").css({
      "transform": 'translateY(-' + lens * 1 + 'px)'
    })
  } else if (bh > 300) {
    // if (lens < 0 || !lens) {
    // getId('scroll-box').style.top = '0px';
    // toast("回滚成功" + getId('scroll-box').style.top)
    $("#scroll-box").css({
      "transform": 'translateY(0px)'
    })
    // }
  }

  // if (bh < 0) {
  //   $("#scroll-box").css({
  //     "transform": 'translateY(-' + lens * 1 + 'px)'
  //   })
  // } else if (bh > 300 && lens < 0) {
  //   $("#scroll-box").css({
  //     "transform": 'translateY(0px)'
  //   })
  // }
}

// 收藏
function removeFav(data, callBackFunction) {
  var urls = historylUrl + '/del?version=1';
  console.log(urls);
  getYhSpecialSC(urls, data, function (response) {
    callBackFunction(response)
  })
};

function addFav(data, callBackFunction) {
  var urls = historylUrl + '/collect?version=1';
  getYhSpecialSC(urls, data, function (response) {
    callBackFunction(response)
  })
};

// 判断收藏
function collectData() {
  var url = historylUrl +
    "/list?version=1&siteId=" + yh.siteId + "&userId=" + yh.userId +
    "&relateId=" + value.detailData.assetId + "&collectType=1"
  console.log(url)
  getYhSpecialList_nc(url, function (res) {
    if (typeof (res) == "string") {
      res = eval('(' + res + ')');
    }
    if (res.data.resultNum == 1) {
      topContent.isCollect = true;
      getId('collectWord').innerText = "已收藏"
      // getId('collect').className = 'isCollect btn'
      addClass(getId("btnBox1"), 'isCollect')
    } else {
      topContent.isCollect = false
      getId('collectWord').innerText = "收藏"
      // getId('collect').className = 'noCollect btn'
      addClass(getId("btnBox1"), 'noCollect')
    }
  }, function (error) {
    console.log(error)
  }, true)
};

function qeryHistory() {
  // 查询播放历史记录
  var url = historylUrl + '/list?version=1&siteId=' + yh.siteId + '&userId=' + yh.userId + '&pindex=0&psize=16&collectType=3'
  console.log("查询播放记录:" + url);
  getCollectionList(url, function (response) {
    var obj = {
      name: value.detailData.assetName,
      vod_id: value.detailData.itemList[0].vodList[0].playUrl.vodId,
      flag: 11,
      index: 1,
      time: 0
    }
    var response = JSON.parse(response);
    console.log("查询播放记录:" + response)
    if (response.code !== 200) { } else {
      for (var i = 0; i < response.data.resultList.length; i++) {
        var element = response.data.resultList[i];
        console.log(JSON.stringify(element));
        console.log(JSON.stringify(value.detailData.assetId));
        if (element.relateId == value.detailData.assetId) {
          // 有播放记录，并返回集数
          if (value.detailData.layout == "Detail_News") {
            indexNews.itemNo = element.relateEpisode * 1 - 1;
            indexNews.indexPlay = indexNews.itemNo;
            getId('slider1').style.left = value.indexNewsleLeft + -value.indexNewsWidth * indexNews.itemNo + 'px'; //单集按钮滚动
            if (indexNews.itemNo > 10) { //单集跳转10的倍数，触发总集数滚动
              indexTotal.itemNo = Math.floor(indexNews.itemNo / 10);
              indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
            }
            if (topContent.isPlay) {
              indexNews.removeCss();
              indexNews.addCss();
            } else {
              indexNews.uploadIndexPay();
            }
          } else {
            indexSingle.itemNo = element.relateEpisode * 1 - 1;
            indexSingle.indexPlay = indexSingle.itemNo;
            getId('slider1').style.left = value.indexSingleLeft + -value.indexSingWidth * indexSingle.itemNo + 'px'; //单集按钮滚动
            if (indexSingle.itemNo > 10) { //单集跳转10的倍数，触发总集数滚动
              indexTotal.itemNo = Math.floor(indexSingle.itemNo / 10);
              indexTotal.element.style.left = 530 + -100 * indexTotal.itemNo + 'px'; //单集按钮滚动
            }
            if (topContent.isPlay) {
              indexSingle.removeCss()
              indexSingle.addCss()
            } else {
              indexSingle.uploadIndexPay();
            }
          }
        }
      }
      // }
    }
  },
    function (response) {
      console.log(response);
    })
}

function exit() {
  var backUrl = Cookies.get("backUrl") || "./../index/home1.html";
  setTimeout(function () {
    if (backUrl == '第三方退出') {
      if (value.backType == 0) {
        try {
          Cookies.set('detailUrl', '', {
            path: '/'
          });
          window.location.href = backUrl;
          // toast(backUrl)
        } catch (e) {
          console.log(e)
        }
      } else {
        // toast(value.backType)
        window.location.href = value.backType;
      }
    } else {
      window.location.href = backUrl;
      // toast(backUrl)
    }
  }, 300)
}

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
      // player.stop();
      if (areaObj != descriptionBox) {
        exit();
      } else {
        areaObj.back()
      }
      break;
    case "enter":
      areaObj.enter();
      break;
    case "home":
      areaObj.home();
      break;
    case "menu":
  }
};
//事件绑定
document.onkeydown = grepEvent;