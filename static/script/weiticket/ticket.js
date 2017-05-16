/* jshint ignore:start */
var $ = require('../lib/zepto.js');
var iScroll = require('../lib/iscroll');
var _ = require('../lib/underscore');
var cache = require('../util/session_cache.js');
var cookie = require("../util/cookie.js");
var mui = require('../lib/mui.js');
var wxbridge = require('../util/wxbridge');
var ChooseCity = require('../util/chooseCity');
var Util = require('../util/widgets');
var dialogs = require('../util/dialogs');

/* jshint ignore:end */
$(document).ready(function() {
    //定位城市
    // function getCurrentPosition () {
    //     //this.$currentCity.html('正在定位...');
    //     widgets.getCurrentPosition(function (coords) {
    //         alert(coords.longitude+ '    ' +coords.latitude);
    //         // ajax.get('/GetCityByLongitudelatitude.api?longitude=' + coords.longitude + '&latitude=' + coords.latitude, _.bind(function (city) {
    //         //     if (city && city.cityId) {
    //         //         app.user.setCity(city.cityId, city.name);
    //         //         this.$currentCity.html(city.name);
    //         //         this.$currentCity.attr('data-id', city.cityId);
    //         //         this.$currentCity.attr('data-name', city.name);
    //         //     }
    //         // }, this), 'json');
    //     }, function () {
    //         //this.$currentCity.html('定位失败');
    //     });
    // }
    // getCurrentPosition();
    // 获取当前位址
    function getCurrentPosition() {
        var _chooseCity = $('#chooseCitys'),
            city = cookie.getItem('city'),
            locationId;
        if (city) {
            city = JSON.parse(city);
            _chooseCity.find('span').html(city.name);
            locationId = city.locationId;
        }

        // 设置时效为30天的坐标信息
        cookie.setItem(
            'currentCoords',
            JSON.stringify({
                latitude: GetQueryString('latitude'),
                longitude: GetQueryString('longitude')
            }),
            60 * 60 * 24 * 30, '/');

        $.get('/queryLocation/' + GetQueryString('longitude') + '/' + GetQueryString('latitude'), function(renderData) {
            if (renderData && renderData.location) {
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

                dialogs.confirm(message, function() {
                    setCity({
                        locationId: location.locationID,
                        name: location.nameCN
                    });
                });
            }
        });

    }

    // 获取当前位址
    if (location.href.indexOf('dsmovieapp') != -1) {
        getCurrentPosition();
    } else {
        wxbridge.getLocation();
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
        var activity_number = Math.random();
        location.href = '/' + window.publicsignal + '/' + city.locationId + '/ticket/' + movieId + '?' + activity_number;
    }

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    if (window.location.href.indexOf('ticket_activity') != -1) {
        var movieUrl = window.location.href.split('/');
        var movieFrom = movieUrl[7].split('?');
        var activity = { activityID: movieUrl[6], from: movieFrom[0] };
        var cookieExpired = 0;
        cookie.setItem('activity', JSON.stringify(activity), cookieExpired, '/');
    }

    var openId = cookie.getItem('openids');

    var filmlists = $('.filmlist');
    var _len = filmlists.length;
    var _chooseCity = $('.city'),
        city = cookie.getItem('city');
    if (city) {
            // console.log(city);
            if( !JSON.parse(city).hasOwnProperty('locationId')){
                // 设置 Cookie
                var cookieExpired = 60 * 60 * 24 * 30; //30天
                var cookiePath = '/';
                cookie.setItem('city', "{\"locationId\":110100,\"name\":\"北京市\"}", cookieExpired, cookiePath);
            }
            city = JSON.parse(city);
                _chooseCity.find('span').html(city.name);
                locationId = city.locationId;

            
        }

    for (var i = 0; i < _len; i++) {
        if (i > 1) {
            $(filmlists[i]).addClass('hidefilm');
        }
    }
    $('._dt').on('click', function(evt) {
        var _el = $(this.parentElement);
        if (_el.hasClass('hidefilm')) {
            _el.removeClass('hidefilm');
        } else {
            _el.addClass('hidefilm');
        }
        return;
    })

    $('#sparpreis_button').on('click', function() {
        if ($('.sparpreis').hasClass('f-show')) {
            $('.sparpreis').removeClass('f-show');
        } else {
            $('.sparpreis').addClass('f-show');
        }
    });

    _chooseCity.on('click', function(evt) {
        ChooseCity.init(function(city) {
            var cookieExpired = 60 * 60 * 24 * 30; //30天
            var cookiePath = '/';
            if (window.location.href.indexOf('ticket_activity') != -1) {
                var _activity = JSON.parse(cookie.getItem('activity')).activityID;
                var _from = JSON.parse(cookie.getItem('activity')).from;
            }

            cookie.setItem('city', JSON.stringify(city), cookieExpired, cookiePath);

            if (window.location.href.indexOf('ticket_activity') != -1) {
                location.href = '/' + window.publicsignal + '/' + city.locationId + '/ticket_activity/' + _activity + '/' + _from;
            } else {
                location.href = '/' + window.publicsignal + '/' + city.locationId + '/ticket/' + movieId;
            }

        }.bind(this))
    })

    //分享
    var _shareInfo = window.shareInfo && window.shareInfo;
    if (!_shareInfo) {
        _shareInfo = {};
    }
    var shareImgs = $('.infocon').find('img');
    if (window.movie) {
        wxbridge.share({
            title: _shareInfo.title ? _shareInfo.title : '觉得《' + movie.movieNameCN + '》值得一看哦，有空吗？',
            timelineTitle: _shareInfo.title ? _shareInfo.title : '觉得《' + movie.movieNameCN + '》值得一看哦，有空吗？',
            desc: _shareInfo.title ? _shareInfo.title : '[电影票友]荐：' + movie.intro,
            link: window.location.href,
            imgUrl: _shareInfo.title ? _shareInfo.title : movie.movieImage,
            callback: function(shareobj) {

                Util.shearCallback(publicsignal, openId, movie.movieID, 5, shareobj, function() {
                        console.log('分享成功，并发送服务器');
                    })
                    // location.href = 'http://weixin.qq.com/r/fEPm40XEi433KAGAbxb4';
            }
        })
    }


    // var shareImgs = $('.infocon').find('img');
    // wxbridge.share({
    //     title: Util.strShort($('.infotit').html(), 25)  + ' -' + weMediaName,
    //     timelineTitle: '[电影票友]荐：' + Util.strShort($('.infotit').html(), 20) + ' -' + weMediaName,
    //     desc: '[电影票友]荐：' + (window._summary != '' ? window._summary : '在电影的时光读懂自已     www.moviefan.com.cn'),
    //     link: window.location.href,
    //     imgUrl: shareImgs.length > 0 ? shareImgs[0].src : $('.logobox').find('img')[0].src,
    //     callback: function(){
    //         shareTip();
    //         Util.shearCallback(publicsignal, openId, newsId, 2, function(){
    //             console.log('分享成功，并发送服务器');
    //         })
    //         // location.href = 'http://weixin.qq.com/r/fEPm40XEi433KAGAbxb4';
    //     }
    // })

    //统计
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?d823a1b219c3dca51751fbaee9ca95ec";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();

}); //END of jquery documet.ready
