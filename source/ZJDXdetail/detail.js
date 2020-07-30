var upload = 1;
// 获取黑白名单
var isZero = 2;
var AccessKey = '';
var json = {
    "UserGroupNMB": getAuthenticationAttr("UserGroupNMB"),
    "EPGGroupNMB": getAuthenticationAttr("EPGGroupNMB"),
    "UserId": getAuthenticationAttr("UserID"),
    "Mac": getAuthenticationAttr("MAC"),
    "STBID": getAuthenticationAttr("STBID"),
    "IP": getAuthenticationAttr("IP"),
    "SessionID": getAuthenticationAttr("SessionID"),
    "UserToken": getAuthenticationAttr("UserToken"),
    "productCode": "100097"
}
// toast(getParam('epg_info'));
var contentType = "";
try {
    console.log("是否安装apk" + STBAppManager.isAppInstalled('com.yanhua.tv.jiguang'));
    console.log("BS页面请求局方apk数据" + JSON.stringify(json));
} catch (err) {
    console.log(err)
}

//防报错
function getAuthenticationAttr(name) {
    if ((typeof Authentication) != "undefined") {
        return Authentication.CTCGetConfig(name);
    } else {
        return "---";
    }
}


var topContent = {
    isPlay: false,
    btnNum: 0,
    layout: "",
    init: function () {
        //详情页顶部渲染
        getId('detail_img').src = value.detailData.assetImg;
        getId("detail_name").innerHTML = value.detailData.assetName;
        getId("year").innerHTML = "| " + value.detailData.year;
        getId("listItem").innerHTML = "| 共" + value.detailData.episodes + "集";
        getId('introduce').innerHTML = value.detailData.description;
        var dir = value.detailData.director ? value.detailData.director : "暂无";
        getId('director').innerHTML = "导演：" + dir
        var titles
        if (value.detailData.actor.split("、").length * 1 > 3) {
            titles = value.detailData.actor.split("、")[0] + "," + value.detailData.actor.split("、")[1] + "," + value.detailData.actor.split("、")[2]
        } else {
            titles = value.detailData.actor;
        }
        getId('actor').innerHTML = "主播：" + titles;

        this.addCssVIP();
    },
    addCss: function () {
        this.right()
    },
    addCssVIP: function () {
        if (!this.isPlay) {
            getId("play").style.background = "url(./../public/images/ZJDXdetail/player.png) no-repeat";
        } else {
            getId("isOrder").style.background = "url(./../public/images/ZJDXdetail/orders.png) no-repeat"
            getId("play").style.display = 'none'
            this.btnNum = 1;
        }
    },
    left: function () {
        if (this.isPlay) {
            this.addCssVIP()
            return
        }
        this.btnNum = 0;
        getId("isOrder").style.background = "url(./../public/images/ZJDXdetail/order.png) no-repeat"
        getId("play").style.background = "url(./../public/images/ZJDXdetail/player.png) no-repeat"
    },
    right: function () {
        if (this.isPlay) {
            this.addCssVIP()
            return
        }
        this.btnNum = 1;
        getId("isOrder").style.background = "url(./../public/images/ZJDXdetail/orders.png) no-repeat"
        getId("play").style.background = "url(./../public/images/ZJDXdetail/play.png) no-repeat"
    },
    down: function () {
        getId("isOrder").style.background = "url(./../public/images/ZJDXdetail/order.png) no-repeat"
        getId("play").style.background = "url(./../public/images/ZJDXdetail/play.png) no-repeat"
        focused('down')
    },
    up: function () {
        this.left();
    },
    enter: function () {
        if (this.btnNum == 0) {
            // console.log('跳转：http://10.255.247.1/web/gd_service/activity/20200518aurora_ac/index.jsp?userToken='
            //     + json.UserToken + "&epg_info=" + getParam('epg_info'))
            // window.location.href = 'http://10.255.247.1/web/gd_service/activity/20200518aurora_ac/index.jsp?userToken=' + json.UserToken + "&epg_info=" + getParam('epg_info');
            // return;
            try {
                var param = {
                    page_id: value.detailData.assetId,
                    page_type: '0301',
                }
                bi.orderClick(param)
                Cookies.set('orderPkg', value.detailData.assetId, {
                    path: '/'
                })
            } catch (error) {
                console.log('埋点错误', error)
            }

            // 订购上报
            if (Cookies.get("firstOrder") == "点击订购" && playConfig.isOrder == 0) {
                try {
                    var params = {
                        pkg_type: '2',
                        pkg_id: json.productCode,
                        order_msg: '1',
                        parent_page_id: Cookies.get("orderPkg"),
                        parent_page_type: '0301',
                        point: '1',
                        point_id: value.detailData.assetId
                    }
                    bi.order(params)
                } catch (error) {
                    console.log('埋点错误', error)
                }
                Cookies.set("firstOrder", "", {
                    path: '/'
                })
            }
            // 浙江电信订购页面浏览
            try {
                var type = {
                    page_id: '1080HDJTRHB' + topContent.layout + "-0000_0002",
                    page_name: '1080高清极光融合包' + value.name + "订购",
                    refer_pos_id: '1080HDJTRHB' + topContent.layout + " - 0000_0002",
                    refer_pos_name: '1080高清极光融合包' + value.name + "订购",

                    refer_page_id: '1080HDJTRHB' + topContent.layout + '-0000',
                    refer_page_name: '1080高清极光融合包' + value.name + "订购",

                    refer_type: '',
                    refer_parent_id: '',

                    mediacode: value.detailData.assetCode,
                    medianame: value.detailData.assetName,
                    type: 0
                }
                ZJDXlog.browsing(type)
            } catch (error) {
                console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
            }
            setTimeout(function () {
                var OrderbackUrl = encodeURIComponent(window.location.href);
                window.location.href = 'http://115.233.200.60:58000/epg/entry/order.epg?siteCode=hdvod&bizCode=all_hd_order&productId=100097&backUrl=' +
                    OrderbackUrl + '&userId=' +
                    json.UserId + "&contentCode=" +
                    value.detailData.assetCode + "&contentType=" + contentType;
            }, 500)
            return
            // 订购
        } else if (this.btnNum == 1) {
            Cookies.set('detailUrl', value.detailUrl, {
                path: '/'
            })
            try {
                if (value.detailData.itemList[(detaillist.itemNum * 10) + detaillist.num].fee == 1) {
                    // 试看
                    console.log('试看');
                    try {
                        var jsonob = {}
                        json.userId = json.UserId;
                        jsonob.siteId = value.siteId;
                        jsonob.asset_id = value.detailData.assetId;
                        jsonob.item_id = value.detailData.itemList[(detaillist.itemNum * 10) + detaillist.num].itemId
                        jsonob.qb_datetime = Cookies.get('qb_datetime')
                        jsonob.zb_datetime = (new Date()).valueOf()
                        jsonob.time = json.zb_datetime - json.qb_datetime
                        jsonob.ep = value.detailData.episodes
                        jsonob.fee = '1'
                        jsonob.isFullScreen = '1'
                        jsonob.pos_id = Cookies.get('pos_id')
                        jsonob.recmd_id = Cookies.get('recmd_id')
                        jsonob.parent_page_type = '0301'
                        jsonob.parent_page_id = value.detailData.assetId
                        // if (detaillist.itemNum > 0) {
                        //     jsonob.fee = '2'
                        // }
                        bi.vod(jsonob)
                    } catch (e) {
                        console.log('错误信息' + e)
                    }
                    Cookies.set('qb_datetime', (new Date()).valueOf(), {
                        path: '/'
                    })
                    SDKDownload();
                    //播放判断
                    return
                }
                if (!topContent.isPlay) {
                    console.log("禁止播放,去订购")
                    // if (isZero == 1) {
                    //     //黑名单
                    //     toast("您的账号存在异常，请联系客服！");
                    //     return
                    // }
                    try {
                        var param = {
                            page_id: value.detailData.assetId,
                            page_type: '0301'
                        }
                        bi.orderClick(param)
                        Cookies.set('orderPkg', value.detailData.assetId, {
                            path: '/'
                        })
                    } catch (error) {
                        console.log('埋点错误', error)
                    }
                    // 浙江电信电影页面浏览
                    try {
                        var type = {
                            page_id: '1080HDJTRHB' + topContent.layout + "-0000_0002",
                            page_name: '1080高清极光融合包' + value.name + "订购",
                            refer_pos_id: '1080HDJTRHB' + topContent.layout + " - 0000_0002",
                            refer_pos_name: '1080高清极光融合包' + value.name + "订购",

                            refer_page_id: '1080HDJTRHB' + topContent.layout + '-0000',
                            refer_page_name: '1080高清极光融合包' + value.name + "订购",

                            refer_type: '',
                            refer_parent_id: '',

                            mediacode: value.detailData.assetCode,
                            medianame: value.detailData.assetName,
                            type: 0
                        }
                        ZJDXlog.browsing(type)
                    } catch (error) {
                        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
                    }
                    setTimeout(function () {
                        var OrderbackUrl = encodeURIComponent(window.location.href);
                        window.location.href = 'http://115.233.200.60:58000/epg/entry/order.epg?siteCode=hdvod&bizCode=all_hd_order&productId=100097&backUrl=' +
                            OrderbackUrl + '&userId=' +
                            json.UserId + "&contentCode=" +
                            value.detailData.assetCode + "&contentType=" + contentType;
                    }, 500)
                    return
                }
                SDKDownload();
            } catch (error) {

            }
        }
    }
}

