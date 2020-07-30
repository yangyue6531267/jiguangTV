var value = {
  navData: {}, //首页导导航栏数据
  jsonList: [], //动态模板list,此数组jsonp去获取每个模板内容
  detailList: [], //每一行数据
  pageNo: -1, //焦点到第几行 -2:历史收藏  -1:nav
  sliderHei: 0, //焦点距离顶部px
  templateName: 'JG_Category_Group_', //js作用域模块前缀
  navSlider: false, //导航栏切换状态
  isBack: false,
  callBackTime: 350,
  getValue: function () {
    //返回
    if (getParam('pageNo')) {
      this.isBack = true;
      var itemNo = getParam('itemNo') * 1 || 0;
      topNav.itemNo = getParam('menuItemNo') * 1 || 0;
      this.pageNo = getParam('pageNo') * 1 || 0;
      topNav.removeClass();
      if (this.pageNo == -2) {
        topMenu.itemNo = itemNo;
        topMenu.init();
      } else if (this.pageNo == -1) {
        topNav.init();
      }
    } else {
      topNav.init();
      // 首页页面访问埋点
      console.log('bi 首页页面访问埋点')
      try {
        var jsonOb = {}
        jsonOb.page_type = '0101'
        jsonOb.page_id = '204185'
        jsonOb.parent_page_type = 'null'
        jsonOb.parent_page_id = 'null'
        bi.jump(jsonOb)
      } catch (error) {
        console.log('埋点错误', error)
      }
    }
    if (getParam('epg_info')) {
      Cookies.set("epg_info", getParam('epg_info'), { path: '/' })
      var backType = decodeURIComponent(getParam('epg_info').split("page_url")[1]).slice(1);
      var backTypes = backType.substring(0, backType.length - 2);
      Cookies.set("backLauncherkUrl", backTypes, { path: '/' })
    }
  },
  commonUp: function () {
    if (value.pageNo - 1 != -2) {
      // 非最顶部
      value.pageNo--
    }
    debounce(imgLazyLoad, 250)
    this.slider();
    if (value.pageNo == -1) {
      topNav.init();
    } else {
      var name = value.templateName + value.pageNo
      console.log(name)
      areaObj = window[name];
      window[name].init();
    }
  },
  commonDown: function () {
    if (value.pageNo + 1 != value.detailList.length) {
      // 非最后一行
      value.pageNo++
    }
    debounce(imgLazyLoad, 250)
    this.slider();
    var name = value.templateName + value.pageNo
    console.log(name)
    areaObj = window[name];
    window[name].init();
  },
  slider: function () {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (value.pageNo < 0) return
    var domHei = getId('indexPage').clientHeight;
    var hoverDom = getId(value.detailList[value.pageNo].layout + '-' + value.pageNo);
    value.sliderHei = hoverDom.offsetTop - (720 - hoverDom.offsetHeight) / 2;
    if (getId('indexPage').clientHeight - 720 <= value.sliderHei) {
      //最后一行
      value.sliderHei = domHei - 720;
    } else if (value.pageNo == 0) {
      //第一行
      value.sliderHei = 0;
      value.pageNo = 0;
    }
    getId('indexPage').style.top = -value.sliderHei + 'px';
    // getId('indexPage').style.transform = 'translateY(-' + value.sliderHei * 1 + 'px)'
  }
}

// 接口数据分为三层 
// 1、导航栏的栏目
// 2、当前导航栏的模板类型和模板内容接口
// 3、某个模板包含的内容

