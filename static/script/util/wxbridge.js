var $ = require('../lib/zepto.js');
var wx = require('../lib/wx.js');
var $ = require('../lib/zepto.js');
var iScroll = require('../lib/iscroll');
var _ = require('../lib/underscore');
var cache = require('../util/session_cache.js');
var cookie = require("../util/cookie.js");
var mui = require('../lib/mui.js');
var Util = require('../util/widgets.js');
var wxbridge = require('../util/wxbridge');
var dialogs = require('../util/dialogs');
// var Citys = require('./citys');
var ChooseCity = require('../util/chooseCity');
var index = 0;
//验证签名
function wx_verif(force,debug){
    if(!wx){return;}
    var _force = force,_debug = debug;
    // var   verif_Url = ['http://wx.wepiao.com','http://yx.wepiao.com','http://weixin.wepiao.com'];//, 'http://piaofang.wepiao.com'
    // if(verif_Url.indexOf(window.location.origin) == -1){
    //     //alert("您当前不在微信电影票的认证域名,不能使用分享功能");
    //     return;
    // }
    getcap(_force,_debug);
}

function getcap(_force,_debug){
    var url = '/publicsignal/queryJsapiticket';
    var option = {
        "url": window.location.href.split('#')[0],
        "wxchannelCode": window.publicsignal ? window.publicsignal : ''
    };
    
    $.post(url, option, function(result) {
        
        if (result && result.data) {
            
            var return_data = JSON.parse(result.data);
            if(return_data.success && return_data.errorCode == 1){
                var data = return_data.data;
                wx.config({
                    debug: _debug,//如果在测试环境可以设置为true，会在控制台输出分享信息； //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId:data.appId, // 必填，公众号的唯一标识
                    timestamp:data.timestamp , // 必填，生成签名的时间戳
                    nonceStr:data.nonceStr, // 必填，生成签名的随机串
                    signature:data.signature,// 必填
                    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填
                });

                wx.error(function(res){
                    
                    //签名过期导致验证失败
                    if(res.errMsg != 'config:ok' && index <= 2){//如果签名失效，不读缓存，强制获取新的签名
                        // alert('签名失效');
                        console.log("签名失效");
                        wx_verif(1,false);
                    }
                });
            }
        } else {
            console.log("签名失效");
        }
        index++;
    });
}

//分享
function share(param){
    var _param = {
        title : param.title || '',// 分享标题
        timelineTitle: param.timelineTitle || '', // 朋友圈分享标题
        link : param.link || '',// 分享链接
        imgUrl : param.imgUrl || '',// 分享图标
        desc : param.desc || '',// 分享描述,分享给朋友时用
        type : param.type || 'link',// 分享类型,music、video或link，不填默认为link,分享给朋友时用
        dataUrl : param.dataUrl || '', // 如果type是music或video，则要提供数据链接，默认为空,分享给朋友时用
        callback: param.callback || function (){}//分享回调
    };

    //alert(JSON.stringify(_param));
    wx.ready(function(res){
        //  wx.hideAllNonBaseMenuItem();
        //alert('wx ready');
        wx.showOptionMenu({
            menuList: [
                'menuItem:share:appMessage',
                'menuItem:share:timeline'
            ]
        });

        //wx.hideMenuItems({
        //    menuList: ['menuItem:copyUrl','menuItem:openWithSafari','menuItem:share:brand'] // 要隐藏的菜单项，所有menu项见附录3
        //});
        //校验分享接口是否可用
        wx.checkJsApi({
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','hideMenuItems'],
            success: function(res) {
                if((res.checkResult.onMenuShareTimeline=!!false) || (res.checkResult.onMenuShareAppMessage=!!false)){
                    return false;
                }
            }
        });
        //分享到朋友圈
        wx.onMenuShareTimeline({
            title : _param.timelineTitle,
            desc : _param.desc,
            link : _param.link,
            imgUrl : _param.imgUrl,
            success : function (res) {
                // 用户确认分享后执行的回调函数
                _param.callback('timeline');

            },
            cancel: function (res) {

                // 用户取消分享后执行的回调函数
            }
        });
        //分享给朋友
        wx.onMenuShareAppMessage({
            title : _param.title,
            desc : _param.desc,
            link : _param.link,
            imgUrl : _param.imgUrl,
            type : _param.type,
            dataUrl : _param.dataUrl,
            success : function (res) {
                // 用户确认分享后执行的回调函数
                _param.callback('appmessage');


            },
            cancel: function (res) {

                // 用户取消分享后执行的回调函数
            }
        });
    });
}

// 获取当前位址
    var _chooseCity = $('#chooseCity'),
        cityEl,
        city = cookie.getItem('city'),
        locationId;
    var openId = cookie.getItem('openids');
    if(city){
        city = JSON.parse(city);
        _chooseCity.find('span').html(city.name);
        locationId = city.locationId;
    }
    function wxGetPosition (latitudes,longitudes) {

            // 设置时效为30天的坐标信息
                    cookie.setItem(
                        'currentCoords',
                        JSON.stringify({
                            latitude: latitudes,
                            longitude: longitudes
                        }),
                        60 * 60 * 24 * 30, '/');

            $.get('/queryLocation/' + longitudes + '/' + latitudes, function(renderData){
                if(renderData && renderData.location){
                    var location = renderData.location;

                    // 如果页面已经是当前城市的, 就不处理了
                    if ((locationId || 110100) === location.locationID) {
                        if (location.locationID === 110100) {
                            setCity({
                                locationId: location.locationID,
                                name: location.nameCN
                            }, true);
                        }

                        return;
                    }

                    var message = _.template('<p>当前定位您在 <%= city%>，是否切换？</p>')({
                        city: location.nameCN
                    });

                    dialogs.confirm(message, function () {
                        setCity({
                            locationId: location.locationID,
                            name: location.nameCN
                        });
                    });
                }
            });
        
    }

    // 设置城市
    function setCity(city, dontRedirect) {
        // 设置 Cookie
        var cookieExpired = 60 * 60 * 24 * 30; //30天
        var cookiePath = '/';
        cookie.setItem('city', JSON.stringify(city), cookieExpired, cookiePath);

        if (dontRedirect) {
            return;
        }

        // 跳转页面
        
        if(window.location.href.indexOf('ticket') != -1){
            
            if (window.location.href.indexOf('ticket_activity') != -1) {
                    var _activity = JSON.parse(cookie.getItem('activity')).activityID;
                    var _from = JSON.parse(cookie.getItem('activity')).from;
                    location.href = '/'+ window.publicsignal + '/' + city.locationId + '/ticket_activity/' + _activity+'/'+_from;
                }
                else{
                    location.href = '/'+ window.publicsignal + '/' + city.locationId + '/ticket/' + movieId;
                }
        }
        else{
            var subPage = '/filmlist/hot';
            var activity_number = Math.random();
            location.href = '/'+ window.publicsignal + '/' + city.locationId + subPage + '?' + activity_number;
        }
    }


//定位
function getLocation(){
   
   
    wx.ready(function(res){
        
        //获取地理位置接口
        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
               wxGetPosition(latitude,longitude);
            }
        });
    });
}

wx_verif(0, false);

var WxBridge = {

    auth: wx_verif,
    share: share,
    getLocation: getLocation

}
module.exports = WxBridge;







