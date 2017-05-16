var request = require('request');
var model = require('./model');

app.route('/mock_openwx/connect/oauth2/authorize').get(function(req, res) {
    var callback_url = req.query.redirect_uri + '&code=codefortest';
    res.redirect(callback_url);
});

var send_request_wx = function(access_token_url, publicsignalshort, cb) {
    request(access_token_url, function(err, response, body) {
        if(!err && response.statusCode === 200){
            var data = {},
                hasError = false,
                _err = null;

            // if (err) {
            //     return cb(err);
            // }

            try {
                data = JSON.parse(body);
                if (data.hasOwnProperty('openid')) {
                    cb(null, data);
                    // console.log('openid:',data)
                    return;
                } else {
                    cb('微信认证失败');
                    return;
                }
            } catch (e) {
                _err = e;
                hasError = true;
                console.log(err);
                cb(e);
                return;
            }
            
            
        } else {
            cb('微信认证失败');
            return;
        }
    });
};

app.route('/oauth2/toget').get(function(req, res) {
    if(req.query == null) return;
    // console.log(req.query);
    var if_had_code = req.query.hasOwnProperty('code');
    var if_had_publicsignalshort = req.query.hasOwnProperty('publicsignalshort');
    var code = req.query.code;
    try{
        var publicsignalshortArr = req.query.publicsignalshort.split('_');
        var publicsignalshort = publicsignalshortArr[0];
        //var cinema_id                          = publicsignalshortArr[1];
        var req_url = publicsignalshortArr[1];
        if (!req_url) {
            req_url = publicsignalshort + '/choose_cinema/';
        }
    }
    catch(err){
        console.log(err);
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
                        res.cookie('openids', data.openid, {
                            maxAge: 1000 * 60 * 60 * 24 * 30,
                            path: '/'
                        });


                        var params = {
                            time: true,
                            timeout: 20000,
                            uri: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + data.access_token + '&openid=' + data.openid + '&lang=zh_CN',
                            json: false,
                            formData: null,
                        };
                        request.get(params, function(err, response, body) {
                            if (err || response.statusCode !== 200 || options.passType === 'send') {
                                console.log(err, body);
                            }

                            // 判断是否是成功返回，如果是已经解析好了的json，直接返回
                            try {
                                body = JSON.parse(body);
                            } catch (err) {
                                console.error(err);
                                // return callback(err);
                            }
                            res.cookie('wxUser', JSON.stringify(body), {
                                maxAge: 1000 * 60 * 60 * 24 * 30,
                                path: '/'
                            });

                            var userparams = {
                                time: true,
                                timeout: 20000,
                                uri: 'http://weiticket.com:8086/AddUser.aspx',
                                json: false,
                                formData: {body:JSON.stringify(body)},
                            };
                            request.get(userparams, function(err, response, body) {

                            });
                            // console.log(body);
                            // return body;
                            // callback(null, body.data);
                            res.redirect(req_url);
                        });

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

}); //调用微信oauth2的回调接口。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