function split_array(arr, len) {
    var a_len = arr.length;
    var result = [];
    for (var i = 0; i < a_len; i += len) {
        result.push(arr.slice(i, i + len));
    }
    return result;
}

// 第一次拉起apk时使用
function AAAuto() {
    // 3A认证
    var apkVersion = "1.0.001";
    var md5Sgin = {
        sign: hex_md5(json.UserId + "$$" + json.EPGGroupNMB + "$" + apkVersion + "$Ch@nces_2020")
    }
    var purl = "http://115.233.200.102:58006/aaa/Service/ApkLogin";
    var data = {
        userId: json.UserId,
        epgGroup: json.UserGroupNMB,
        apkName: "极光TV",
        apkVersion: apkVersion,
        deviceMac: "",
        ipAddress: "",
        deviceModel: ""
    }
    PostData(purl, JSON.stringify(data), md5Sgin, function (res) {
        console.log("3a认证" + JSON.stringify(res));
    }, function (error) {
        console.log("3a失败" + error)
    }, getAuthenticationAttr("STBType"))
}

//第一次下载极光apk
function SDKDownload() {
    if (STBAppManager.isAppInstalled('com.yanhua.tv.jiguang')) {
        console.log("非第一次极光apk");
        // jumpApk();
    } else {
        console.log("第一次下载极光apk");
        AAAuto();
        console.log("上报完成");
    }
    IpApk();
}

