var search = {}
search.pos = 1 // 区别焦点区域 0删除 1键盘 2热搜 3搜索内容 
search.input = ''
search.keyCodeList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
search.id = 0

search.hot = 0
search.hotList = []

search.totalNum = 0 // 总个数
search.totalPage = 0 // 总页数
search.pnum = 0 // 当前个数
search.pindex = 0 // 当前页数
search.searchList = []

search.searchListLi = ''

// 焦点样式添加
search.addClass = function () {
  if (search.pos == 0) {
    getId('keyboard-delete').setAttribute('class', 'keyboard-delete select')
  } else if (search.pos == 1) {
    getId('keyboard-content').children[search.id].setAttribute('class', 'select')
  } else if (search.pos == 2) {
    getId('hot-list').children[search.hot].setAttribute('class', 'select')
    if (getClass('hot-title')[search.hot + 1].scrollWidth > getClass('hot-title')[search.hot + 1].offsetWidth) {
      getClass('hot-title')[search.hot + 1].innerHTML = '<marquee scrollamount="4">' + getClass('hot-title')[search.hot + 1].innerHTML + '</marquee>'
    }
  } else if (search.pos == 3) {
    getId('list').children[search.pnum].setAttribute('class', 'select')
    if (getClass('list-title')[search.pnum].scrollWidth > getClass('list-title')[search.pnum].offsetWidth) {
      getClass('list-title')[search.pnum].innerHTML = '<marquee scrollamount="4">' + getClass('list-title')[search.pnum].innerHTML + '</marquee>'
    }
  }
}

// 焦点样式删除
search.removeClass = function () {
  if (search.pos == 0) {
    getId('keyboard-delete').setAttribute('class', 'keyboard-delete')
  } else if (search.pos == 1) {
    getId('keyboard-content').children[search.id].setAttribute('class', '')
  } else if (search.pos == 2) {
    getId('hot-list').children[search.hot].setAttribute('class', '')
    if (getClass('hot-title')[search.hot + 1].innerHTML.indexOf('marquee') != -1) {
      var str = getClass('hot-title')[search.hot + 1].innerHTML
      getClass('hot-title')[search.hot + 1].innerHTML = str.replace('<marquee scrollamount="4">', '').replace('</marquee>', '')
    }
  } else if (search.pos == 3) {
    getId('list').children[search.pnum].setAttribute('class', '')
    if (getClass('list-title')[search.pnum].innerHTML.indexOf('marquee') != -1) {
      var str = getClass('list-title')[search.pnum].innerHTML
      getClass('list-title')[search.pnum].innerHTML = str.replace('<marquee scrollamount="4">', '').replace('</marquee>', '')
    }
  }
}

// 滑块定位
search.slider = function () {
  if (search.pindex == 0) {
    if (search.pindex + 1 < search.totalPage) {
      getClass('up')[0].style.display = 'none'
      if (search.pindex + 1 < search.totalPage) {
        getClass('down')[0].style.display = 'block'
      }
    } else {
      getClass('up')[0].style.display = 'none'
      getClass('down')[0].style.display = 'none'
    }
  } else {
    if (search.pindex + 1 < search.totalPage) {
      getClass('up')[0].style.display = 'block'
      getClass('down')[0].style.display = 'block'
    } else {
      getClass('up')[0].style.display = 'block'
      getClass('down')[0].style.display = 'none'
    }
  }
  // if (getId('list').innerHTML == '<div id="no">暂无内容</div>') {
  //   getClass('scroll')[0].style.display = 'none'
  // } else {
  //   getClass('scroll')[0].style.display = 'block'
  // }
}

// 页数定位
search.sliderNum = function () {
  getClass('bar-inside')[0].style.height = 542 / (search.totalPage) + 'px'
  getClass('bar-inside')[0].style.top = (542 / search.totalPage) * search.pindex + 'px'
  getClass('scroll-num')[0].innerHTML = (search.pindex + 1) + '/' + (search.totalPage)
}

// 上
search.up = function () {
  if (search.pos == 0) {
    return
  } else if (search.pos == 1) {
    if (search.id > 5) {
      search.removeClass()
      search.id -= 6
      search.addClass()
    } else {
      search.removeClass()
      search.pos = 0
      search.addClass()
    }
  } else if (search.pos == 3) {
    if (search.pindex > 0) {
      if (search.pnum < 4) {
        search.removeClass()
        search.pnum = 0
        search.pindex -= 1
        // 加载上一页数据
        searchList(getId('keyboard-input').innerHTML, search.pindex)
      } else {
        search.removeClass()
        search.pnum -= 4
        search.addClass()
      }
    } else {
      if (search.pnum > 3) {
        search.removeClass()
        search.pnum -= 4
        search.addClass()
      }
    }
  }
}

