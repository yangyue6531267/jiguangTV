/** 
 * 1.设置播放器位置
 * 2.初始化状态回调函数
 * 3.显示播放器
 * 4.开始播放
 */

var player = function () {};

//判断类型的方法
function judgeObj(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
};

//提交prompt的方法
function submitPrompt(key, params) {
  // if (navigator.platform != "Win32" || navigator.platform != 'Windows') {
  //   return
  // }
  var p = 'yanhua://epg/';
  p += key;
  if (params && judgeObj(params) == 'Object') {
    p = p + '?';
    for (var i in params) {
      p += i + '=' + params[i] + '&'
    }
    p = p.slice(0, p.length - 1);
  }
  console.warn(p);
  var a = prompt(p);
};
//播放器状态改变回调
videoOptions = {
  onStart: null,
  onPlay: null,
  onPause: null,
  onResume: null,
  onStop: null,
  onCompvared: null,
  onError: null,
  onScreenChange: null,
  onBufferingStart: null,
  onBufferfinish: null,
  onProgress: null,
  onCompleted: null
};

//状态值改变的方法
function videoStateChange(res) {
  console.warn(res);
  switch (res.tag) {
    case 'onStart':
      if (judgeObj(videoOptions.onStart) == 'Function') {
        videoOptions.onStart(res);
      }
      break;
    case 'onPlay':
      if (judgeObj(videoOptions.onPlay) == 'Function') {
        videoOptions.onPlay(res);
      }
      break;
    case 'onPause':
      if (judgeObj(videoOptions.onPause) == 'Function') {
        videoOptions.onPause(res);
      }
      break;
    case 'onResume':
      if (judgeObj(videoOptions.onResume) == 'Function') {
        videoOptions.onResume(res);
      }
      break;
    case 'onStop':
      if (judgeObj(videoOptions.onStop) == 'Function') {
        videoOptions.onStop(res);
      }
      break;
    case 'onError':
      if (judgeObj(videoOptions.onError) == 'Function') {
        videoOptions.onError(res);
      }
      break;
    case 'onScreenChange':
      if (judgeObj(videoOptions.onScreenChange) == 'Function') {
        videoOptions.onScreenChange(res);
      }
      break;
    case 'onBufferingStart':
      if (judgeObj(videoOptions.onBufferingStart) == 'Function') {
        videoOptions.onBufferingStart(res);
      }
      break;
    case 'onBufferfinish':
      if (judgeObj(videoOptions.onBufferfinish) == 'Function') {
        videoOptions.onBufferfinish(res);
      }
      break;
    case 'onProgress':
      if (judgeObj(videoOptions.onProgress) == 'Function') {
        videoOptions.onProgress(res);
      }
      break;
    case 'onCompleted':
      if (judgeObj(videoOptions.onCompleted) == 'Function') {
        videoOptions.onCompleted(res);
      }
      break;
  }
};

//设置播放器位置
player.setDisplayerLocation = function (options) {
  if (options) {
    submitPrompt('setPlayerLocation', options);
  } else {
    submitPrompt('setPlayerLocation', {
      x: 0,
      y: 0,
      w: 1280,
      h: 720
    });
  }
};

//更新播放器位置
player.upPlayerLocation = function (options) {
  if (judgeObj(options.x) == 'Number' &&
    judgeObj(options.y) == 'Number' &&
    judgeObj(options.w) == 'Number' &&
    judgeObj(options.h) == 'Number') {
    submitPrompt('setPlayerLocation', options);
  }
};

//显示隐藏播放器 ( key 为 hidePlayer 隐藏 key 为 showPlayer 是显示 )
//隐藏播放器之前需要先停止播放器
player.toggleShow = function (key) {
  submitPrompt(key);
};

//播放器播放 ( options.playUrl 是播放路径 options.historyTime 是历史播放时间 )
player.play = function (options) {
  if (options.playUrl) {
    options.playUrl = encodeURIComponent(options.playUrl);
    submitPrompt('play', options);
  }
};

//播放器初始化
player.initPlayer = function (options) {
  submitPrompt('initPlayer')
};

//播放器暂停和续播( key 为 pause是暂停 key 为resume是续播 )
player.togglePlay = function (key) {
  submitPrompt(key);
};

//播放器放大缩小
player.toggleFullScreen = function () {
  submitPrompt('toggleFullScreen');
}

//播放器停止播放
player.stop = function () {
  console.log('停止播放')
  submitPrompt('stop');
}

//播放器快进快退
player.seekTime = function (options) {
  submitPrompt('seek', options);
}

player.setCallback = function (options) {
  for (var k in options) {
    videoOptions[k] = options[k];
  }
  window.videoStateChange = videoStateChange;
  submitPrompt('setCallBack', {
    return: 'videoStateChange'
  });
}

// export {player};