function IpApk() {
    var id = hex_md5(json.UserId + "2019itv").toUpperCase();
    console.log("加密id" + id)
    var url = DataUrl + "/zjdx/play/clear?userId=" + id;
    getYhSpecialList_nc(url, function (data) {
        setJson();
    }, function (error) {
        console.log("清理成功");
        setJson();
    }, true)
}

//计算版本号大小,转化大小
function toNum(a) {
    var a = a.toString();
    var c = a.split('.');
    var num_place = ["", "0", "00", "000", "0000"], r = num_place.reverse();
    for (var i = 0; i < c.length; i++) {
        var len = c[i].length;
        c[i] = r[len] + c[i];
    }
    var res = c.join('');
    return res;
}


function jumpApk() {
    var id = '123'; //预留
    var pageUrl = "http://115.233.200.171:39001/auroratv/source/video/player.html"; //跳转地址
    var appName = 'com.yanhua.tv.jiguang'; //包名
    var className = 'com.yanhua.tv.yhweb.Dispatcher'; //类名
    console.log('调用传送apkurl:' + JSON.stringify(json));
    STBAppManager.startAppByIntent(
        "{\"intentType\":0,\"appName\":\"" + appName +
        "\", \"className\":\"" + className +
        "\", \"extra\":[{\"name\":\"ITV_ACCOUNT\",\"value\":\"" + id +
        "\"},{\"name\":\"otherMessage\",\"value\":\"" + playUrl +
        "\"},{\"name\":\"page_url\",\"value\":\"" + pageUrl + "\"}]}");
}