// 下
search.down = function () {
  if (search.pos == 0) {
    search.removeClass()
    search.pos = 1
    search.addClass()
  } else if (search.pos == 1) {
    if (search.id < 30) {
      search.removeClass()
      search.id += 6
      search.addClass()
    }
  } else if (search.pos == 3) {
    if (search.pindex + 1 < search.totalPage) {
      if (search.pnum % 8 < 4) {
        search.removeClass()
        search.pnum += 4
        search.addClass()
      } else {
        search.removeClass()
        search.pnum = 0
        search.pindex += 1
        // 加载下一页数据
        searchList(getId('keyboard-input').innerHTML, search.pindex)
      }
    } else {
      if (search.totalNum % 8 == 0) {
        if (search.pnum + 4 < search.totalNum % 8 + 8) {
          search.removeClass()
          search.pnum += 4
          search.addClass()
        }
      } else {
        if (search.pnum + 4 < search.totalNum % 8) {
          search.removeClass()
          search.pnum += 4
          search.addClass()
        }
      }
    }
  }
}

// 左
search.left = function () {
  if (search.pos == 1) {
    if (search.id % 6 > 0) {
      search.removeClass()
      search.id -= 1
      search.addClass()
    }
  } else if (search.pos == 2) {
    if (search.hot == 0) {
      search.removeClass()
      search.pos -= 1
      search.addClass()
    } else {
      search.removeClass()
      search.hot -= 1
      search.addClass()
    }
  } else if (search.pos == 3) {
    if (search.pnum % 4 == 0) {
      search.removeClass()
      search.pos -= 2
      search.addClass()
    } else {
      search.removeClass()
      search.pnum -= 1
      search.addClass()
    }
  }
}

// 右
search.right = function () {
  if (search.pos == 0) {
    if (getId('list').innerHTML == '<div id="no">暂无内容</div>') {
      return
    }
    if (getId('keyboard-input').innerHTML == '') {
      search.removeClass()
      search.pos += 2
      search.addClass()
    } else {
      search.removeClass()
      search.pos += 3
      search.addClass()
    }
  } else if (search.pos == 1) {
    if (search.id % 6 < 5) {
      search.removeClass()
      search.id += 1
      search.addClass()
    } else {
      if (getId('list').innerHTML == '<div id="no">暂无内容</div>') {
        return
      }
      if (getId('keyboard-input').innerHTML == '') {
        search.removeClass()
        search.pos += 1
        search.addClass()
      } else {
        search.removeClass()
        search.pos += 2
        search.addClass()
      }
    }
  } else if (search.pos == 2) {
    if (search.hot < 3) {
      search.removeClass()
      search.hot += 1
      search.addClass()
    }
  } else if (search.pos == 3) {
    if (search.pindex + 1 < search.totalPage) {
      if (search.pnum % 4 != 3) {
        search.removeClass()
        search.pnum += 1
        search.addClass()
      }
    } else {
      if (search.totalNum % 8 == 0) {
        if (search.pnum != 3 && search.pnum + 1 < search.totalNum % 8 + 8) {
          search.removeClass()
          search.pnum += 1
          search.addClass()
        } else if (search.pnum + 1 > 4 && search.pnum + 1 < search.totalNum % 8 + 8) {
          search.removeClass()
          search.pnum += 1
          search.addClass()
        }
      } else {
        if (search.pnum != 3 && search.pnum + 1 < search.totalNum % 8) {
          search.removeClass()
          search.pnum += 1
          search.addClass()
        } else if (search.pnum + 1 > 4 && search.pnum + 1 < search.totalNum % 8) {
          search.removeClass()
          search.pnum += 1
          search.addClass()
        }
      }
    }
  }
}