// 1、导航栏的栏目
var getNavData = function () {
  getYhNavigationBar(function (res) {
    if (res.code == 200) {
      value.navData = res.data;
      topNav.uploadDom();
      value.getValue();
      getDataList();
    } else {
      console.log('getNavData数据获取异常--' + JSON.stringify(res))
    }
  }, function (err) {
    console.log(err)
  })
}
// 2、当前导航栏的模板类型和模板内容接口
var getDataList = function () {
  var url = value.navData.catList[topNav.itemNo].jsonUrl + '&level=3';
  var cat_id = url.match(/catId=(\S*)&c=/)[1]; //埋点parent_page_id
  Cookies.set('cat_id', cat_id, {
    path: '/'
  })
  ajax({
    url: url,
    type: "GET",
    dataType: "jsonp", //指定服务器返回的数据类型
    jsonp: 'jsonpCallback',
    jsonpCallback: 'callback',
    success: function (res) {
      if (res.code == 200) {
        value.jsonList = res.data.specialList;
        value.detailList = [];
        uploadDom();
        // 切换栏目页面访问上报
        try {
          var jump = Cookies.get('jump')
          var jsonOb = {}
          jsonOb.page_type = '0101'
          jsonOb.page_id = cat_id
          if (jump) {
            jump = JSON.parse(jump)
            jsonOb.parent_page_type = jump.parent_page_type
            jsonOb.parent_page_id = jump.parent_page_id
          } else {
            jsonOb.parent_page_type = 'null'
            jsonOb.parent_page_id = 'null'
          }
          bi.jump(jsonOb);
          //储存上一页数据
          var jump = {
            parent_page_type: '0101',
            parent_page_id: cat_id
          }
          jump = JSON.stringify(jump)
          Cookies.set('jump', jump, {
            path: '/'
          })

          // 浙江电信主页跳转到栏目埋点
          console.log('%cZJDX 浙江电信主页跳转到栏目埋点', 'color: #4169E1')
          if (Cookies.get('refer_page_id')) {
            var refer_page_id = Cookies.get('refer_page_id');
            var refer_page_name = Cookies.get('refer_page_name')
          } else {
            Cookies.set("refer_page_id", '', {
              path: '/'
            });
          }

          try {
            var type = {
              page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo,
              page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName,
              // refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo,
              refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName,
              refer_pos_id: "",

              refer_page_id: refer_page_id,
              refer_page_name: refer_page_name,
              refer_type: '6',
              refer_parent_id: '',

              mediacode: '',
              medianame: ''
            }
            Cookies.set("refer_page_id", '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + (topNav.itemNo), {
              path: '/'
            });
            Cookies.set("refer_page_name", '1080高清极光' + value.navData.catList[topNav.itemNo].catName, {
              path: '/'
            });
            ZJDXlog.browsing(type)
          } catch (error) {
            console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
          }
        } catch (e) {
          console.log('切换栏目埋点-' + e)
        }
      } else {
        console.log('getDataList数据获取异常--' + JSON.stringify(res))
      }
    },
    fail: function (err) {
      console.log(err)
    }
  });
}

var uploadDom = function () {
  getId('detail').innerHTML = '';
  var indexNo = 0; //渲染到第几行
  for (var i = 0; i < value.jsonList.length; i++) {
    // 添加标题
    if (i > 0) {
      var div1 = document.createElement('div');
      div1.className = 'JG_Category_Group_Title'
      div1.id = 'JG_Category_Group_Title_' + i
      getId('detail').appendChild(div1);
      getId('JG_Category_Group_Title_' + i).innerHTML = value.jsonList[i].specialName
    }
    for (var j = 0; j < value.jsonList[i].elementList.length; j++) {
      if (value.jsonList[i].elementList[j].layout != 'JG_Category_Group') {
        window[value.templateName + indexNo] = new window[value.jsonList[i].elementList[j].layout]();
        window[value.templateName + indexNo].uploadDom(value.jsonList[i].elementList[j], indexNo);
        value.detailList.push(value.jsonList[i].elementList[j]);
        indexNo++
      }
    }
  }
  if (getParam('pageNo') >= 0 && value.isBack == true) {
    var templateName = value.templateName + value.pageNo;
    console.log(templateName);
    topNav.uploadBgImg()
    window[templateName].itemNo = getParam('itemNo') * 1;
    setTimeout(function () {
      window[templateName].init();
    }, 300)
    areaObj = window[templateName];
    value.slider();
  }
  imgLazyLoad();
  value.navSlider = true;
}

// 顶部历史收藏观看记录,
var topMenu = {
  itemNo: 0,
  addClass: function () {
    addClass(getId('menu' + this.itemNo), 'hover');
  },
  removeClass: function () {
    removeClass(getId('menu' + this.itemNo), 'hover');
  },
  uploadBgImg: function () {
    //更新背景图
    getId('indexPage').style.backgroundImage = "url(" + value.navData.catList[this.itemNo].bgPhoto + ")"
  },
  init: function () {
    value.pageNo = -2;
    areaObj = topMenu
    this.addClass();
    this.uploadBgImg()
  },
  up: function () {
    return
  },
  down: function () {
    this.removeClass();
    topNav.init()
  },
  left: function () {
    if (this.itemNo <= 0) return
    this.removeClass();
    this.itemNo--;
    this.addClass();
  },
  right: function () {
    if (this.itemNo >= 2) return
    this.removeClass();
    this.itemNo++;
    this.addClass();
  },
  enter: function () {
    var twoStageBackUrl = window.location.pathname + '?pageNo=' + value.pageNo + '&itemNo=' + this.itemNo; //焦点记忆

    // 页面访问储存
    var jump = {};
    jump.parent_page_type = '0101';
    if (this.itemNo == 0) {
      jump.parent_page_id = '101-1';
      jump = JSON.stringify(jump);
      Cookies.set('jump', jump, {
        path: '/'
      });
      Cookies.set("columnName", twoStageBackUrl, {
        path: '/'
      });
      //观看记录
      window.location.href = "../history/history.html?type=1"
    } else if (this.itemNo == 1) {
      jump.parent_page_id = '100-1';
      jump = JSON.stringify(jump);
      Cookies.set('jump', jump, {
        path: '/'
      });
      //内容搜索
      Cookies.set("twoStageBackUrl", twoStageBackUrl, {
        path: '/'
      });
      window.location.href = "../search/search.html"
    } else if (this.itemNo == 2) {
      jump.parent_page_id = '103-1';
      jump = JSON.stringify(jump);
      Cookies.set('jump', jump, {
        path: '/'
      });
      //我的收藏
      Cookies.set("columnName", twoStageBackUrl, {
        path: '/'
      });
      window.location.href = "../history/history.html?type=0"
    }
  },
  back: function () { }
}