// 设置参数
function setJson() {
    var id = hex_md5(json.UserId + "2019itv").toUpperCase();
    var epgDomain = getAuthenticationAttr("EPGDomain");
    var fix = "/EPG/jsp";
    var preUrl = epgDomain.substring(0, epgDomain.indexOf(fix));
    var pindex;
    if (value.detailData.layout == "Detail_Series") {
        pindex = (detaillist.itemNum * 10) + detaillist.num;
    } else if (value.detailData.layout == "Detail_Movie") {
        pindex = 0
    } else if (value.detailData.layout == "Detail_News") {
        pindex = (detaillist.itemNum * 10) + detaillist.num;
    }
    var content = encodeURIComponent(JSON.stringify({
        SessionID: getAuthenticationAttr("SessionID"),
        DetailUrl: value.detailUrl,
        UserGroupNMB: getAuthenticationAttr("UserGroupNMB"),
        EPGGroupNMB: getAuthenticationAttr("EPGGroupNMB"),
        epgDomain: preUrl,
        clientId: json.UserId,
        PlayIndex: pindex,
        isOrder: playConfig.isOrder,
        refer_page_id: Cookies.get("refer_page_id"),
        refer_type: Cookies.get('refer_type'),
        refer_page_name: Cookies.get('refer_page_name'),
        siteId: value.siteId
    }))
    var urls = DataUrl + "/zjdx/play/params?userId=" + id + "&content=" + content;
    console.log(urls);
    getYhSpecialList_nc(urls, function (data) {
        console.log("存储：" + data);
        // toast('直接拉起apk')
        // jumpApk();
        var version = STBAppManager.getAppVersion("com.toltech.appstore");
        var a = toNum(version);
        var b = toNum("2.3.6");
        var c = toNum("2.3.1");
        if (a >= b) {
            console.log("版本号相同！版本号为:" + a);
            setTimeout(function () {
                STBAppManager.startAppByIntent("{\"intentType\":0,\"appName\":\"com.toltech.appstore\", \"className\":\"com.toltech.appstore.activity.DetailActivity\", \"extra\":[{\"name\":\"ids\",\"value\":\"1049\"}]}");
            }, 1000)
        } else if (a >= c && a < b) {
            console.log("版本号不同！版本号为:" + a);
            setTimeout(function () {
                STBAppManager.startAppByIntent("{\"intentType\":0,\"appName\":\"com.toltech.appstore\", \"className\":\"com.toltech.appstore.activity.MainActivity\", \"extra\":[{\"name\":\"ids\",\"value\":\"1049\"}]}");
            }, 1000)
        } else if (a < c) {
            // toast("应用市场版本过低,请联系客服升级版本" + version);
            getId("textLogOrder").innerHTML = '您的应用市场版本过低，暂不支持本应用服务，建议您升级机顶盒。您可以拨打10000号咨询，或前往附近营业厅办理。'
            getId("isAAAOrders").style.display = 'block';
            // window.location.href = "http://10.255.247.105/web/wisdom_family/appstore_test.jsp?epg_info=true&backUrl=" + encodeURIComponent(window.location.href);
            return
        }
    }, function (error) {
        console.log("存储失败" + error);
    }, true)
}


