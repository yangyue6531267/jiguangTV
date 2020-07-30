//  接口服务
// var switchs = 'pub';

// if (yh.switchs == "dev") {
// var baseUrl = "http://gsyd-ds.yanhuamedia.tv/?s=26|10&"; //主页入口
// var blackUrl = "http://47.97.96.103"; //UMs测试入口
// var historylUrl = "http://47.97.96.103/uds/cloud/collection";
// var DataUrl = "http://47.97.96.103" //应用商城传参接口
// } else {
var historylUrl = "http://115.233.200.171:39005/uds/cloud/collection"; //收藏  历史纪录接口
var blackUrl = "http://115.233.200.171:39004"; //UMs测试入口
var baseUrl = 'http://115.233.200.171:39002/?s=26|10&'; //正式epg入口
// var baseUrl = 'http://115.233.200.174:39002/?s=26|10&'; //测试epg入口
var DataUrl = "http://115.233.200.171:39006" //应用商城传参接口
// }

/**
 * 获取栏目数据
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhNavigationBar(successfn, errorfn) {
  var url = baseUrl + "p=yhNavigationBar&k=1&v=2&catId=204185&c=10"
  ajax({
    url: url,
    type: "GET",
    dataType: "jsonp", //指定服务器返回的数据类型
    jsonp: 'jsonpCallback',
    jsonpCallback: 'callback',
    success: function (res) {
      successfn && successfn(res);
    },
    fail: function (err) {
      errorfn && errorfn(err)
    }
  });
}

/**
 * 获取推荐数据
 * @param {*} url 
 * @param {*} successfn 
 * @param {*} errorfn 
 */
function getYhSpecialList_nc(url, successfn, errorfn, sc) {
  if (sc) {
    ajax({
      url: url,
      success: successfn,
      fail: errorfn
    })
  } else {
    $.ajax({
      type: 'GET',
      url: url + '&returnType=jsonp',
      dataType: "jsonp",
      jsonpCallback: 'jsonpCallback',
      success: successfn,
      fail: errorfn
    })
  }
  // ajax({ url: url, success: successfn, fail: errorfn })
}

// post请求接口
/**
 * @param {*} url
 * @param {*} type
 * @param {*} data
 * @param {*} successfn 
 * @param {*} errorfn
 */
function PostData(url, data, header, successfn, errorfn, type) {
  console.log(header);
  if (type == "HG680-JD4EZ-52") {
    // $.ajax({
    //   url: url,
    //   type: "POST",
    //   data: data,
    //   dataType: "text",
    //   // contentType: "application/text",
    //   accepts: {
    //     text: "application/text"
    //   },
    //   headers: header,
    //   success: successfn,
    //   fail: errorfn
    // })
    $.ajax({
      url: url,
      type: "POST",
      data: data,
      headers: header,
      contentType: "application/json",
      success: successfn,
      fail: errorfn
    })
  } else {
    $.ajax({
      url: url,
      type: "POST",
      data: data,
      headers: header,
      contentType: "application/json",
      success: successfn,
      fail: errorfn
    })
  }

}

// 收藏接口
/**
 * @param {*} url
 * @param {*} type
 * @param {*} data
 * @param {*} successfn 
 * @param {*} errorfn
 */
function getYhSpecialSC(url, data, successfn, errorfn) {
  ajax({
    url: url,
    type: "POST",
    data: data,
    contentType: "application/json",
    success: successfn,
    fail: errorfn
  })
}

//查询收藏/播放记录
/**
 * @param {*} url
 * @param {*} successfn 
 * @param {*} errorfn
 */
function getCollectionList(url, successfn, errorfn) {
  ajax({
    url: url,
    success: successfn,
    fail: errorfn
  })
}

// 获取筛选条件
/**
 * @param {*} url
 * @param {*} successfn 
 * @param {*} errorfn
 */
function getConditionFilter(url, catCode, successfn, errorfn) {
  var url = url + catCode
  $.ajax({
    type: 'GET',
    url: url + '&returnType=jsonp',
    dataType: "jsonp",
    jsonpCallback: 'jsonpCallback',
    success: successfn,
    fail: errorfn
  })
}

// 获取筛选结果
/**
 * @param {*} url
 * @param {*} successfn 
 * @param {*} errorfn
 */
function getResultFilter(url, successfn, errorfn) {
  $.ajax({
    type: 'GET',
    url: url + '&returnType=jsonp',
    dataType: "jsonp",
    jsonpCallback: 'jsonpCallback',
    success: successfn,
    fail: errorfn
  })
}

// 获取搜索结果列表
/**
 * @param {*} url
 * @param {*} successfn
 * @param {*} errorfn
 */
function getSearchList(url, successfn, errorfn) {
  $.ajax({
    type: 'GET',
    url: url + '&returnType=jsonp',
    dataType: "jsonp",
    jsonpCallback: 'jsonpCallback',
    success: successfn,
    fail: errorfn
  })
}

// 获取历史收藏列表
/**
 * @param {*} url
 * @param {*} successfn
 * @param {*} errorfn
 */
function getHistoryList(url, successfn, errorfn) {
  $.ajax({
    type: 'GET',
    url: url,
    jsonpCallback: 'jsonpCallback',
    success: successfn,
    fail: errorfn
  })
}

// 删除历史收藏列表
/**
 * @param {*} url
 * @param {*} successfn
 * @param {*} errorfn
 */
function deleteHistoryList(url, successfn, errorfn) {
  $.ajax({
    type: 'GET',
    url: url,
    jsonpCallback: 'jsonpCallback',
    success: successfn,
    fail: errorfn
  })
}