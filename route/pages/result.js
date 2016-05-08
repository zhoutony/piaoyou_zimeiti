var model = require('../util/model');
var chk_login = require('../util/check_login_middle');

app.get('/:publicsignalshort/payment_result/:order_id', chk_login.isLoggedIn, function(req, res, next) {

  //渲染准备用数据
  var renderData = {};
  renderData.data = {
    reversion: global.reversion,
    staticBase: global.staticBase
  };

  renderData.data.publicsignalshort = req.params['publicsignalshort'];
  renderData.data.order_id = req.params['order_id'];
  renderData.data.viewColor = req.cookies['view_color_' + publicsignalshort];
  res.render('wecinema/result', renderData);

});


app.get('/:publicsignalshort/order_detail/:order_id', function(req, res, next) {
  var renderData = {};
  renderData.data = {};

  var options = {
    url: '/order/detail',
    args: {
      user_id: req.cookies.openids,
      publicSignalShort: req.params['publicsignalshort'],
      order_id: req.params['order_id']
    }
  };

  model.fetchDataFromBack(options, function(err, data) {
    renderData.data.order = data;
    res.send(renderData);
  });

});