var detaillist = {
    itemNum: 0,
    num: 0,
    init: function () {
        var html = '';
        for (var index = 0; index < value.list[this.itemNum].length; index++) {
            html += '<div class="list_class" id="list' + index + '">' + (index + (this.itemNum) * 10 + 1) + '</div>'
        }
        getId('detail_list').innerHTML = html;
    },
    right: function () {
        if (this.num >= value.list[this.itemNum].length - 1 && this.itemNum >= value.list.length - 1) return
        if (this.num > 8) {
            this.removeCss();
            this.scroll("right")
            this.addCss()
        } else {
            this.removeCss();
            this.num++;
            this.addCss();
        }
    },
    left: function () {
        if (this.num > 0) {
            this.removeCss();
            this.num--;
            this.addCss();
        } else if (this.num <= 0 && this.itemNum > 0) {
            this.removeCss();
            this.scroll("left")
            this.addCss()
        }
    },
    scroll: function (res) {
        if (res == "left") {
            if ((detaillist.itemNum) % 5 == 0 && detaillist.itemNum != 0) {
                detaillists.toplistNum--;
                getId("details_list").style.left = '-' + 1170 * detaillists.toplistNum + 'px'
            }
            this.itemNum--;
            this.num = 9;
        } else {
            if ((detaillist.itemNum + 1) % 5 == 0 && detaillist.itemNum != 0) {
                detaillists.toplistNum++;
                getId("details_list").style.left = '-' + 1170 * detaillists.toplistNum + 'px'
            }
            this.itemNum++;
            this.num = 0;
        }
        detaillist.init(); //渲染选集数据
    },
    addCss: function () {
        getId("list" + this.num).style.background = "url(./../public/images/ZJDXdetail/lista.png) no-repeat"
    },
    removeCss: function () {
        getId("list" + this.num).style.background = "url(./../public/images/ZJDXdetail/list.png) no-repeat"
    },
    up: function () {
        this.removeCss();
        focused('up');
    },
    down: function () {
        this.removeCss();
        focused('down')
    },
    enter: function () {
        if (value.detailData.itemList[(detaillist.itemNum * 10) + detaillist.num].fee == "1") {
            // 试看第一集
            console.log('试看');
            try {
                var jsonob = {};
                json.userId = json.UserId;
                jsonob.siteId = value.siteId;
                jsonob.asset_id = value.detailData.assetId;
                jsonob.item_id = value.detailData.itemList[(detaillist.itemNum * 10) + detaillist.num].itemId
                jsonob.qb_datetime = Cookies.get('qb_datetime')
                jsonob.zb_datetime = (new Date()).valueOf()
                jsonob.time = json.zb_datetime - json.qb_datetime
                jsonob.ep = value.detailData.episodes
                jsonob.fee = '1'
                jsonob.isFullScreen = '1'
                jsonob.pos_id = Cookies.get('pos_id')
                jsonob.recmd_id = Cookies.get('recmd_id')
                jsonob.parent_page_type = '0301'
                jsonob.parent_page_id = value.detailData.assetId
                // if (detaillist.itemNum > 0) {
                //     jsonob.fee = '2'
                // }
                bi.vod(jsonob)
            } catch (e) {
                console.log('错误信息' + e)
            }
            Cookies.set('qb_datetime', (new Date()).valueOf(), {
                path: '/'
            })
            SDKDownload();
            return
        }
        // 去订购
        if (!topContent.isPlay) {
            if (isZero == 1) {
                //黑名单
                toast("您的账号存在异常，请联系客服！");
                return
            }
            try {
                var param = {
                    page_id: value.detailData.assetId,
                    page_type: '0301'
                }
                bi.orderClick(param)
                Cookies.set('orderPkg', value.detailData.assetId, {
                    path: '/'
                })
            } catch (error) {
                console.log('埋点错误', error)
            }
            // 浙江电信电影页面浏览
            try {
                var type = {
                    page_id: '1080HDJTRHB' + topContent.layout + "-0000_0002",
                    page_name: '1080高清极光融合包' + value.name + "订购",
                    refer_pos_id: '1080HDJTRHB' + topContent.layout + " - 0000_0002",
                    refer_pos_name: '1080高清极光融合包' + value.name + "订购",

                    refer_page_id: '1080HDJTRHB' + topContent.layout + '-0000',
                    refer_page_name: '1080高清极光融合包' + value.name + "订购",

                    refer_type: '',
                    refer_parent_id: '',

                    mediacode: value.detailData.assetCode,
                    medianame: value.detailData.assetName,
                    type: 0
                }
                ZJDXlog.browsing(type)
            } catch (error) {
                console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
            }
            setTimeout(function () {
                var OrderbackUrl = encodeURIComponent(window.location.href);
                window.location.href = 'http://115.233.200.60:58000/epg/entry/order.epg?siteCode=hdvod&bizCode=all_hd_order&productId=100097&backUrl=' +
                    OrderbackUrl + '&userId=' +
                    json.UserId + "&contentCode=" +
                    value.detailData.assetCode + "&contentType=" + contentType;
            }, 500)
            return
        }
        try {
            var jsonob = {}
            json.userId = json.UserId;
            jsonob.siteId = value.siteId;
            jsonob.asset_id = value.detailData.assetId;
            jsonob.item_id = value.detailData.itemList[(detaillist.itemNum * 10) + detaillist.num].itemId
            jsonob.qb_datetime = Cookies.get('qb_datetime')
            jsonob.zb_datetime = (new Date()).valueOf()
            jsonob.time = json.zb_datetime - json.qb_datetime
            jsonob.ep = value.detailData.episodes
            jsonob.fee = '1'
            jsonob.isFullScreen = '1'
            jsonob.pos_id = Cookies.get('pos_id')
            jsonob.recmd_id = Cookies.get('recmd_id')
            jsonob.parent_page_type = '0301'
            jsonob.parent_page_id = value.detailData.assetId
            // if (detaillist.itemNum > 0) {
            //     json.fee = '2'
            // }
            bi.vod(jsonob);
        } catch (e) {
            console.log('错误信息' + e);
        }
        Cookies.set('qb_datetime', (new Date()).valueOf(), {
            path: '/'
        })
        setTimeout(function () {
            SDKDownload();
        }, 200)
    }
}

