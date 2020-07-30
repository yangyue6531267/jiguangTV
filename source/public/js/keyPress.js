var KEYMAP = {
  38: "up",
  40: "down",
  37: "left",
  39: "right",
  13: "enter",
  8: "back",
  27: "back",
  22: "back",
  461: "back",
  340: "back",
  283: "back",
  181: "home", // 首页
  278: "message", // 信息
  272: "home",
  33: "keyUp",
  34: "keyDown",
  261: "mute"
};
//按键分发事件
var onKeyPress;
//按键prev处理函数
var grepEvent = function (e) {
  if (grepEvent.isPress) return; //节流
  grepEvent.isPress = true;
  setTimeout(function () {
    grepEvent.isPress = false;
  }, 150);
  var keyCode = e.keyCode || e.which;

  return onKeyPress(KEYMAP[keyCode]);
};