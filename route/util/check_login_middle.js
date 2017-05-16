var model = require('./model');
var uuid = require('node-uuid');
var urlencode = require('urlencode');

//逻辑说明：
// 检查名字为open_id的cookies
// 以及名字为publicsignalshort的cookies
// open_id这个cookie里的内容是一个key/value
// 里面存着对应公众号的openid
// 登录校验逻辑会校验两者是否一致，如果一致，就通过校验
// 否则就发起微信鉴权请求
// 当然，在此之前，需要使用publicsignalshort发起对缓存当中的微信账号的秘钥的请求
// 另外，在cookie当中还植入了一个session级别的cookie用于跟踪用户请求，也可以在将来
// 在某些特殊场景来做请求粘滞
// 在入口，如果对    req.auth_debug = true ;设置了，则会启用mock的微信服务器
// 这个可以启用配置中心来优化这里的动态配置
// cookie必须是植入在res里的

function isLoggedIn(req, res, next) {
  // console.log(req.headers['user-agent']);
  var ua = req.headers['user-agent'];
  if (ua) {
    ua = ua.toLowerCase();
    if (ua.indexOf('micromessenger') >= 0) {
    } else {
      return next();
    }
  } else {
    return next();
  }

  var publicsignalshort_in_cookie = 'url';
  var open_id = req.cookies.openids;

  //调用的接口列表
  var apiURL = '/queryWeixinBaseConfigInfo.aspx';

  var options = {
    url: apiURL
  };

  var publicsignalshort_data = {};

  var getAppId = function(publicsignalshort) {
    return publicsignalshort_data;
  };

  var build_weixin_url = function(publicsignalshort) {
    var app_id = getAppId(publicsignalshort).appId;
    var open_wx_host = 'https://open.weixin.qq.com';
    var callback_host = 'http://moviefan.com.cn';

    if (req.auth_debug) {
      open_wx_host = '/mock_openwx';
      callback_host = '';
    }

    //http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html
    var callback_url = '/oauth2/toget?publicsignalshort=' + publicsignalshort + '_' + encodeURIComponent(req.url);
    var encoded_callback_url = callback_host + callback_url;

    var open_weixin_url = open_wx_host + '/connect/oauth2/authorize?' +
      'appid=' +
      app_id +
      '&redirect_uri=' +
      encoded_callback_url +
      '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
    return open_weixin_url;
  };

  model.fetchDataFromBack(options, function(err, data) {
    if (!err && data) {
      publicsignalshort_data = data;

      //如果cookies里面没有存公共号的缩写，肯定是非法页面调用，不管
      if (!publicsignalshort_in_cookie) {
        // console.error('非法页面调用');
        res.send('非法页面调用');
      }
      if (open_id) {
        return next();
      } else {
        res.redirect(build_weixin_url(publicsignalshort_in_cookie));
      }
    } else {
      //todo
    }
  });
}

exports.isLoggedIn = isLoggedIn;