var detaillists = {
    toplistNum: 0,
    init: function () {
        var html = ''
        for (var index = 0; index < value.list.length; index++) {
            if (index == value.list.length - 1) {
                html += "<div id = 'lists" + (value.list.length - 1) + "'>" + ((value.list.length - 1) * 10 + 1) + "-" + (value.detailData.itemList.length * 1) + "</div>"
            } else {
                html += "<div id='lists" + index + "'>" + ((index) * 10 + 1) + "-" + ((index + 1) * 10) + "</div>"
            }
        }
        getId("details_list").innerHTML = html
    },
    addCss: function () {
        getId("lists" + detaillist.itemNum).style.background = "url(./../public/images/ZJDXdetail/lista.png)"
    },
    removeCss: function () {
        getId("lists" + detaillist.itemNum).style.background = "url(./../public/images/ZJDXdetail/list.png)"
    },
    right: function () {
        if (detaillist.itemNum >= value.list.length - 1) {
            return
        }
        this.removeCss()
        detaillist.scroll("right");
        this.addCss()
    },
    left: function () {
        if (detaillist.itemNum <= 0) {
            return
        }
        this.removeCss();
        detaillist.scroll("left");
        this.addCss()
    },
    up: function () {
        this.removeCss();
        focused("up")
    },
    enter: function () {
    }
}

var value = {
    isAAAOrder: true,
    siteId: "27",
    detailData: {},
    isBack: false,
    detailUrl: "",
    blackJson: {},
    TxUserToken: '',
    vuId: '',
    playUrl: "",
    list: null, //详情页集数
    number: 0, //当前播放的集数
    code: "", //预留埋点信息
    msg: "",
    name: "",
    backType: 0,
    historytime: {
        time: 0,
        id: 0,
        index: 0
    },
    component: ["topContent", "detaillist", "detaillists"],
    // "specialList",
    componentNumber: 0, //组件焦点数
    getValue: function () {
        if (getParam('assetId')) {
            var backObj = getParam('assetId');
            this.backType = decodeURIComponent(getParam('epg_info').split("page_url")[1]).slice(1);
            this.backType = this.backType.substring(0, this.backType.length - 2);
            console.log(backObj);
            if (backObj) {
                Cookies.set("backUrl", "第三方退出", {
                    path: '/'
                })
                this.detailUrl = "http://115.233.200.171:39002/?s=27|11&p=yhAssetDetail&k=1&v=2&assetId=" + backObj + "&c=10"
                Cookies.set('detailUrl', this.detailUrl, {
                    path: '/'
                })
                console.log(this.detailUrl);
                try {
                    bi.start('0201', value.siteId, backObj, "31");
                } catch (error) { }
            }
        }
        getData(value.detailUrl);
    },
    removeArray: function (value) {
        var index = this.component.indexOf(value);
        if (index > -1) {
            this.component.splice(index, 1);
        }
    },
}

var getData = function (url) {
    console.log(getData.constructor);
    // var url = "http://115.233.200.171:39002/?s=26|10&p=yhAssetDetail&k=1&v=2&assetId=4606457&c=10";
    console.warn("详情页" + url + "&assetRec=0");
    $.ajax({
        type: "GET",
        url: url + '&returnType=jsonp',
        // &assetRec=0
        dataType: "jsonp",
        timeout: 5000,
        jsonpCallback: 'jsonpCallback',
        success: function (response) {
            value.detailData = response.data;
            value.list = split_array(value.detailData.itemList, 10);
            if (!value.detailData) { //资产下线/不存在，返回
                getId('toast2').style.display = 'block';
                getId('box-wrap').style.display = 'none';
                setTimeout(function () {
                    Cookies.set('pos_id', '', {
                        path: '/'
                    })
                    Cookies.set('recmd_id', '', {
                        path: '/'
                    })
                    if (value.timers != null) {
                        clearInterval(value.timers);
                    }
                    exit();
                }, 3000)
                return;
            }

            if (navigator.appVersion.indexOf("Windows") == -1) {
                var foreignId = value.detailData.assetCode;
                userPower(uploadDom, foreignId);
            } else {
                uploadDom()
            }
            // 渲染详情页ui
        },
        fail: function (error) {
            toast("网络请求失败" + url);
            getId('toast2').style.display = 'block';
            getId('box-wrap').style.display = 'none';
            exit();
        },
        complete: function (XHR, TextStatus) {
            if (TextStatus == 'timeout') { //超时执行的程序
                console.log("请求超时！");
                toast("网络请求超时" + url);
            }
        }
    })
}