// nav栏目,
var topNav = {
  itemNo: 0,
  navLength: 0,
  sliderWidth: 0,
  muteNum: 0,
  init: function () {
    this.sliderWidth = Math.ceil((60 + getId('nav' + (topNav.navLength - 1)).offsetLeft + getId('nav' + (topNav.navLength - 1)).clientWidth - 1280 + 60) / (topNav.navLength - 2));
    this.slider();
    areaObj = topNav;
    value.pageNo = -1;
    this.addClass();
    this.uploadBgImg();
    // 浙江电信主页心跳上报埋点
    setTimeout(function () {
      console.log('%cZJDX 浙江电信主页心跳上报埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo,
          page_name: '',
          refer_pos_id: '',
          refer_pos_name: '',

          refer_page_id: '',
          refer_page_name: '',

          refer_type: '10',
          refer_parent_id: '',

          mediacode: '',
          medianame: '',

          type: 0
        }
        ZJDXlog.timeStart(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }
    }, 500)
  },
  uploadDom: function () {
    topNav.navLength = value.navData.catList.length;
    var html = "";
    for (var i = 0; i < topNav.navLength; i++) {
      html += "<div id=" + 'nav' + i + ">" + value.navData.catList[i].catName + "</div>"
    }
    getId('nav').innerHTML = html;
  },
  uploadBgImg: function () {
    //更新背景图
    if (value.navData.catList[this.itemNo] && value.navData.catList[this.itemNo].bgPhoto != '') {
      getId('indexPage').style.backgroundImage = "url(" + value.navData.catList[this.itemNo].bgPhoto + ")"
      // getId('indexPage').style.backgroundImage = "#032E3E"
    }
  },
  slider: function () {
    if (value.navData.catList.length <= 8) return
    var sliders = 60 - topNav.sliderWidth * topNav.itemNo;
    if (this.itemNo < 4) {
      sliders = 60
    }
    console.log('sliders---' + sliders)
    getId('nav').style.left = sliders + 'px';
  },
  addClass: function () {
    addClass(getId('nav' + this.itemNo), 'hover');
    //清除select下标
    for (var i = 0; i < topNav.navLength; i++) {
      removeClass(getId('nav' + i), 'select');
    }
  },
  removeClass: function () {
    if (getId('nav' + this.itemNo)) {
      removeClass(getId('nav' + this.itemNo), 'hover');
    }
    addClass(getId('nav' + this.itemNo), 'select');
  },
  up: function () {
    if (value.navSlider == false) return
    this.removeClass();
    topMenu.init();
  },
  down: function () {
    if (value.navSlider == false) return
    this.removeClass();
    value.commonDown();
  },
  left: function () {
    if (this.itemNo <= 0) return;
    value.isBack = false;
    this.removeClass();
    this.itemNo--;
    this.addClass();
    this.uploadBgImg();
    this.slider();
    value.navSlider = false;
    getId('detail').innerHTML = '';
    Cookies.set("refer_page_id", '1080HDJTJG' + value.navData.catList[topNav.itemNo + 1].catCode + '-000' + (topNav.itemNo + 1), {
      path: '/'
    });
    Cookies.set("refer_page_name", '1080高清极光' + value.navData.catList[topNav.itemNo + 1].catName, {
      path: '/'
    });
    debounce(getDataList, value.callBackTime);
  },
  right: function () {
    if (this.itemNo >= topNav.navLength - 1) return;
    value.isBack = false;
    this.removeClass();
    this.itemNo++;
    this.addClass();
    this.uploadBgImg();
    this.slider();
    value.navSlider = false;
    getId('detail').innerHTML = '';
    Cookies.set("refer_page_id", '1080HDJTJG' + value.navData.catList[topNav.itemNo - 1].catCode + '-000' + (topNav.itemNo - 1), {
      path: '/'
    });
    Cookies.set("refer_page_name", '1080高清极光' + value.navData.catList[topNav.itemNo - 1].catName, {
      path: '/'
    });
    debounce(getDataList, value.callBackTime);
  },
  mute: function () {
    this.muteNum++;
    if (this.muteNum > 20) {
      this.muteNum = 0;
      window.location.href = "http://115.233.200.174:39001/test/index.html"
    }
    setTimeout(function () {
      this.muteNum = 0;
    }, 500)
  },
  enter: function () {
    // toast('http://10.255.247.1/web/gd_service/activity/20200518aurora_ac/index.jsp?userToken=' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg"))
    // // window.location.href = 'http://10.255.247.1/web/gd_service/activity/20200518aurora_ac/index.jsp?userToken=' + Cookies.get("UserToken") + "&epg_info=" + Cookies.get("epg");

    // return
    var twoStageBackUrl = window.location.pathname + '?pageNo=' + value.pageNo + '&menuItemNo=' + this.itemNo + '&itemNo=0'
    var catCode = value.navData.catList[this.itemNo].catCode;
    Cookies.set("twoStageBackUrl", twoStageBackUrl, {
      path: '/'
    });

    // 页面访问储存
    var jump = {};
    jump.parent_page_type = '0101'
    jump.parent_page_id = '102-1'
    jump = JSON.stringify(jump)
    Cookies.set('jump', jump, {
      path: '/'
    })
    if (catCode) {
      window.location.href = "../filter/filter.html?catCode=" + catCode
    } else {
      //全部
      window.location.href = "../filter/filter.html?catCode=all"
    }
  },

  back: function () {
  }
}