// 确认
search.enter = function () {

  if (search.pos == 0) {
    search.input = getId('keyboard-input').innerHTML
    if (search.input != '') {
      getId('keyboard-input').innerHTML = search.input.substr(0, search.input.length - 1)
      search.searchListLi = ''
      search.pindex = 0
      search.pnum = 0
      if (search.input.length < 2) {
        getClass('hot')[0].style.display = 'block'
        getClass('content')[0].style.display = 'none'
        getClass('scroll')[0].style.display = 'none'
        // 隐藏箭头
        getClass('up')[0].style.display = 'none'
        getClass('down')[0].style.display = 'none'
        search.hotAsset()
        search.sliderNum()
      } else {
        searchList(getId('keyboard-input').innerHTML, search.pindex)
      }
    }
  } else if (search.pos == 1) {
    search.input = getId('keyboard-input').innerHTML
    var add = getId('keyboard-content').children[search.id].innerHTML
    getId('keyboard-input').innerHTML = search.input + add
    search.slider()
    // 热搜隐藏
    getClass('hot')[0].style.display = 'none'
    getClass('content')[0].style.display = 'block'
    getClass('scroll')[0].style.display = 'block'

    search.searchListLi = ''
    search.pindex = 0
    search.pnum = 0
    searchList(getId('keyboard-input').innerHTML, search.pindex)
  } else if (search.pos == 2) {
    search.input = getId('keyboard-input').innerHTML
    var backUrl = '../search/search.html?pos=' + search.pos + '&input=' + search.input + '&id=' + search.id + '&hot=' + search.hot + '&pnum=' + search.pnum + '&pindex=' + search.pindex
    var detailUrl = search.hotAsset[search.hot].jsonUrl
    Cookies.set("backUrl", backUrl, { path: '/' })
    Cookies.set("detailUrl", detailUrl, { path: '/' })

    // 浙江电信索页跳转到详情页埋点
    console.log('%cZJDX 浙江电信索页跳转到详情页埋点', 'color: #4169E1')
    try {
      var type = {
        page_id: 'detail.html',
        page_name: '',
        refer_pos_id: '',
        refer_pos_name: '',

        refer_page_id: 'search.html',
        refer_page_name: '',

        refer_type: '8',
        refer_parent_id: '',

        mediacode: search.hotAsset[search.hot].elementId,
        medianame: search.hotAsset[search.hot].elementName
      }
      ZJDXlog.browsing(type)
    } catch (error) {
      console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
    }
    window.location.href = '../detail/detail.html'
  } else if (search.pos == 3) {
    search.input = getId('keyboard-input').innerHTML
    var backUrl = '../search/search.html?pos=' + search.pos + '&input=' + search.input + '&id=' + search.id + '&hot=' + search.hot + '&pnum=' + search.pnum + '&pindex=' + search.pindex
    var detailUrl = getId('list').children[search.pnum].getAttribute('jsonurl')
    Cookies.set("backUrl", backUrl, { path: '/' })
    Cookies.set("detailUrl", detailUrl, { path: '/' })

    // 浙江电信索页跳转到详情页埋点
    console.log('%cZJDX 浙江电信索页跳转到详情页埋点', 'color: #4169E1')
    try {
      var type = {
        page_id: 'detail.html',
        page_name: '',
        refer_pos_id: '',
        refer_pos_name: '',

        refer_page_id: 'search.html',
        refer_page_name: '',

        refer_type: '8',
        refer_parent_id: '',

        mediacode: search.searchList[search.pnum].elementId,
        medianame: search.searchList[search.pnum].elementName
      }
      ZJDXlog.browsing(type)
    } catch (error) {
      console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
    }
    window.location.href = '../detail/detail.html'
  }
}

// 返回
search.back = function () {
  var twoStageBackUrl = Cookies.get("twoStageBackUrl", { path: '/' })
  window.location.href = twoStageBackUrl
}

// 上一页
search.next = function () {
  if (search.pos == 3 && search.pindex > 0) {
    search.removeClass()
    search.pnum = 0
    search.pindex -= 1
    // 加载上一页数据
    searchList(getId('keyboard-input').innerHTML, search.pindex)
  }
}

// 下一页
search.prev = function () {
  if (search.pos == 3 && search.pindex + 1 < search.totalPage) {
    search.removeClass()
    search.pnum = 0
    search.pindex += 1
    // 加载下一页数据
    searchList(getId('keyboard-input').innerHTML, search.pindex)
  }
}

// 热搜初始化
search.hotAsset = function () {
  var url = baseUrl + 'p=yhSearchRecommend&k=1&v=1&categoryLimit=all'
  $.ajax({
    type: 'GET',
    url: url + '&returnType=jsonp',
    dataType: "jsonp",
    jsonpCallback: 'jsonpCallback',
    success: function (res) {
      console.log('%c热搜结果', 'color: #4169E1', res)
      search.hotAsset = res.data.hotAssetList
      var hotList = ''
      for (var i = 0; i < 4; i++) {
        hotList += '<li jsonUrl="' + search.hotAsset[i].jsonUrl + '"><div class="hot-img" style="background-image: url(' + search.hotAsset[i].elementImg + ')"></div><div class="hot-title">' + search.hotAsset[i].elementName + '</div></li>'
        getId('hot-list').innerHTML = hotList
      }
    },
    error: function (err) {
      console.log(err)
    }
  })
}