function uploadDom() {
    areaObj = topContent; //初始焦点赋值
    playConfig.isOrder = Cookies.get('isOrder');
    if (playConfig.isOrder == 0) {
        topContent.isPlay = true;
    }
    if (value.detailData.layout == "Detail_Movie") {
        getId("detail").style.background = "url(./../public/images/ZJDXdetail/movie_bg.jpg)"
        getId("detail_text").style.display = 'none';
        addClass(getId("movies"), 'movies');
        value.removeArray('detaillist');
        value.removeArray('detaillists');
        value.name = '电影'
        topContent.layout = "DetailMovie"
        // 删除组件indexNews indexTotal indexNews
    } else {
        detaillist.init();
        detaillists.init();
        value.name = '电视剧'
        topContent.layout = "DetailSerise"
    }
    // contentType = encodeURIComponent({
    //     page_id: '1080HDJTJGDY' + value.detailData.layout + "_0000",
    //     page_name: '1080高清极光详情页' + value.name
    // })

    contentType = encodeURIComponent(
        '1080HDJTRHBDetail' + topContent.layout + "-0000" + "," + '1080高清极光融合包' + value.name)

    topContent.init();

    try {
        var types = {
            page_id: '1080HDJTRHB' + topContent.layout + "-0000",
            page_name: '1080高清极光详情页' + value.name,
            refer_pos_id: '',
            refer_pos_name: '',

            refer_page_id: '1080HDJTRHB' + topContent.layout + "-0000",
            refer_page_name: '1080高清极光详情页' + value.name,

            refer_type: '',
            refer_parent_id: '',

            mediacode: value.detailData.assetCode,
            medianame: value.detailData.assetName,
            type: 0
        }
        ZJDXlog.timeStart(types)
    } catch (error) {
        console.log('%cZJDX 浙江电信埋点错误', 'color: #4169E1', error)
    }

    // 页面访问上报
    // var jump = Cookies.get('jump')
    // if (jump) {
    //     jump = JSON.parse(jump)
    try {
        var jsonOb = {}
        jsonOb.page_type = '0301'
        jsonOb.page_id = value.detailData.assetId
        jsonOb.parent_page_type = null
        jsonOb.parent_page_id = null
        jsonOb.siteId = value.siteId
        console.log("访问日志：" + JSON.stringify(jsonOb))
        bi.jump(jsonOb)
    } catch (error) {
        console.log('埋点错误' + JOSN.stringify(error))
    }
}
// }

// 查询执行焦点
function focused(val) {
    if (val == 'down') {
        value.componentNumber++
    } else if (val == 'up') {
        value.componentNumber--
    } else if (typeof val == 'number') {
        value.componentNumber = val
    }
    if (value.componentNumber >= value.component.length - 1) {
        value.componentNumber = value.component.length - 1
    }
    var code = value.component[value.componentNumber];
    var codePyte
    switch (code) {
        case "topContent": //顶部
            codePyte = topContent
            break;
        case "detaillist": //上选集
            codePyte = detaillist
            break;
        case "detaillists": //下选集
            codePyte = detaillists
            break;
    }
    areaObj = codePyte;
    codePyte.addCss(true)
}

function exit() {
    var backUrl = Cookies.get("backUrl") || "./../index/home1.html";
    setTimeout(function () {
        if (backUrl == '第三方退出') {
            if (value.backType == 0) {
                try {
                    Cookies.set('detailUrl', '', {
                        path: '/'
                    });
                    window.location.href = backUrl;
                    // toast(backUrl)
                } catch (e) {
                    console.log(e)
                }
            } else {
                // toast(value.backType)
                window.location.href = value.backType;
            }
        } else {
            window.location.href = backUrl;
            // toast(backUrl)
        }
    }, 300)
}

value.getValue();

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
            // player.stop();
            // if (areaObj != descriptionBox) {
            exit();
            // } else {
            // areaObj.back()
            // }
            break;
        case "enter":
            areaObj.enter();
            break;
        case "home":
            areaObj.home();
            break;
        case "menu":
    }
};
//事件绑定
document.onkeydown = grepEvent;