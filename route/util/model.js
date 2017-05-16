var request = require('request');

//HTTP请
var urlPrefix = 'http://weiticket.com:8086';

// 将所有的请求都包装成起来，处理报错，日志，tracking，某些缓存等等事宜
var fetchDataFromBack = function(options, callback) {
  var params = {
    time: true,
    timeout: 20000,
    uri: urlPrefix + options.url,
    json: false,
    formData: options.args,
  };

  request.post(params, function(err, response, body) {
    if (err || response.statusCode !== 200 || options.passType === 'send') {
      return callback(err, body);
    }

    // 判断是否是成功返回，如果是已经解析好了的json，直接返回
    try {
      body = JSON.parse(body);
    } catch (err) {
      console.error(err);
      return callback(err);
    }

    callback(null, body.data);
  });
};

exports.fetchDataFromBack = fetchDataFromBack;