// 查询搜索结果
searchList = function (word, pindex) {
  console.log('%c' + word, 'color: blue')
  var url = baseUrl + 'p=yhSearch&k=1&v=1&searchType=all&word=' + word + '&pindex=' + pindex * 8 + '&psize=8&categoryLimit=all'
  console.log(url)
  getSearchList(url,
    function (res) {
      console.log('%c搜索结果', 'color: #4169E1', res)
      search.totalNum = res.data[0].resultNum
      search.totalPage = Math.ceil(search.totalNum / 8)
      search.searchList = res.data[0].resultList

      search.searchListLi = ''
      for (var i = 0; i < search.searchList.length; i++) {
        // search.searchListLi += '<li jsonUrl="' + search.searchList[i].jsonUrl + '"><div class="list-img" style="background-image: url(' + search.searchList[i].elementImg + ')"><div class="list-vip">' + search.searchList[i].score + '</div></div><div class="list-title">' + search.searchList[i].elementName + '</div></li>'
        search.searchListLi += '<li jsonUrl="' + search.searchList[i].jsonUrl + '"><img class="list-img" src="' + search.searchList[i].elementImg + '"><div class="list-vip">' + search.searchList[i].score + '</div><div class="list-title">' + search.searchList[i].elementName + '</div></li>'
      }
      if (search.searchListLi == '') {
        search.searchListLi = '<div id="no">暂无内容</div>'
        getClass('scroll')[0].style.display = 'none'
      } else {
        getClass('scroll')[0].style.display = 'block'
      }
      if (search.totalNum == 1) {
        getClass('scroll')[0].style.display = 'none'
      }
      getId('list').innerHTML = search.searchListLi
      search.addClass()
      search.slider()
      search.sliderNum()
    }, function (err) {
      console.log(err)
    }
  )
}

// 模块内初始化方法
search.init = function (state) {
  areaObj = search
  var pos = getParam('pos')
  var input = getParam('input')
  var id = getParam('id')
  var hot = getParam('hot')
  var pnum = getParam('pnum')
  var pindex = getParam('pindex')

  if (input) {
    search.pos = parseInt(pos)
    search.input = input
    search.id = parseInt(id)
    search.hot = parseInt(hot)
    search.pnum = parseInt(pnum)
    search.pindex = parseInt(pindex)
    searchList(input, pindex)
    getClass('hot')[0].style.display = 'none'
    getClass('content')[0].style.display = 'block'
    getClass('scroll')[0].style.display = 'block'
    getId('keyboard-input').innerHTML = search.input

    var div = ''
    for (var i = 0; i < search.keyCodeList.length; i++) {
      div += '<li>' + search.keyCodeList[i] + '</li>'
    }
    getId('keyboard-content').innerHTML = div
    // getId('keyboard-content').children[search.id].setAttribute('class', 'select')
  } else {
    search.hotAsset()
    search.sliderNum()

    var div = ''
    for (var i = 0; i < search.keyCodeList.length; i++) {
      div += '<li>' + search.keyCodeList[i] + '</li>'
    }

    getId('keyboard-content').innerHTML = div
    getId('keyboard-content').children[0].setAttribute('class', 'select')
  }
  var jump = Cookies.get('jump')
  if (jump) {
    jump = JSON.parse(jump)
    try {
      var jsonOb = {}
      jsonOb.page_type = '0301'
      jsonOb.page_id = ''
      jsonOb.parent_page_type = jump.parent_page_type
      jsonOb.parent_page_id = jump.parent_page_id
      bi.jump(jsonOb)
      Cookies.set('jump', '', {
        path: '/'
      })
    } catch (error) {
      console.log('埋点错误', error)
    }
  }
}

// 页面初始化方法
function init() {
  search.init()
}
init()

onKeyPress = function (keyCode) {
  switch (keyCode) {
    case "up": //上边
      areaObj.up()
      break
    case "down": //下边
      areaObj.down()
      break
    case "left": //左边
      areaObj.left()
      break
    case "right": //右边
      areaObj.right()
      break
    case "back":
      areaObj.back()
      break
    case "enter":
      areaObj.enter()
      break
    case "home":
      areaObj.home()
      break
    case "keyUp":
      areaObj.next()
      break
    case "keyDown":
      areaObj.prev()
      break
  }
};
//事件绑定
document.onkeydown = grepEvent

// 浙江电信搜索页上报心跳埋点
console.log('%cZJDX 浙江电信搜索页上报心跳埋点', 'color: #4169E1')
try {
  var type = {
    page_id: 'search.html',
    page_name: '',
    refer_pos_id: '',
    refer_pos_name: '',

    refer_page_id: 'search.html',
    refer_page_name: '',

    refer_type: '8',
    refer_parent_id: '',

    mediacode: '',
    medianame: '',

    type: 0
  }
  ZJDXlog.timeStart(type)
} catch (error) {
  console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
}