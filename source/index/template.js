/*js模板，var demo=new Category_JG_Top; new作用域，作用域对应每一行dom
作用域包含常用
init//初始化当前作用域
uploadDom更新当前组件dom
up、down、left、right 等键值操作


/* 一大四小模板
Category_JG_Top*/
function Category_JG_Top() {
  this.itemNo = 0;
  this.maxLength = 5;
  this.layout = '';
  this.init = function () {
    this.addClass();
  };
  this.uploadDom = function (obj, num) {
    var html = '';
    this.layout = obj.layout;
    for (var j = 0; j < this.maxLength; j++) {
      if (obj.elementList[j]) {
        var elementImg = obj.elementList[j].elementImg || ''
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>'
        if (elementImg) {
          html += '<img class="lazyload" src=""  data-img="' + elementImg + '"alt="">'
        }
        if (obj.elementList[j].elementType == '4' && obj.elementList[j].superscriptInfo) {
          // html += '<span class="corner">' + obj.elementList[j].score + '</span>'
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="background-color:' + params.bgColor + '">' + '专题' + '</span>'
        } else if (obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="color:' + params.color + ';background-color:' + params.bgColor + '">' + params.name + '</span>'
        }
      } else {
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' + '<img src="" alt="">' + '</div>'
      }
      html += '</div>'
    };
    var div1 = document.createElement('div');
    div1.className = obj.layout
    div1.id = obj.layout + '-' + num;
    getId('detail').appendChild(div1);
    getId(obj.layout + '-' + num).innerHTML = html
    html = '';
  };
  this.addClass = function () {
    var name = this.layout + '_' + value.pageNo
    addClass(getId(name + '_' + this.itemNo), 'hover');
  };
  this.removeClass = function () {
    var name = this.layout + '_' + value.pageNo
    removeClass(getId(name + '_' + this.itemNo), 'hover');
  };
  this.up = function () {
    if (this.itemNo == 0 || this.itemNo == 1 || this.itemNo == 2) {
      this.removeClass();
      value.itemNo -= 1;
      value.commonUp();
    } else {
      this.removeClass();
      this.itemNo -= 2;
      this.addClass();
    }
  };
  this.down = function () {
    this.removeClass();
    if (this.itemNo == 1 || this.itemNo == 2) {
      this.itemNo += 2;
      this.addClass();
    } else {
      value.itemNo += 1;
      value.commonDown();
    }
  };
  this.left = function () {
    if (this.itemNo <= 0) return;
    if (this.itemNo == 3) {
      this.removeClass();
      this.itemNo = 0;
      this.addClass();
    } else {
      this.removeClass();
      this.itemNo--;
      this.addClass();
    }
  };
  this.right = function () {
    if (this.itemNo >= this.maxLength - 1) return;
    this.removeClass();
    this.itemNo++;
    this.addClass();
  };
  this.enter = function () {
    var twoStageBackUrl = window.location.pathname + '?pageNo=' + value.pageNo + '&menuItemNo=' + topNav.itemNo + '&itemNo=' + this.itemNo;
    var obj = value.detailList[value.pageNo].elementList[this.itemNo];
    if (!obj) return
    // 页面访问储存
    try {
      var jump = {
        parent_page_type: '0101',
        parent_page_id: Cookies.get('cat_id')
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, {
        path: '/'
      })
      // 点击推荐位上报
      var jsonOb = {}
      jsonOb.pos_id = '0' + value.pageNo + '0' + this.itemNo
      jsonOb.recmd_id = ''
      jsonOb.page_type = '0101'
      jsonOb.page_id = Cookies.get('cat_id')
      if (obj.elementType == '4') {
        jsonOb.click_type = '2'
      } else {
        jsonOb.click_type = '1'
      }
      jsonOb.cid = obj.elementId
      bi.jumpRecommend(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }

    if (obj.elementType == '4') {
      Cookies.set("twoStageBackUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });

      // 浙江电信主页跳转到专题页埋点
      console.log('%cZJDX 浙江电信主页跳转到栏目埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: '',
          medianame: ''
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
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }

      var url = "../special/index.html";
      window.location.href = url;
    } else if (obj.elementType == '1') {
      // 浙江电信主页一般推荐位跳转到详情页
      console.log('%cZJDX 浙江电信主页一般推荐位跳转到详情页埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: obj.elementCode,
          medianame: obj.elementName
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

        // if (value.detailList[value.pageNo].elementList[window[value.templateName + value.pageNo].itemNo].layout == 'Detail_Movie') {
        //   type.refer_page_id = '1080HDJTJGMovies-' + '_0' + value.pageNo + '0' + this.itemNo,
        //     type.refer_page_name = '电影'
        // }

        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }

      var url = "../detail/detail.html";
      Cookies.set("backUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });
      window.location.href = url;
    } else if (obj.elementType == '8') {
      window.location.href = obj.jsonUrl + '?userToken=' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg");

      // toast(obj.jsonUrl + '?userToken = ' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg"))

      // window.location.href = obj.jsonUrl + '?userToken = ' + Cookies.get("UserToken") + "&epg_info=" + Cookies.get("epg");
    }
  };
  this.back = function () { };
}

/*竖排6条模板
JG_Category_Asset*/
function JG_Category_Asset() {
  this.itemNo = 0;
  this.layout = '';
  this.timer = null;
  this.maxLength = 6;
  this.init = function () {
    this.addClass();
  };
  this.uploadDom = function (obj, num) {
    var html = '';
    this.layout = obj.layout;
    for (var j = 0; j < this.maxLength; j++) {
      if (obj.elementList[j]) {
        var elementImg = obj.elementList[j].elementImg || ''
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' +
          '<img class="lazyload" src=""  data-img="' + elementImg + '"alt="">'
        if (obj.elementList[j].elementType == '4' && obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="background-color:' + params.bgColor + '">' + '专题' + '</span>'
        } else if (obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="color:' + params.color + ';background-color:' + params.bgColor + '">' + params.name + '</span>'
        }
        html += ' <div class="title"  id=' + 'title_' + num + '_' + j + '>' + obj.elementList[j].elementName + '</div>' +
          '</div>'
      } else {
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' + '<img src="" alt="">' + '</div>'
      }
    };
    var div1 = document.createElement('div');
    div1.className = obj.layout
    div1.id = obj.layout + '-' + num;
    getId('detail').appendChild(div1);
    getId(obj.layout + '-' + num).innerHTML = html
    html = '';
  };

  this.marquee = function (status) {
    var scrollLeft = 0;
    this.timer && clearInterval(this.timer);
    var div = getId('title_' + value.pageNo + '_' + this.itemNo);
    if (!div) return
    if (status == 'add') {
      if (div.innerHTML.length < 8) return
      scrollLeft = div.offsetWidth
      div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
      this.timer = setInterval(function () {
        if (scrollLeft <= -div.offsetWidth + 20) {
          scrollLeft = div.offsetWidth;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        } else {
          scrollLeft += -1;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        }
      }, 30);
    } else {
      if (div.innerHTML.length >= 8) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;"
      }
    }
  };

  this.addClass = function () {
    var name = this.layout + '_' + value.pageNo
    addClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee('add');
  };
  this.removeClass = function () {
    var name = this.layout + '_' + value.pageNo
    removeClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee();
  };
  this.up = function () {
    this.removeClass();
    value.itemNo -= 1;
    value.commonUp();
  };
  this.down = function () {
    this.removeClass();
    value.itemNo += 1;
    value.commonDown();
  };
  this.left = function () {
    if (this.itemNo <= 0) return;
    this.removeClass();
    this.itemNo--;
    this.addClass();
  };
  this.right = function () {
    if (this.itemNo >= this.maxLength - 1) return;
    this.removeClass();
    this.itemNo++;
    this.addClass();
  };
  this.enter = function () {
    var twoStageBackUrl = window.location.pathname + '?pageNo=' + value.pageNo + '&menuItemNo=' + topNav.itemNo + '&itemNo=' + this.itemNo;
    var obj = value.detailList[value.pageNo].elementList[this.itemNo];
    if (!obj) return
    // 页面访问储存
    try {
      var jump = {
        parent_page_type: '0101',
        parent_page_id: Cookies.get('cat_id')
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, {
        path: '/'
      })
      // 点击推荐位上报
      var jsonOb = {}
      jsonOb.pos_id = '0' + value.pageNo + '0' + this.itemNo
      jsonOb.recmd_id = ''
      jsonOb.page_type = '0101'
      jsonOb.page_id = Cookies.get('cat_id')
      if (obj.elementType == '4') {
        jsonOb.click_type = '2'
      } else {
        jsonOb.click_type = '1'
      }
      jsonOb.cid = obj.elementId
      bi.jumpRecommend(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }

    if (obj.elementType == '4') {
      Cookies.set("twoStageBackUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });

      // 浙江电信主页跳转到专题页埋点
      console.log('%cZJDX 浙江电信主页跳转到栏目埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: '',
          medianame: ''
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
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }
      var url = "../special/index.html";
      window.location.href = url;
    } else if (obj.elementType == '1') {
      // 浙江电信主页跳转到详情页埋点
      console.log('%cZJDX 浙江电信主页跳转到栏目埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: '',
          medianame: ''
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
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }
      Cookies.set("backUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });
      var url = "../detail/detail.html";
      window.location.href = url;
    } else if (obj.elementType == '8') {
      console.log(obj.jsonUrl)
      window.location.href = obj.jsonUrl + '?userToken=' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg");

      // toast(obj.jsonUrl + '?userToken = ' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg"))

      // window.location.href = obj.jsonUrl + '?userToken = ' + Cookies.get("UserToken") + "&epg_info=" + Cookies.get("epg");
    }
  };
  this.back = function () { };
}

/*竖排6条模板 最后一个为查看更多
JG_Category_Asset_SeeMore*/
function JG_Category_Asset_SeeMore() {
  this.itemNo = 0;
  this.layout = '';
  this.timer = null;
  this.maxLength = 6;
  this.init = function () {
    this.addClass();
  };
  this.uploadDom = function (obj, num) {
    var html = '';
    this.layout = obj.layout;
    for (var j = 0; j < this.maxLength; j++) {
      if (j == 5) {
        // 查看更多
        var elementImg = ''
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' +
          '<div class="more">查看更多</div>' +
          '</div>';
      } else if (obj.elementList[j]) {
        var elementImg = obj.elementList[j].elementImg || ''
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' +
          '<img class="lazyload" src=""  data-img="' + elementImg + '"alt="">'
        if (obj.elementList[j].elementType == '4' && obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="background-color:' + params.bgColor + '">' + '专题' + '</span>'
        } else if (obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="color:' + params.color + ';background-color:' + params.bgColor + '">' + params.name + '</span>'
        }
        html += ' <div class="title"  id=' + 'title_' + num + '_' + j + '>' + obj.elementList[j].elementName + '</div>' +
          '</div>';
      } else {
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' + '<img src="" alt="">' + '</div>'
      }

    };
    var div1 = document.createElement('div');
    div1.className = obj.layout
    div1.id = obj.layout + '-' + num;
    getId('detail').appendChild(div1);
    getId(obj.layout + '-' + num).innerHTML = html
    html = '';
  };
  this.marquee = function (status) {
    var scrollLeft = 0;
    this.timer && clearInterval(this.timer);
    var div = getId('title_' + value.pageNo + '_' + this.itemNo);
    if (!div) return
    if (status == 'add') {
      if (div.innerHTML.length < 8) return
      scrollLeft = div.offsetWidth
      div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
      this.timer = setInterval(function () {
        if (scrollLeft <= -div.offsetWidth + 20) {
          scrollLeft = div.offsetWidth;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        } else {
          scrollLeft += -1;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        }
      }, 30);
    } else {
      if (div.innerHTML.length >= 8) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;"
      }
    }
  };
  this.addClass = function () {
    var name = this.layout + '_' + value.pageNo
    addClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee('add')
  };
  this.removeClass = function () {
    var name = this.layout + '_' + value.pageNo
    removeClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee();
  };
  this.up = function () {
    this.removeClass();
    value.itemNo -= 1;
    value.commonUp();
  };
  this.down = function () {
    this.removeClass();
    value.itemNo += 1;
    value.commonDown();
  };
  this.left = function () {
    if (this.itemNo <= 0) return;
    this.removeClass();
    this.itemNo--;
    this.addClass();
  };
  this.right = function () {
    if (this.itemNo >= this.maxLength - 1) return;
    this.removeClass();
    this.itemNo++;
    this.addClass();
  };
  this.enter = function () {
    var twoStageBackUrl = window.location.pathname + '?pageNo=' + value.pageNo + '&menuItemNo=' + topNav.itemNo + '&itemNo=' + this.itemNo;
    var obj = value.detailList[value.pageNo].elementList[this.itemNo];
    if (!obj && this.itemNo > this.maxLength - 1) return
    // 页面访问储存
    try {
      var jump = {
        parent_page_type: '0101',
        parent_page_id: Cookies.get('cat_id')
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, {
        path: '/'
      })
      // 点击推荐位上报
      var jsonOb = {}
      jsonOb.pos_id = '0' + value.pageNo + '0' + this.itemNo
      jsonOb.recmd_id = ''
      jsonOb.page_type = '0101'
      jsonOb.page_id = Cookies.get('cat_id')
      if (obj.elementType == '4') {
        jsonOb.click_type = '2'
      } else {
        jsonOb.click_type = '1'
      }
      jsonOb.cid = obj.elementId
      if (this.itemNo != this.maxLength - 1) {
        bi.jumpRecommend(jsonOb)
      }
    } catch (error) {
      console.log('埋点错误', error)
    }

    //查看更多跳转筛选
    if (this.itemNo == this.maxLength - 1) {
      var catCode = 'all';
      var categoryId = '';
      catCode = value.navData.catList[topNav.itemNo].catCode
      // 查询elementId
      for (var i = 0; i < value.detailList[value.pageNo].elementList.length; i++) {
        var params = value.detailList[value.pageNo].elementList[i]
        if (params.elementType == '7' || params.elementType == '4') {
          categoryId = params.elementId;
          catCode = params.elementCode;
        }
      }
      Cookies.set("twoStageBackUrl", twoStageBackUrl, {
        path: '/'
      });
      jump.parent_page_type = '0101'
      jump.parent_page_id = '102-1'
      jump = JSON.stringify(jump);
      if (catCode == 'all') {
        window.location.href = "../filter/filter.html?catCode=all"
      } else {
        if (categoryId.length > 6) {
          window.location.href = "../filter/filter.html?catCode=" + catCode + '&categoryId=' + categoryId
        } else {
          window.location.href = "../filter/filter.html?catCode=" + catCode
        }
      }
    } else if (obj.elementType == '4') {
      Cookies.set("twoStageBackUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });

      // 浙江电信主页跳转到专题页埋点
      console.log('%cZJDX 浙江电信主页跳转到专题页埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: '',
          medianame: ''
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
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }
      var url = "../special/index.html";
      window.location.href = url;
    } else if (obj.elementType == "1") {
      // 浙江电信主页一般推荐位跳转到详情页
      console.log('%cZJDX 浙江电信主页一般推荐位跳转到详情页埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: obj.elementCode,
          medianame: obj.elementName
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

        // if (value.detailList[value.pageNo].elementList[window[value.templateName + value.pageNo].itemNo].layout == 'Detail_Movie') {
        //   type.refer_page_id = '1080HDJTJGMovies-' + '_0' + value.pageNo + '0' + this.itemNo,
        //     type.refer_page_name = '电影'
        // }
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }

      Cookies.set("backUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });
      var url = "../detail/detail.html";
      window.location.href = url;
    } else if (obj.elementType == '8') {
      console.log(obj.jsonUrl)
      window.location.href = obj.jsonUrl + '?userToken=' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg");

      // toast(obj.jsonUrl + '?userToken = ' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg"))

      // window.location.href = obj.jsonUrl + '?userToken = ' + Cookies.get("UserToken") + "&epg_info=" + Cookies.get("epg");
    }
  };
  this.back = function () { };
}

/* 横排 2个模板
JG_Category_Subject_Two */
function JG_Category_Subject_Two() {
  this.itemNo = 0;
  this.layout = '';
  this.timer = null;
  this.maxLength = 2;
  this.init = function () {
    this.addClass();
  };
  this.uploadDom = function (obj, num) {
    var html = '';
    this.layout = obj.layout;
    for (var j = 0; j < this.maxLength; j++) {
      if (obj.elementList[j]) {
        var elementImg = obj.elementList[j].elementImg || ''
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' +
          '<img class="lazyload" src=""  data-img="' + elementImg + '"alt="">'
        if (obj.elementList[j].elementType == '4' && obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="background-color:' + params.bgColor + '">' + '专题' + '</span>'
        } else if (obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="color:' + params.color + ';background-color:' + params.bgColor + '">' + params.name + '</span>'
        }
        html += ' <div class="title"  id=' + 'title_' + num + '_' + j + '>' +
          obj.elementList[j].elementName + '</div>' + '</div>'
      } else {
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' + '<img src="" alt="">' + '</div>'
      }
    };
    var div1 = document.createElement('div');
    div1.className = obj.layout
    div1.id = obj.layout + '-' + num;
    getId('detail').appendChild(div1);
    getId(obj.layout + '-' + num).innerHTML = html
    html = '';
  };
  this.marquee = function (status) {
    var scrollLeft = 0;
    this.timer && clearInterval(this.timer);
    var div = getId('title_' + value.pageNo + '_' + this.itemNo);
    if (!div) return
    if (status == 'add') {
      if (div.innerHTML.length < 26) return
      scrollLeft = div.offsetWidth
      div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
      this.timer = setInterval(function () {
        if (div.offsetWidth + scrollLeft <= (-div.offsetWidth / 2) + 20) {
          scrollLeft = div.offsetWidth;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        } else {
          scrollLeft += -1;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        }
      }, 30);
    } else {
      if (div.innerHTML.length >= 26) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;"
      }
    }
  };
  this.addClass = function () {
    var name = this.layout + '_' + value.pageNo
    addClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee('add');
  };
  this.removeClass = function () {
    var name = this.layout + '_' + value.pageNo
    removeClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee();
  };
  this.up = function () {
    this.removeClass();
    value.itemNo -= 1;
    value.commonUp();
  };
  this.down = function () {
    this.removeClass();
    value.itemNo += 1;
    value.commonDown();
  };
  this.left = function () {
    if (this.itemNo <= 0) return;
    this.removeClass();
    this.itemNo--;
    this.addClass();
  };
  this.right = function () {
    if (this.itemNo >= this.maxLength - 1) return;
    this.removeClass();
    this.itemNo++;
    this.addClass();
  };
  this.enter = function () {
    var twoStageBackUrl = window.location.pathname + '?pageNo=' + value.pageNo + '&menuItemNo=' + topNav.itemNo + '&itemNo=' + this.itemNo;
    var obj = value.detailList[value.pageNo].elementList[this.itemNo];
    if (!obj) return
    // 页面访问储存
    try {
      var jump = {
        parent_page_type: '0101',
        parent_page_id: Cookies.get('cat_id')
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, {
        path: '/'
      })
      // 点击推荐位上报
      var jsonOb = {}
      jsonOb.pos_id = '0' + value.pageNo + '0' + this.itemNo
      jsonOb.recmd_id = ''
      jsonOb.page_type = '0101'
      jsonOb.page_id = Cookies.get('cat_id')
      if (obj.elementType == '4') {
        jsonOb.click_type = '2'
      } else {
        jsonOb.click_type = '1'
      }
      jsonOb.cid = obj.elementId
      bi.jumpRecommend(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }
    if (obj.elementType == '4') {
      Cookies.set("twoStageBackUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });

      // 浙江电信主页跳转到专题页埋点
      console.log('%cZJDX 浙江电信主页跳转到栏目埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: '',
          medianame: ''
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
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }
      var url = "../special/index.html";
      window.location.href = url;
    } else if (obj.elementType == '1') {
      // 浙江电信主页一般推荐位跳转到详情页
      console.log('%cZJDX 浙江电信主页一般推荐位跳转到详情页埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: obj.elementCode,
          medianame: obj.elementName
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

        // if (value.detailList[value.pageNo].elementList[window[value.templateName + value.pageNo].itemNo].layout == 'Detail_Movie') {
        //   type.refer_page_id = '1080HDJTJGMovies-' + '_0' + value.pageNo + '0' + this.itemNo,
        //     type.refer_page_name = '电影'
        // }
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }

      Cookies.set("backUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });
      var url = "../detail/detail.html";
      window.location.href = url;
    } else if (obj.elementType == '8') {
      console.log(obj.jsonUrl)
      window.location.href = obj.jsonUrl + '?userToken=' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg");

      // toast(obj.jsonUrl + '?userToken = ' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg"))

      // window.location.href = obj.jsonUrl + '?userToken = ' + Cookies.get("UserToken") + "&epg_info=" + Cookies.get("epg");
    }
  };
  this.back = function () { };
}

/* 横排 三个模板
JG_Category_Subject_Three  */
function JG_Category_Subject_Three() {
  this.itemNo = 0;
  this.layout = '';
  this.timer = null;
  this.maxLength = 3;
  this.init = function () {
    this.addClass();
  };
  this.uploadDom = function (obj, num) {
    var html = '';
    this.layout = obj.layout;
    for (var j = 0; j < this.maxLength; j++) {
      if (obj.elementList[j]) {
        var elementImg = obj.elementList[j].elementImg || ''
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' +
          '<img class="lazyload" src=""  data-img="' + elementImg + '"alt="">'
        if (obj.elementList[j].elementType == '4' && obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="background-color:' + params.bgColor + '">' + '专题' + '</span>'
        } else if (obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="color:' + params.color + ';background-color:' + params.bgColor + '">' + params.name + '</span>'
        }
        html += ' <div class="title"  id=' + 'title_' + num + '_' + j + '>' +
          obj.elementList[j].elementName + '</div>' + '</div>'
      } else {
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' + '<img src="" alt="">' + '</div>'
      }
    };
    var div1 = document.createElement('div');
    div1.className = obj.layout
    div1.id = obj.layout + '-' + num;
    getId('detail').appendChild(div1);
    getId(obj.layout + '-' + num).innerHTML = html
    html = '';
  };
  this.marquee = function (status) {
    var scrollLeft = 0;
    this.timer && clearInterval(this.timer);
    var div = getId('title_' + value.pageNo + '_' + this.itemNo);
    if (status == 'add') {
      if (div.innerHTML.length < 17) return
      scrollLeft = div.offsetWidth
      div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
      this.timer = setInterval(function () {
        if (scrollLeft <= -div.offsetWidth - 20) {
          scrollLeft = div.offsetWidth;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        } else {
          scrollLeft += -1;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        }
      }, 30);
    } else {
      if (div.innerHTML.length >= 17) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;"
      }
    }
  };
  this.addClass = function () {
    var name = this.layout + '_' + value.pageNo
    addClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee('add')
  };
  this.removeClass = function () {
    var name = this.layout + '_' + value.pageNo
    removeClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee();
  };
  this.up = function () {
    this.removeClass();
    value.itemNo -= 1;
    value.commonUp();
  };
  this.down = function () {
    this.removeClass();
    value.itemNo += 1;
    value.commonDown();
  };
  this.left = function () {
    if (this.itemNo <= 0) return;
    this.removeClass();
    this.itemNo--;
    this.addClass();
  };
  this.right = function () {
    if (this.itemNo >= this.maxLength - 1) return;
    this.removeClass();
    this.itemNo++;
    this.addClass();
  };
  this.enter = function () {
    var twoStageBackUrl = window.location.pathname + '?pageNo=' + value.pageNo + '&menuItemNo=' + topNav.itemNo + '&itemNo=' + this.itemNo;
    var obj = value.detailList[value.pageNo].elementList[this.itemNo];
    if (!obj) return
    // 页面访问储存
    try {
      var jump = {
        parent_page_type: '0101',
        parent_page_id: Cookies.get('cat_id')
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, {
        path: '/'
      })
      // 点击推荐位上报
      var jsonOb = {}
      jsonOb.pos_id = '0' + value.pageNo + '0' + this.itemNo
      jsonOb.recmd_id = ''
      jsonOb.page_type = '0101'
      jsonOb.page_id = Cookies.get('cat_id')
      if (obj.elementType == '4') {
        jsonOb.click_type = '2'
      } else {
        jsonOb.click_type = '1'
      }
      jsonOb.cid = obj.elementId
      bi.jumpRecommend(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }
    if (obj.elementType == '4') {
      Cookies.set("twoStageBackUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });

      // 浙江电信主页跳转到专题页埋点
      console.log('%cZJDX 浙江电信主页跳转到栏目埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: '',
          medianame: ''
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
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }
      var url = "../special/index.html";
      window.location.href = url;
    } else if (obj.elementType == '1') {
      // 浙江电信主页一般推荐位跳转到详情页
      console.log('%cZJDX 浙江电信主页一般推荐位跳转到详情页埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: obj.elementCode,
          medianame: obj.elementName
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

        // if (value.detailList[value.pageNo].elementList[window[value.templateName + value.pageNo].itemNo].layout == 'Detail_Movie') {
        //   type.refer_page_id = '1080HDJTJGMovies-' + '_0' + value.pageNo + '0' + this.itemNo,
        //     type.refer_page_name = '电影'
        // }
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }

      Cookies.set("backUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });
      var url = "../detail/detail.html";
      window.location.href = url;
    } else if (obj.elementType == '8') {
      console.log(obj.jsonUrl)
      window.location.href = obj.jsonUrl + '?userToken=' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg");

      // toast(obj.jsonUrl + '?userToken = ' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg"))
      // window.location.href = obj.jsonUrl + '?userToken=' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg");

      // window.location.href = obj.jsonUrl + '?userToken = ' + Cookies.get("UserToken") + "&epg_info=" + Cookies.get("epg");
    }
  };
  back = function () { };
}
/* 横排 四个模板
JG_Category_Subject_Four  */
function JG_Category_Subject_Four() {
  this.itemNo = 0;
  this.layout = '';
  this.timer = null;
  this.maxLength = 4;
  this.init = function () {
    this.addClass();
  };
  this.uploadDom = function (obj, num) {
    var html = '';
    this.layout = obj.layout;
    for (var j = 0; j < this.maxLength; j++) {
      if (obj.elementList[j]) {
        var elementImg = obj.elementList[j].elementImg || ''
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' +
          '<img class="lazyload" src=""  data-img="' + elementImg + '"alt="">'
        if (obj.elementList[j].elementType == '4' && obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="background-color:' + params.bgColor + '">' + '专题' + '</span>'
        } else if (obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="color:' + params.color + ';background-color:' + params.bgColor + '">' + params.name + '</span>'
        }
        html += ' <div class="title"  id=' + 'title_' + num + '_' + j + '>' +
          obj.elementList[j].elementName + '</div>' + '</div>'
      } else {
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' + '<img src="" alt="">' + '</div>'
      }
    };
    var div1 = document.createElement('div');
    div1.className = obj.layout
    div1.id = obj.layout + '-' + num;
    getId('detail').appendChild(div1);
    getId(obj.layout + '-' + num).innerHTML = html
    html = '';
  };
  this.marquee = function (status) {
    var scrollLeft = 0;
    this.timer && clearInterval(this.timer);
    var div = getId('title_' + value.pageNo + '_' + this.itemNo);
    if (status == 'add') {
      if (div.innerHTML.length < 12) return
      scrollLeft = div.offsetWidth
      div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
      this.timer = setInterval(function () {
        if (scrollLeft <= -div.offsetWidth + 20) {
          scrollLeft = div.offsetWidth;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        } else {
          scrollLeft += -1;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        }
      }, 30);
    } else {
      if (div.innerHTML.length >= 12) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;"
      }
    }
  };
  this.addClass = function () {
    var name = this.layout + '_' + value.pageNo
    addClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee('add');
  };
  this.removeClass = function () {
    var name = this.layout + '_' + value.pageNo
    removeClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee();;
  };
  this.up = function () {
    this.removeClass();
    value.itemNo -= 1;
    value.commonUp();
  };
  this.down = function () {
    this.removeClass();
    value.itemNo += 1;
    value.commonDown();
  };
  this.left = function () {
    if (this.itemNo <= 0) return;
    this.removeClass();
    this.itemNo--;
    this.addClass();
  };
  this.right = function () {
    if (this.itemNo >= this.maxLength - 1) return;
    this.removeClass();
    this.itemNo++;
    this.addClass();
  };
  this.enter = function () {
    var twoStageBackUrl = window.location.pathname + '?pageNo=' + value.pageNo + '&menuItemNo=' + topNav.itemNo + '&itemNo=' + this.itemNo;
    var obj = value.detailList[value.pageNo].elementList[this.itemNo];
    if (!obj) return
    // 页面访问储存
    try {
      var jump = {
        parent_page_type: '0101',
        parent_page_id: Cookies.get('cat_id')
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, {
        path: '/'
      })
      // 点击推荐位上报
      var jsonOb = {}
      jsonOb.pos_id = '0' + value.pageNo + '0' + this.itemNo
      jsonOb.recmd_id = ''
      jsonOb.page_type = '0101'
      jsonOb.page_id = Cookies.get('cat_id')
      if (obj.elementType == '4') {
        jsonOb.click_type = '2'
      } else {
        jsonOb.click_type = '1'
      }
      jsonOb.cid = obj.elementId
      bi.jumpRecommend(jsonOb)
    } catch (error) {
      console.log('埋点错误', error)
    }
    if (obj.elementType == '4') {
      Cookies.set("twoStageBackUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });

      // 浙江电信主页跳转到专题页埋点
      console.log('%cZJDX 浙江电信主页跳转到栏目埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: '',
          medianame: ''
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
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }
      var url = "../special/index.html";
      window.location.href = url;
    } else if (obj.elementType == '1') {
      // 浙江电信主页一般推荐位跳转到详情页
      console.log('%cZJDX 浙江电信主页一般推荐位跳转到详情页埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: obj.elementCode,
          medianame: obj.elementName
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

        // if (value.detailList[value.pageNo].elementList[window[value.templateName + value.pageNo].itemNo].layout == 'Detail_Movie') {
        //   type.refer_page_id = '1080HDJTJGMovies-' + '_0' + value.pageNo + '0' + this.itemNo,
        //     type.refer_page_name = '电影'
        // }
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }

      Cookies.set("backUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });
      var url = "../detail/detail.html";
      window.location.href = url;
    } else if (obj.elementType == "8") {
      console.log(obj.jsonUrl)
      window.location.href = obj.jsonUrl;
    }
  };
  back = function () { };
}
/* 横排 四个模板查看更多 //待验证
JG_Category_All_Episodes  */
function JG_Category_All_Episodes() {
  this.itemNo = 0;
  this.layout = '';
  this.timer = null;
  this.maxLength = 4;
  this.init = function () {
    this.addClass();
  };
  this.uploadDom = function (obj, num) {
    var html = '';
    this.layout = obj.layout;
    for (var j = 0; j < this.maxLength; j++) {
      if (j == 5) {
        // 查看更多
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' +
          '<div class="more">查看更多</div>' +
          '</div>';
      } else if (obj.elementList[j]) {
        var elementImg = obj.elementList[j].elementImg || ''
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' +
          '<img class="lazyload" src=""  data-img="' + elementImg + '"alt="">'
        if (obj.elementList[j].elementType == '4' && obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="background-color:' + params.bgColor + '">' + '专题' + '</span>'
        } else if (obj.elementList[j].superscriptInfo) {
          var params = obj.elementList[j].superscriptInfo;
          html += '<span class="corner" style="color:' + params.color + ';background-color:' + params.bgColor + '">' + params.name + '</span>'
        }
        html += ' <div class="title"  id=' + 'title_' + num + '_' + j + '>' +
          obj.elementList[j].elementName + '</div>' + '</div>'
      } else {
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + j + '>' + '<img src="" alt="">' + '</div>'
      }
    };
    var div1 = document.createElement('div');
    div1.className = obj.layout
    div1.id = obj.layout + '-' + num;
    getId('detail').appendChild(div1);
    getId(obj.layout + '-' + num).innerHTML = html
    html = '';
  };
  this.marquee = function (status) {
    var scrollLeft = 0;
    this.timer && clearInterval(this.timer);
    var div = getId('title_' + value.pageNo + '_' + this.itemNo);
    if (status == 'add') {
      if (div.innerHTML.length < 12) return
      scrollLeft = div.offsetWidth
      div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
      this.timer = setInterval(function () {
        if (scrollLeft <= -div.offsetWidth + 20) {
          scrollLeft = div.offsetWidth;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        } else {
          scrollLeft += -1;
          div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;text-overflow: clip;"
        }
      }, 30);
    } else {
      if (div.innerHTML.length >= 12) {
        scrollLeft = 0;
        div.style.cssText = "text-indent: " + scrollLeft + "px;text-align: center;"
      }
    }
  };
  this.addClass = function () {
    var name = this.layout + '_' + value.pageNo
    addClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee('add');
  };
  this.removeClass = function () {
    var name = this.layout + '_' + value.pageNo
    removeClass(getId(name + '_' + this.itemNo), 'hover');
    this.marquee();
  };
  this.up = function () {
    this.removeClass();
    value.itemNo -= 1;
    value.commonUp();
  };
  this.down = function () {
    this.removeClass();
    value.itemNo += 1;
    value.commonDown();
  };
  this.left = function () {
    if (this.itemNo <= 0) return;
    this.removeClass();
    this.itemNo--;
    this.addClass();
  };
  this.right = function () {
    if (this.itemNo >= this.maxLength - 1) return;
    this.removeClass();
    this.itemNo++;
    this.addClass();
  };
  this.enter = function () {
    var twoStageBackUrl = window.location.pathname + '?pageNo=' + value.pageNo + '&menuItemNo=' + topNav.itemNo + '&itemNo=' + this.itemNo;
    var obj = value.detailList[value.pageNo].elementList[this.itemNo];
    if (!obj && this.itemNo > this.maxLength - 1) return
    // 页面访问储存
    try {
      var jump = {
        parent_page_type: '0101',
        parent_page_id: Cookies.get('cat_id')
      }
      jump = JSON.stringify(jump)
      Cookies.set('jump', jump, {
        path: '/'
      })
      // 点击推荐位上报
      var jsonOb = {}
      jsonOb.pos_id = '0' + value.pageNo + '0' + this.itemNo
      jsonOb.recmd_id = ''
      jsonOb.page_type = '0101'
      jsonOb.page_id = Cookies.get('cat_id')
      if (obj.elementType == '4') {
        jsonOb.click_type = '2'
      } else {
        jsonOb.click_type = '1'
      }
      jsonOb.cid = obj.elementId
      if (this.itemNo != this.maxLength - 1) {
        bi.jumpRecommend(jsonOb)
      }
    } catch (error) {
      console.log('埋点错误', error)
    }

    if (this.itemNo == this.maxLength - 1) {
      var catCode = 'all';
      var categoryId = '';
      console.log(value.navData.catList[topNav.itemNo].catCode);
      // 查询elementId
      for (var i = 0; i < value.detailList[value.pageNo].elementList.length; i++) {
        var params = value.detailList[value.pageNo].elementList[i]
        if (params.elementType == '7') {
          categoryId = params.elementId;
          catCode = params.elementCode;
        }
      }
      Cookies.set("twoStageBackUrl", twoStageBackUrl, {
        path: '/'
      });
      jump.parent_page_type = '0101'
      jump.parent_page_id = '102-1'
      jump = JSON.stringify(jump);
      if (catCode == 'all') {
        window.location.href = "../filter/filter.html?catCode=all"
      } else {
        window.location.href = "../filter/filter.html?catCode=" + catCode + '&categoryId=' + categoryId
      }
    } else if (obj.elementType == '4') {
      Cookies.set("twoStageBackUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });

      // 浙江电信主页跳转到专题页埋点
      console.log('%cZJDX 浙江电信主页跳转到栏目埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: '',
          medianame: ''
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
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }
      var url = "../special/index.html";
      window.location.href = url;
    } else if (obj.elementType == '1') {
      // 浙江电信主页一般推荐位跳转到详情页
      console.log('%cZJDX 浙江电信主页一般推荐位跳转到详情页埋点', 'color: #4169E1')
      try {
        var type = {
          page_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_id: '1080HDJTJG' + value.navData.catList[topNav.itemNo].catCode + '-000' + topNav.itemNo + '_0' + value.pageNo + '0' + this.itemNo,
          refer_pos_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_page_id: Cookies.get('refer_page_id'),
          refer_page_name: '1080高清极光' + value.navData.catList[topNav.itemNo].catName + '_0' + value.pageNo + '0' + this.itemNo,

          refer_type: '6',
          refer_parent_id: '',

          mediacode: obj.elementCode,
          medianame: obj.elementName
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

        // if (value.detailList[value.pageNo].elementList[window[value.templateName + value.pageNo].itemNo].layout == 'Detail_Movie') {
        //   type.refer_page_id = '1080HDJTJGMovies-' + '_0' + value.pageNo + '0' + this.itemNo,
        //     type.refer_page_name = '电影'
        // }
        ZJDXlog.browsing(type)
      } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
      }

      Cookies.set("backUrl", twoStageBackUrl, {
        path: '/'
      });
      Cookies.set("detailUrl", obj.jsonUrl, {
        path: '/'
      });
      var url = "../detail/detail.html";
      window.location.href = url;
    } else if (obj.elementType == '8') {
      console.log(obj.jsonUrl)
      // toast(obj.jsonUrl + '?userToken=' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg"))

      window.location.href = obj.jsonUrl + '?userToken=' + encodeURIComponent(Cookies.get("UserToken")) + "&epg_info=" + Cookies.get("epg");
    }
  };
  back = function () { };
}
/* 横排6个 极光筛选条件
JG_Category_Two_Level_List_Page_Tag  */
function JG_Category_Two_Level_List_Page_Tag() {
  this.itemNo = 0;
  this.layout = '';
  this.maxLength = 7;
  this.init = function () {
    this.addClass();
  };
  this.uploadDom = function (obj, num) {
    var html = '';
    this.layout = obj.layout;
    for (var j = 0; j < this.maxLength; j++) {
      if (j == 0) {
        // 查看更多
        html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + 0 + '>' +
          '全部' + '</div>'
      } else {
        if (obj.elementList[j - 1]) {
          html += '<div class="asset-item" id=' + obj.layout + '_' + num + '_' + (j) + '>' +
            obj.elementList[j - 1].elementName + '</div>'
        }
      }
    };
    var div1 = document.createElement('div');
    div1.className = obj.layout
    div1.id = obj.layout + '-' + num;
    getId('detail').appendChild(div1);
    getId(obj.layout + '-' + num).innerHTML = html
    html = '';
  };
  this.addClass = function () {
    var name = this.layout + '_' + value.pageNo
    addClass(getId(name + '_' + this.itemNo), 'hover');
  };
  this.removeClass = function () {
    var name = this.layout + '_' + value.pageNo
    removeClass(getId(name + '_' + this.itemNo), 'hover');
  };
  this.up = function () {
    this.removeClass();
    value.itemNo -= 1;
    value.commonUp();
  };
  this.down = function () {
    this.removeClass();
    value.itemNo += 1;
    value.commonDown();
  };
  this.left = function () {
    if (this.itemNo <= 0) return;
    this.removeClass();
    this.itemNo--;
    this.addClass();
  };
  this.right = function () {
    if (this.itemNo >= 6) return;
    this.removeClass();
    this.itemNo++;
    this.addClass();
  };
  this.enter = function () {
    var obj = value.detailList[value.pageNo].elementList[this.itemNo - 1];
    var twoStageBackUrl = window.location.pathname + '?pageNo=' + value.pageNo + '&menuItemNo=' + topNav.itemNo + '&itemNo=' + (this.itemNo);
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
    var catCode = ''
    try {
      catCode = value.navData.catList[topNav.itemNo].catCode
    } catch (error) {
      catCode = 'all'
    }
    if (this.itemNo == 0) {
      //全部
      // window.location.href = "../filter/filter.html?catCode=all"
      window.location.href = "../filter/filter.html?catCode=" + catCode
    } else {
      // window.location.href = "../filter/filter.html?catCode=" + obj.elementCode + '&categoryId=' + obj.elementId
      window.location.href = "../filter/filter.html?catCode=" + catCode + '&categoryId=' + obj.elementId
    }
  };
  this.back = function () { };
}