// 退出弹框
var signOut = {
  isShow: false,
  itemNo: 0, //按钮编号 0考虑 1确认
  init: function () {
    getId('exitApp').style.display = 'block';
    this.isShow = true;
    areaObj = signOut;
    addClass(getId('exitButtom' + this.itemNo), 'hover')
  },
  left: function () {
    if (this.itemNo == 0) return
    removeClass(getId('exitButtom' + this.itemNo), 'hover')
    this.itemNo--;
    addClass(getId('exitButtom' + this.itemNo), 'hover')
  },
  right: function () {
    if (this.itemNo == 1) return
    removeClass(getId('exitButtom' + this.itemNo), 'hover')
    this.itemNo++;
    addClass(getId('exitButtom' + this.itemNo), 'hover')
  },
  enter: function () {
    if (this.itemNo == 1) {
      // getId('exitApp').style.display = 'none';
      this.isShow = false;
      exit();
    } else {
      this.back();
    }
  },
  back: function () {
    getId('exitApp').style.display = 'none';
    this.isShow = false;
    if (value.pageNo >= 0) {
      var templateName = value.templateName + value.pageNo
      console.log(templateName);
      window[templateName].init();
      areaObj = window[templateName];
    } else if (value.pageNo == -1) {
      areaObj = topNav;
    } else if (value.pageNo == -2) {
      areaObj = topMenu;
    }
  }
}

getNavData()

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
      // if (areaObj == signOut) {
      //   getId('exitApp').style.display = 'none';
      //   this.isShow = false;
      //   if (value.pageNo >= 0) {
      //     var templateName = value.templateName + value.pageNo
      //     console.log(templateName);
      //     window[templateName].init();
      //     areaObj = window[templateName];
      //   } else if (value.pageNo == -1) {
      //     areaObj = topNav;
      //   } else if (value.pageNo == -2) {
      //     areaObj = topMenu;
      //   }
      // }
      if (areaObj != topNav) {
        //返回顶部
        if (areaObj == topMenu) {
          getId('exitApp').style.display = 'none';
          topMenu.removeClass();
          topNav.init();
          return
        }
        var name = value.templateName + value.pageNo
        console.log(name)
        window[name].removeClass();
        value.pageNo = 0;
        value.slider();
        topNav.init();
        value.isBack = false;
        debounce(imgLazyLoad, 250)
      } else {
        // if (topNav.itemNo != 0) {
        //   //返回推荐位
        //   topNav.removeClass();
        //   topNav.itemNo = 0;
        //   getDataList();
        //   topNav.slider();
        //   topNav.addClass();
        //   value.isBack = false;
        // } else {
        //弹框
        // signOut.isShow = false;
        exit();
        // if (signOut.isShow) {
        //   signOut.back();
        // } else {
        //   signOut.init();
        // }
        // }
      }

      // areaObj.back();
      break;
    case "enter":
      areaObj.enter();
    case "mute":
      areaObj.mute();
      break;
  }
};
//事件绑定
document.onkeydown = grepEvent;


