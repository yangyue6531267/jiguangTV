function ajax(options) {
  options = options || {};
  options.type = (options.type || "GET").toUpperCase();
  options.dataType = options.dataType || "json";
  options.contentType = options.contentType || "x-www-form-urlencoded";
  var params = options.data;
  //创建xhr对象 - 非IE6
  if (window.XMLHttpRequest) {
    var xhr = new XMLHttpRequest();
  } else { //IE6及其以下版本浏览器
    var xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  //GET POST JSONp 请求方式
  if (options.type == "GET") {
    // jsonp请求
    if (options.dataType == 'jsonp') {
      var time = (new Date()).valueOf();
      window[options.jsonpCallback + time] = function (data) {
        if (data.code >= 200 && data.code < 300) {
          options.success && options.success(data);
        } else {
          options.fail && options.fail(data);
        }
        //结束后删除script  释放func回调
        setTimeout(function () {
          var scripts = document.getElementsByTagName("script");
          for (var i = 0; i < scripts.length; i++) {
            if (scripts[i] && scripts[i].src && scripts[i].src.indexOf('jsonpCallback') != -1) {
              scripts[i].parentNode.removeChild(scripts[i]);
            }
          }
          window[options.jsonpCallback + time] = null;
        }, 200)
      }
      var srcipt = document.createElement('script');
      srcipt.src = options.url + '&returnType=' + options.dataType + '&' + options.jsonp + '=' + options.jsonpCallback + time + '&_=' + time
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(srcipt);
    } else {
      //get请求
      xhr.open("GET", options.url, true);
      xhr.send(null);
    }
  } else if (options.type == "POST") {
    xhr.open("POST", options.url, true);
    //设置表单提交时的内容类型
    xhr.setRequestHeader("Content-Type", options.contentType + ";charset=utf-8");
    xhr.send(params);
  }
  //接收
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var status = xhr.status;
      if (status >= 200 && status < 300) {
        options.success && options.success(xhr.responseText);
      } else {
        options.fail && options.fail(status);
      }
    }
  }
}

// jsonp 样例
// ajax({
//   url: url,
//   type: "GET",
//   dataType: "jsonp", //指定服务器返回的数据类型
//   jsonp: 'jsonpCallback',
//   jsonpCallback: 'callback',
//   success: function (data) {
//     console.log(data)
//   },
// fail: function(err){
// }
// });