var filter = {}
filter.pos = 1 // 区别焦点区域 0位收缩展开筛选 1234位筛选区域 5结果区域

filter.item0 = 1
filter.item1 = 1

filter.itemNo0 = 0
filter.itemNo1 = 0
filter.itemNo2 = 0
filter.itemNo3 = 0
filter.itemNo4 = 0
filter.fliterList0 = getId('filter-0').children //[]
filter.fliterList1 = getId('filter-1').children //[]
filter.fliterList2 = getId('filter-2').children //[]
filter.fliterList3 = getId('filter-3').children //[]
filter.fliterList4 = getId('filter-4').children //[]

filter.totalPage = Math.ceil(getId('list').children.length / 8) //0 // 总页数
filter.totalNum = getId('list').children.length //0 // 总个数
filter.pindex = 0 // 当前页数
filter.pnum = 0 // 当前个数
filter.searchList = []

filter.searchListLi = ''

filter.catCode = ''
filter.catgory = ''
filter.content = ''
filter.areaID = ''
filter.year = ''
filter.sortType = 1
filter.vip = 1

// 焦点添加样式
filter.addClass = function () {
  if (filter.pos == 0) {
    getId('filter-0').children[filter.itemNo0].setAttribute('class', 'select hover')
  } else if (filter.pos == 1) {
    getId('filter-1').children[filter.itemNo1].setAttribute('class', 'select hover')
  } else if (filter.pos == 2) {
    getId('filter-2').children[filter.itemNo2].setAttribute('class', 'select hover')
  } else if (filter.pos == 3) {
    getId('filter-3').children[filter.itemNo3].setAttribute('class', 'select hover')
  } else if (filter.pos == 4) {
    getId('filter-4').children[filter.itemNo4].setAttribute('class', 'select hover')
  } else if (filter.pos == 5) {
    getId('list').children[filter.pnum].setAttribute('class', 'select')
    if (getClass('list-title')[filter.pnum].scrollWidth > getClass('list-title')[filter.pnum].offsetWidth) {
      getClass('list-title')[filter.pnum].innerHTML = '<marquee scrollamount="4">' + getClass('list-title')[filter.pnum].innerHTML + '</marquee>'
    }
  }
}

// 焦点删除样式
filter.removeClass = function () {
  if (filter.pos == 0) {
    getId('filter-0').children[filter.itemNo0].setAttribute('class', '')
    getId('filter-1').children[filter.itemNo1].setAttribute('class', 'hover')
  } else if (filter.pos == 1) {
    getId('filter-0').children[filter.itemNo0].setAttribute('class', '')
    getId('filter-1').children[filter.itemNo1].setAttribute('class', '')
    getId('filter-2').children[filter.itemNo2].setAttribute('class', 'hover')
  } else if (filter.pos == 2) {
    getId('filter-1').children[filter.itemNo1].setAttribute('class', 'hover')
    getId('filter-2').children[filter.itemNo2].setAttribute('class', '')
    getId('filter-3').children[filter.itemNo3].setAttribute('class', 'hover')
  } else if (filter.pos == 3) {
    getId('filter-2').children[filter.itemNo2].setAttribute('class', 'hover')
    getId('filter-3').children[filter.itemNo3].setAttribute('class', '')
    getId('filter-4').children[filter.itemNo4].setAttribute('class', 'hover')
  } else if (filter.pos == 4) {
    getId('filter-3').children[filter.itemNo3].setAttribute('class', 'hover')
    getId('filter-4').children[filter.itemNo4].setAttribute('class', '')
    getId('list').children[filter.pnum].setAttribute('class', 'hover')
  } else if (filter.pos == 5) {
    getId('filter-4').children[filter.itemNo4].setAttribute('class', 'hover')
    getId('list').children[filter.pnum].setAttribute('class', '')
    if (getClass('list-title')[filter.pnum].innerHTML.indexOf('marquee') != -1) {
      var str = getClass('list-title')[filter.pnum].innerHTML
      getClass('list-title')[filter.pnum].innerHTML = str.replace('<marquee scrollamount="4">', '').replace('</marquee>', '')
    }
  }
}

