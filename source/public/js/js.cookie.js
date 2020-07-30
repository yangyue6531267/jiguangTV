//JS操作cookies方法! 

//写cookies 
// path=/
var Cookies = {};
Cookies.set = function (name, value, path) {
  var Days = 30;
  var exp = new Date();
  var pathStr = '';
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  if (path) {
    pathStr = ";path=" + path.path
  }
  document.cookie = name + "=" + escape(value) + pathStr + ";expires=" + exp.toGMTString();
}

//读取cookies 
Cookies.get = function (name) {

  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

//删除cookies 
Cookies.del = function (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 100);
  var cval = Cookies.get(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
} 