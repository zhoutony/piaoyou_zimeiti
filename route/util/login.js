var request = require('request');
var model = require('./model');

app.route('/mock_openwx/connect/oauth2/authorize').get(function(req, res) {
  var callback_url = req.query.redirect_uri + '&code=codefortest';
  res.redirect(callback_url);
});

var send_request_wx = function(access_token_url, publicsignalshort, cb) {
  request(access_token_url, function(err, response, body) {
    var data = {};

    if (err) {
      return cb(err);
    }

    try {
      data = JSON.parse(body);
    } catch (err) {
    }

    if (data.hasOwnProperty('openid')) {
      cb(null, data.openid);
    } else {
      cb('微信认证失败');
    }
  });
};

app.route('/oauth2/toget').get(function(req, res) {
  var if_had_code = req.query.hasOwnProperty('code');
  var if_had_publicsignalshort = req.query.hasOwnProperty('publicsignalshort');
  var code = req.query.code;
  var publicsignalshortArr = req.query.publicsignalshort.split('_');
  var publicsignalshort = publicsignalshortArr[0];
  //var cinema_id                          = publicsignalshortArr[1];
  var req_url = publicsignalshortArr[1];
  if (!req_url) {
    req_url = publicsignalshort + '/choose_cinema/';
  }

  //调用的接口列表
  var apiURL = '/queryWeixinBaseConfigInfo.aspx';

  var options = {
    url: apiURL,
    args: {}
  };

  var publicsignalshort_data = {};

  var getAppId = function(publicsignalshort) {
    return publicsignalshort_data;
  };

  var build_access_token_url = function(publicsignalshort) {
    var access_url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' +
      getAppId(publicsignalshort).appId +
      '&secret=' +
      getAppId(publicsignalshort).appSecret +
      '&code=' +
      code +
      '&grant_type=authorization_code';
    return access_url;
  };

  model.fetchDataFromBack(options, function(err, data) {
    if (!err) {
      publicsignalshort_data = data;
      if (if_had_code && if_had_publicsignalshort) {
        var url = build_access_token_url(publicsignalshort);

        send_request_wx(url, publicsignalshort, function(err, data) {
          if (!err) {
            res.cookie('openids', data, {
              maxAge: 1000 * 60 * 60 * 24 * 30,
              path: '/'
            });
            res.redirect(req_url);
          } else {
            res.send(err);
          }
        });
      } else {
        res.send('获取微信code失败');
      }
    } else {
      //todo
    }
  });

});//调用微信oauth2的回调接口。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