// 滑块定位
filter.slider = function () {
  getId('filter-1').children[filter.itemNo1].setAttribute('class', 'hover')
  getId('filter-2').children[filter.itemNo2].setAttribute('class', 'hover')
  getId('filter-3').children[filter.itemNo3].setAttribute('class', 'hover')
  getId('filter-4').children[filter.itemNo4].setAttribute('class', 'hover')

  getId('filter-0').style.top = 166 - filter.itemNo0 * 56 + 'px'
  getId('filter-1').style.top = 178 - filter.itemNo1 * 52 + 'px'
  getId('filter-2').style.top = 178 - filter.itemNo2 * 52 + 'px'
  getId('filter-3').style.top = 178 - filter.itemNo3 * 52 + 'px'
  getId('filter-4').style.top = 178 - filter.itemNo4 * 52 + 'px'


  if (filter.pindex == 0) {
    if (filter.pindex + 1 < filter.totalPage) {
      getClass('up')[0].style.display = 'none'
      if (filter.pindex + 1 < filter.totalPage) {
        getClass('down')[0].style.display = 'block'
      }
    } else {
      getClass('up')[0].style.display = 'none'
      getClass('down')[0].style.display = 'none'
    }
  } else {
    if (filter.pindex + 1 < filter.totalPage) {
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
filter.sliderNum = function () {
  getClass('bar-inside')[0].style.height = 542 / (filter.totalPage) + 'px'
  getClass('bar-inside')[0].style.top = (542 / filter.totalPage) * filter.pindex + 'px'
  getClass('scroll-num')[0].innerHTML = (filter.pindex + 1) + '/' + (filter.totalPage)
}

// 上
filter.up = function (params) {
  if (filter.pos == 0) {
    if (this.itemNo0 == 0) return
    filter.removeClass()
    this.itemNo0--
    filter.catCode = getId('filter-0').children[filter.itemNo0].getAttribute('categoryid')
    if (filter.catCode == null) {
      filter.catCode = ''
    }
    filter.content = ''
    filter.areaID = ''
    filter.year = ''
    filter.sortType = 5
    filter.pindex = 0 // 当前页数
    filter.pnum = 0 // 当前个数
    filter.itemNo1 = 0
    filter.itemNo2 = 0
    filter.itemNo3 = 0
    filter.itemNo4 = 0

    filter.addClass()
    filter.getFilter()
    filter.slider()
    setTimeout(function () {
      getFilterList()
    }, 1000)
  } else if (filter.pos == 1) {
    if (this.itemNo1 == 0) return
    filter.removeClass()
    this.itemNo1--
    filter.content = getId('filter-1').children[filter.itemNo1].getAttribute('categoryid')
    if (filter.content == null) {
      filter.content = ''
    }
    filter.pindex = 0 // 当前页数
    filter.pnum = 0 // 当前个数
    filter.slider()
    filter.addClass()
    getFilterList()
  } else if (filter.pos == 2) {
    if (this.itemNo2 == 0) return
    filter.removeClass()
    this.itemNo2--
    filter.areaID = getId('filter-2').children[filter.itemNo2].getAttribute('categoryid')
    if (filter.areaID == null) {
      filter.areaID = ''
    }
    filter.pindex = 0 // 当前页数
    filter.pnum = 0 // 当前个数
    filter.slider()
    filter.addClass()
    getFilterList()
  } else if (filter.pos == 3) {
    if (this.itemNo3 == 0) return
    filter.removeClass()
    this.itemNo3--
    filter.year = getId('filter-3').children[filter.itemNo3].getAttribute('categoryid')
    if (filter.year == null) {
      filter.year = ''
    }
    filter.pindex = 0 // 当前页数
    filter.pnum = 0 // 当前个数
    filter.slider()
    filter.addClass()
    getFilterList()
  } else if (filter.pos == 4) {
    if (this.itemNo4 == 0) return
    filter.removeClass()
    this.itemNo4--
    filter.sortType = getId('filter-4').children[filter.itemNo4].getAttribute('categoryid')
    if (filter.sortType == null) {
      filter.sortType = 5
    }
    filter.pindex = 0 // 当前页数
    filter.pnum = 0 // 当前个数
    filter.slider()
    filter.addClass()
    getFilterList()
  } else if (filter.pos == 5) {
    if (filter.pindex > 0) {
      if (filter.pnum < 4) {
        filter.removeClass()
        filter.pnum = 0
        filter.pindex -= 1
        // 加载上一页数据
        getFilterList()
      } else {
        filter.removeClass()
        filter.pnum -= 4
        filter.addClass()
      }
    } else {
      if (filter.pnum > 3) {
        filter.removeClass()
        filter.pnum -= 4
        filter.addClass()
      }
    }
  }
}

// 下
filter.down = function () {
  if (filter.pos == 0) {
    if (this.itemNo0 + 1 >= filter.fliterList0.length) {
      return
    }
    filter.removeClass()
    this.itemNo0++
    filter.catCode = getId('filter-0').children[filter.itemNo0].getAttribute('categoryid')
    if (filter.catCode == null) {
      filter.catCode = ''
    }
    filter.content = ''
    filter.areaID = ''
    filter.year = ''
    filter.sortType = 5
    filter.pindex = 0 // 当前页数
    filter.pnum = 0 // 当前个数
    filter.itemNo1 = 0
    filter.itemNo2 = 0
    filter.itemNo3 = 0
    filter.itemNo4 = 0

    filter.addClass()
    filter.getFilter()
    filter.slider()
    setTimeout(function () {
      getFilterList()
    }, 1000)

  } else if (filter.pos == 1) {
    if (this.itemNo1 + 1 >= filter.fliterList1.length) return
    filter.removeClass()
    this.itemNo1++
    filter.content = getId('filter-1').children[filter.itemNo1].getAttribute('categoryid')
    if (filter.content == null) {
      filter.content = ''
    }
    filter.pindex = 0 // 当前页数
    filter.pnum = 0 // 当前个数
    filter.slider()
    filter.addClass()
    getFilterList()
  } else if (filter.pos == 2) {
    if (this.itemNo2 + 1 >= filter.fliterList2.length) return
    filter.removeClass()
    this.itemNo2++
    filter.areaID = getId('filter-2').children[filter.itemNo2].getAttribute('categoryid')
    if (filter.areaID == null) {
      filter.areaID = ''
    }
    filter.pindex = 0 // 当前页数
    filter.pnum = 0 // 当前个数
    filter.slider()
    filter.addClass()
    getFilterList()
  } else if (filter.pos == 3) {
    if (this.itemNo3 + 1 >= filter.fliterList3.length) return
    filter.removeClass()
    this.itemNo3++
    filter.year = getId('filter-3').children[filter.itemNo3].getAttribute('categoryid')
    if (filter.year == null) {
      filter.year = ''
    }
    filter.pindex = 0 // 当前页数
    filter.pnum = 0 // 当前个数
    filter.slider()
    filter.addClass()
    getFilterList()
  } else if (filter.pos == 4) {
    if (this.itemNo4 + 1 >= filter.fliterList4.length) return
    filter.removeClass()
    this.itemNo4++
    filter.sortType = getId('filter-4').children[filter.itemNo4].getAttribute('categoryid')
    if (filter.sortType == null) {
      filter.sortType = 5
    }
    filter.pindex = 0 // 当前页数
    filter.pnum = 0 // 当前个数
    filter.slider()
    filter.addClass()
    getFilterList()
  } else if (filter.pos == 5) {
    if (filter.pindex + 1 < filter.totalPage) {
      if (filter.pnum % 8 < 4) {
        filter.removeClass()
        filter.pnum += 4
        filter.addClass()
      } else {
        filter.removeClass()
        filter.pnum = 0
        filter.pindex += 1
        // 加载下一页数据
        getFilterList()
      }
    } else {
      if (filter.totalNum % 8 == 0) {
        if (filter.pnum + 4 < filter.totalNum % 8 + 8) {
          filter.removeClass()
          filter.pnum += 4
          filter.addClass()
        }
      } else {
        if (filter.pnum + 4 < filter.totalNum % 8) {
          filter.removeClass()
          filter.pnum += 4
          filter.addClass()
        }
      }
    }
  }
}

// 左
filter.left = function () {
  if (filter.pos > 1) {
    if (filter.pnum % 4 == 0) {
      filter.pos -= 1
      filter.removeClass()
      filter.addClass()
    } else {
      filter.removeClass()
      filter.pnum -= 1
      filter.addClass()
    }
  } else {
    filter.pos = 0
    filter.removeClass()
    filter.addClass()
    // getClass('filter')[0].style.width = '1440px'
    getClass('filter-left')[0].style.marginLeft = '0'
    getClass('filter-right')[0].style.width = '684px'
    getId('title').style.marginLeft = '71px'
    getClass('filter-0')[0].style.left = '0'
    getClass('filter-0-select')[0].style.right = '0'
    getClass('filter-0-select')[0].style.transform = 'rotate(0deg)'
    getId('filter-0').style.left = '19px'
  }
}

// 右
filter.right = function () {
  if (filter.pos > 0 && filter.pos < 5) {
    if (filter.searchListLi == '<div id="no">暂无对应筛选结果<p>请尝试其他类型，或使用搜索找到您适合的内容！</div>' && filter.pos == 4) {
      return
    }
    filter.pos += 1
    filter.removeClass()
    filter.addClass()
  } else if (filter.pos == 0) {
    filter.pos = 1
    filter.removeClass()
    filter.addClass()
    // getClass('filter')[0].style.width = '1280px'
    getClass('filter-left')[0].style.marginLeft = '-160px'
    getClass('filter-right')[0].style.width = '844px'
    getId('title').style.marginLeft = '231px'
    getClass('filter-0')[0].style.left = '34px'
    getClass('filter-0-select')[0].style.right = '12px'
    getClass('filter-0-select')[0].style.transform = 'rotate(180deg)'
    getId('filter-0').style.left = '0'
  } else if (filter.pos == 5) {
    if (filter.pindex + 1 < filter.totalPage) {
      if (filter.pnum % 4 != 3) {
        filter.removeClass()
        filter.pnum += 1
        filter.addClass()
      }
    } else {
      if (filter.totalNum % 8 == 0) {
        if (filter.pnum != 3 && filter.pnum + 1 < filter.totalNum % 8 + 8) {
          filter.removeClass()
          filter.pnum += 1
          filter.addClass()
        } else if (filter.pnum + 1 > 4 && filter.pnum + 1 < filter.totalNum % 8 + 8) {
          filter.removeClass()
          filter.pnum += 1
          filter.addClass()
        }
      } else {
        if (filter.pnum != 3 && filter.pnum + 1 < filter.totalNum % 8) {
          filter.removeClass()
          filter.pnum += 1
          filter.addClass()
        } else if (filter.pnum + 1 > 4 && filter.pnum + 1 < filter.totalNum % 8) {
          filter.removeClass()
          filter.pnum += 1
          filter.addClass()
        }
      }
    }
  }
}

// 确定
filter.enter = function () {
  if (filter.pos == 5) {
    var backUrl = '../filter/filter.html?catCode=' + filter.catCode + '&categoryId=' + filter.content + '&areaID=' + filter.areaID + '&year=' + filter.year + '&pos=' + filter.pos + '&pnum=' + filter.pnum + '&pindex=' + filter.pindex + '&itemNo0=' + filter.itemNo0 + '&itemNo1=' + filter.itemNo1 + '&itemNo2=' + filter.itemNo2 + '&itemNo3=' + filter.itemNo3 + '&itemNo4=' + filter.itemNo4
    var detailUrl = getId('list').children[filter.pnum].getAttribute('jsonurl')
    Cookies.set("backUrl", backUrl, { path: '/' })
    Cookies.set("detailUrl", detailUrl, { path: '/' })
    console.log(backUrl)
    window.location.href = '../detail/detail.html'
  }
}

// 返回
filter.back = function () {
  var twoStageBackUrl = Cookies.get("twoStageBackUrl", {
    path: '/'
  })
  window.location.href = twoStageBackUrl
}

// 上一页
filter.next = function () {
  if (filter.pos == 5 && filter.pindex > 0) {
    filter.removeClass()
    filter.pnum = 0
    filter.pindex -= 1
    // 加载上一页数据
    getFilterList()
  }
}

// 下一页
filter.prev = function () {
  if (filter.pos == 5 && filter.pindex + 1 < filter.totalPage) {
    filter.removeClass()
    filter.pnum = 0
    filter.pindex += 1
    // 加载下一页数据
    getFilterList()
  }
}

// 获取筛选条件
filter.getFilter = function () {
  var url = baseUrl + '&k=1&v=2&p=yhCategoryList&rootNode=TXJG&catCode='
  var catCode = ''
  getConditionFilter(url, catCode,
    function (res) {
      console.log('%c筛选条件', 'color: #4169E1', res)

      filter.filterList0 = res.data.categoryList
      var filterList0 = ''
      if (filter.filterList0) {
        for (var i = 0; i < filter.filterList0.length; i++) {
          if (filter.item0 == 1 && filter.filterList0[i].catCode == filter.catCode) {
            filter.itemNo0 = i
            filter.item0 = 0
          }
          filterList0 += '<li categoryId="' + filter.filterList0[i].catCode + '">' + filter.filterList0[i].categoryName + '</li>'
          getId('filter-0').innerHTML = filterList0
        }
      }

      filter.filterList1 = res.data.categoryList[filter.itemNo0].dimensionMap.contentList
      var filterList1 = '<li>全部</li>'
      getId('filter-1').innerHTML = filterList1
      if (filter.filterList1) {
        for (var i = 0; i < filter.filterList1.length; i++) {
          if (filter.item1 == 1 && filter.filterList1[i].categoryId == filter.content) {
            filter.itemNo1 = i + 1
          }
          filterList1 += '<li categoryId="' + filter.filterList1[i].categoryId + '">' + filter.filterList1[i].categoryName + '</li>'
          getId('filter-1').innerHTML = filterList1
        }
      }

      filter.filterList2 = res.data.categoryList[filter.itemNo0].dimensionMap.areaList
      var filterList2 = '<li>地区</li>'
      getId('filter-2').innerHTML = filterList2
      if (filter.filterList2) {
        for (var i = 0; i < filter.filterList2.length; i++) {
          if (filter.filterList2[i].categoryName == '台湾' || filter.filterList2[i].categoryName == "香港") {
            filterList2 += '<li categoryId="' + filter.filterList2[i].categoryId + '">' + "中国" + filter.filterList2[i].categoryName + '</li>'
          } else {
            filterList2 += '<li categoryId="' + filter.filterList2[i].categoryId + '">' + filter.filterList2[i].categoryName + '</li>'
          }
          getId('filter-2').innerHTML = filterList2
        }
      }

      filter.filterList3 = res.data.categoryList[filter.itemNo0].dimensionMap.yearsList
      var filterList3 = '<li>年份</li>'
      getId('filter-3').innerHTML = filterList3
      if (filter.filterList3) {
        for (var i = 0; i < filter.filterList3.length; i++) {
          filterList3 += '<li categoryId="' + filter.filterList3[i].categoryId + '">' + filter.filterList3[i].categoryName + '</li>'
          getId('filter-3').innerHTML = filterList3
        }
      }

      filter.filterList4 = res.data.categoryList[filter.itemNo0].dimensionMap.sortList
      var filterList4 = '<li>最新</li>'
      filter.filterList4 = [{ 'categoryId': '2', 'categoryName': '好评' }]
      // var filterList4 = '<li>收费</li>'
      getId('filter-4').innerHTML = filterList4
      if (filter.filterList4) {
        for (var i = 0; i < filter.filterList4.length; i++) {
          filterList4 += '<li categoryId="' + filter.filterList4[i].categoryId + '">' + filter.filterList4[i].categoryName + '</li>'
          getId('filter-4').innerHTML = filterList4
        }
      }

      filter.slider()
      if (filter.pos == 0) {
        getId('filter-1').children[filter.itemNo1].setAttribute('class', '')
        getId('filter-2').children[filter.itemNo2].setAttribute('class', '')
        getId('filter-3').children[filter.itemNo3].setAttribute('class', '')
        getId('filter-4').children[filter.itemNo4].setAttribute('class', '')
        getId('filter-0').children[filter.itemNo0].setAttribute('class', 'select')
        filter.itemNo1 = 0
        filter.itemNo2 = 0
        filter.itemNo3 = 0
        filter.itemNo4 = 0
        filter.slider()
      } else if (filter.pos == 1) {
        getId('filter-1').children[filter.itemNo1].setAttribute('class', 'select hover')
      } else if (filter.pos == 2) {
        getId('filter-2').children[filter.itemNo2].setAttribute('class', 'select hover')
      } else if (filter.pos == 3) {
        getId('filter-3').children[filter.itemNo3].setAttribute('class', 'select hover')
      } else if (filter.pos == 4) {
        getId('filter-4').children[filter.itemNo4].setAttribute('class', 'select hover')
      }
    },
    function (err) {
      console.log(err)
    }
  )
}

// 获取筛选结果
getFilterList = function () {
  var url = baseUrl + 'k=1&v=2&p=yhScreenResult&vip=' + filter.vip + '&vipCode=TXJG&catCode=' + filter.catCode + '&content=' + filter.content + '&areaId=' + filter.areaID + '&year=' + filter.year + '&sortType=' + filter.sortType + '&pindex=' + filter.pindex * 8 + '&psize=8&sizeFlag=1'
  // var url = baseUrl + '&k=1&v=2&p=yhScreenResult&vip=' + filter.sortType + '&vipCode=TXJG&catCode=' + filter.catCode + '&content=' + filter.content + '&areaId=' + filter.areaID + '&year=' + filter.year + '&sortType=1&pindex=' + filter.pindex * 8 + '&psize=8&sizeFlag=1'
  console.log(filter.catCode, filter.content, filter.areaID, filter.year)
  console.log(url)
  getSearchList(url,
    function (res) {
      console.log('%c筛选结果', 'color: #4169E1', res)
      filter.totalNum = res.data.assetNum
      filter.totalPage = Math.ceil(filter.totalNum / 8)
      filter.searchList = res.data.assetList
      filter.searchListLi = ''
      for (var i = 0; i < filter.searchList.length; i++) {
        // filter.searchListLi += '<li jsonUrl="' + filter.searchList[i].jsonUrl + '"><div class="list-img" style="background-image: url(' + filter.searchList[i].assetImg + ')"><div class="list-vip">' + filter.searchList[i].score + '</div></div><div class="list-title">' + filter.searchList[i].assetName + '</div></li>'
        // filter.searchListLi += '<li jsonUrl="' + filter.searchList[i].jsonUrl + '"><div class="list-img" style="background-image: url(' + filter.searchList[i].assetImg + ')"><div class="list-vip">' + filter.searchList[i].score + '</div></div><div class="list-title">' + filter.searchList[i].assetName + '</div></li>'
        filter.searchListLi += '<li jsonUrl="' + filter.searchList[i].jsonUrl + '"><img class="list-img" src="' + filter.searchList[i].assetImg + '"><div class="list-vip">' + filter.searchList[i].score + '</div><div class="list-title">' + filter.searchList[i].assetName + '</div></li>'
      }
      if (filter.searchListLi == '') {
        filter.searchListLi = '<div id="no">暂无对应筛选结果<p>请尝试其他类型，或使用搜索找到您适合的内容！</p></div>'
        getClass('scroll')[0].style.display = 'none'
      } else {
        getClass('scroll')[0].style.display = 'block'
      }
      if (filter.totalNum == 1) {
        getClass('scroll')[0].style.display = 'none'
      }
      getId('list').innerHTML = filter.searchListLi
      // filter.addClass()
      filter.slider()
      filter.sliderNum()
      filter.addClass()
    },
    function (err) {
      console.log(err)
    }
  )
}

// 模板内初始化方法
filter.init = function (state) {
  areaObj = filter
  // 初始化焦点样式
  filter.getFilter()
  setTimeout(function () {
    filter.sortType = 5;
    getFilterList()
    filter.sliderNum()
    // filter.addClass()
    if (filter.pindex < 1) {
      getClass('up')[0].style.display = 'none'
    }
    if (filter.pindex == filter.totalPage - 1) {
      getClass('down')[0].style.display = 'none'
    }
  }, 1000);

  // 页面访问上报
  var jump = Cookies.get('jump')
  if (jump) {
    jump = eval('(' + jump + ')')
    try {
      var jsonOb = {}
      jsonOb.page_type = '0301'
      jsonOb.page_id = response.data.assetId
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
  filter.catCode = getParam('catCode')
  filter.content = getParam('categoryId')
  filter.areaID = getParam('areaID')
  filter.year = getParam('year')
  filter.sortType = getParam('sortType')
  if (filter.sortType) {
    filter.sortType = 5
  }
  filter.pos = parseInt(getParam('pos'))
  if (isNaN(filter.pos)) {
    filter.pos = 1
  }
  filter.pnum = parseInt(getParam('pnum'))
  if (isNaN(filter.pnum)) {
    filter.pnum = 0
  }
  filter.pindex = parseInt(getParam('pindex'))
  if (isNaN(filter.pindex)) {
    filter.pindex = 0
  }
  filter.itemNo0 = parseInt(getParam('itemNo0'))
  if (isNaN(filter.itemNo0)) {
    filter.itemNo0 = 0
  }
  filter.itemNo1 = parseInt(getParam('itemNo1'))
  if (isNaN(filter.itemNo1)) {
    filter.itemNo1 = 0
  }
  filter.itemNo2 = parseInt(getParam('itemNo2'))
  if (isNaN(filter.itemNo2)) {
    filter.itemNo2 = 0
  }
  filter.itemNo3 = parseInt(getParam('itemNo3'))
  if (isNaN(filter.itemNo3)) {
    filter.itemNo3 = 0
  }
  filter.itemNo4 = parseInt(getParam('itemNo4'))
  if (isNaN(filter.itemNo4)) {
    filter.itemNo4 = 0
  }
  filter.init()
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

// 浙江电信筛选页面上报心跳埋点
console.log('%cZJDX 浙江电信筛选页面上报心跳埋点', 'color: #4169E1')
try {
  var type = {
    page_id: 'filter.html',
    page_name: '',
    refer_pos_id: '',
    refer_pos_name: '',

    refer_page_id: 'filter.html',
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