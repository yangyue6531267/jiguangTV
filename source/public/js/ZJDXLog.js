// 测试环境
var ZJDXlogUrl = "http://115.233.200.198:8082/?opt=put";
// 正式环境
var ZJDXlogUrl = "http://115.233.200.194:8082/?opt=put";
var timer = null
function ZJDXlog() {
}

function setProme() {
    this.terminal_type = 'android_STB'
    this.sys_id = 't'
}
var setPromes = new setProme()


/**** 
 * 启动心跳应用
 * 
*/
ZJDXlog.browsing = function (type) {
    console.log("%cZJDX.browsing日志上报", 'color: #4169E1');
    var startTime = parseInt(new Date().getTime() / 1000)
    var logOb = setPromes;
    logOb.action_type = 'browsing'
    logOb.user_id = yh.userId // 用户唯一ID
    logOb.user_group_id = yh.usergroupid //用户分组
    logOb.epg_group_id = yh.usergroupid//epg分组

    logOb.stb_ip = "";
    logOb.stb_id = "";
    logOb.stb_type = "";
    logOb.stb_mac = "";

    logOb.log_time = startTime;
    logOb.page_id = type.page_id;
    logOb.page_name = type.page_name;
    logOb.refer_pos_id = type.refer_pos_id;
    logOb.refer_pos_name = type.refer_pos_name;

    logOb.mediacode = type.mediacode;
    logOb.medianame = type.medianame;
    logOb.refer_mediacode = type.refer_mediacode

    logOb.refer_type = type.refer_type;
    logOb.refer_page_id = type.refer_page_id;
    logOb.refer_page_name = type.refer_page_name;
    logOb.refer_parent_id = type.refer_parent_id;

    getLog(logOb);
}

/**** 
 * 退出APK
 * 
 * event 事件代号(固定值1030
 * time apk使用时长(从应用启动到关闭的时间毫秒数)
 */
ZJDXlog.vod_playing = function (type) {
    console.log('ZJDX.vod_playing点播上报')
    var log_time = parseInt(new Date().getTime() / 1000)
    var logOb = setPromes;

    logOb.action_type = 'vod_playing'
    logOb.user_id = type.user_id
    logOb.user_group_id = type.user_group_id
    logOb.epg_group_id = type.epg_group_id

    logOb.stb_ip = ''
    logOb.stb_id = ''
    logOb.stb_type = ''
    logOb.stb_mac = ''

    logOb.log_time = log_time

    logOb.mediacode = type.mediacode
    logOb.mediaduration = type.mediaduration
    logOb.seriescode = type.seriescode
    logOb.seriesflag = type.seriesflag
    logOb.definition = "2" // 目前只有高清
    logOb.bitrate = "720P" // 高清为720P

    logOb.start_time = type.start_Time
    logOb.currentplaytime = type.currentplaytime

    logOb.refer_type = type.refer_type
    logOb.refer_page_id = type.refer_page_id
    logOb.refer_page_name = type.refer_page_name
    logOb.refer_pos_id = ""
    logOb.refer_pos_name = type.refer_pos_name
    logOb.refer_mediacode = type.refer_mediacode
    logOb.refer_parent_id = type.refer_parent_id
    logOb.area_code = ""
    getLog(logOb);
}


ZJDXlog.timeStart = function (type) {
    console.log(type)
    if (timer != null) {
        clearInterval(ZJDXlog.timer)
    }
    if (type.type == 0) {
        ZJDXlog.browsing(type)
    } else {
        ZJDXlog.vod_playing(type)
    }
    timer = setInterval(function () {
        if (type.type == 0) {
            ZJDXlog.browsing(type)
        } else {
            ZJDXlog.vod_playing(type)
        }
    }, 300000)
}
ZJDXlog.timeEnd = function () {
    clearInterval(timer)
}


function getLog(obj) {
    console.log("ZJDX-LOG：" + JSON.stringify(obj));
    // alert(JSON.stringify(obj))
    var log_info = encodeURIComponent(JSON.stringify(obj));
    var url = ZJDXlogUrl + "&data=" + log_info + "&caseid=101"
    ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log('日志发送成功');
        },
        error: function (err) {
            console.log("ZJDXbi" + err)
        }
    })
}