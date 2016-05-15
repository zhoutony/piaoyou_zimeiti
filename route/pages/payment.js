var util = require('util');
var model = require('../util/model');
var constant = require('../util/constant');
var chk_login = require('../util/check_login_middle');

// app.get(['/payment/:showtimeId/:orderId/index',
//   '/:publicsignal/payment/:showtimeId/:orderId/index',
//   '/payment/order'], chk_login.isLoggedIn, function(req, res) {
//   var publicsignal = req.params['publicsignal'],
//     showtimeId = req.params['showtimeId'],
//     orderId = req.params['orderId'];
//   if (!publicsignal) {
//     publicsignal = constant.str.PUBLICSIGNAL;
//   }
//   //渲染准备用数据
//   var renderData = {};
//   // QueryWeixinPlayParam.aspx

//   renderData.data = {};
//   renderData.data = {
//     reversion: global.reversion,
//     staticBase: global.staticBase,
//     publicsignal: publicsignal,
//     showtimeId: showtimeId,
//     orderId: orderId
//   };

//   res.render('wecinema/payment', renderData);
// });


app.post(['/payment/:orderid', '/:publicsignal/payment/:orderid'], function(req, res) {
  //渲染准备用数据
  var renderData = {};
  var apiURL = '/QueryWeixinPlayParam.aspx';
  var orderid = req.params['orderid'];
  var options = {
    url: apiURL,
    passType: 'send',
    args: req.body
  };

  model.fetchDataFromBack(options, function(err, data) {
    renderData.err = err;
    if (!err && data) {
      renderData.data = data;
    }
    res.send(renderData);
  });
});
