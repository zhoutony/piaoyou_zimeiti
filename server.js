var fs = require('fs');
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 运行环境
var isDeveloping = process.env.NODE_ENV == 'development';

// 日志
var logger = require('./lib/log').logger('server');

// 服务器设置
global.app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'jade');

// 打开express的代理服务特性
app.enable('trust proxy');

// 静态资源
app.locals.assets = require('./assets.json');
app.locals.staticBase = isDeveloping ? '' : '//js.moviefan.com.cn/piaoyou_fe';
app.locals.reversion = '';
try {
  app.locals.reversion = fs.readFileSync('./.revision', { encoding: 'utf-8' });
} catch (err) {
}

app.use(express.static(path.resolve(__dirname, 'dist')));

// 错误处理
app.use(function(err, req, res, next) {
  logger.fatal(err.stack);
  res.status(500);
  res.render('500', {
    error: err,
  });
});

require('./route');
require('./app/server');

var server = app.listen(3001, function() {
  console.log('Listening on port %d', server.address().port);
});
