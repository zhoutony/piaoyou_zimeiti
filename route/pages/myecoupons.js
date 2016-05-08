var model = require('../util/model');
var chk_login = require('../util/check_login_middle');

//代金券列表
app.get(['/:publicsignalshort/member/myecoupons'], chk_login.isLoggedIn, function(req, res) {
  var renderData = {};
  var options = {
    url: '/cardticket/list',
    args: {
      publicsignalshort: req.params['publicsignalshort'],
      openid: req.cookies.openids
    }
  };

  renderData.data = {
    publicsignalshort: req.params['publicsignalshort'],
    open_id: req.cookies.open_id.openid,
    cinema_id: req.cookies.cinema_id,
    title: '',
    reversion: global.reversion,
    staticBase: global.staticBase
  };

  model.fetchDataFromBack(options, function(err, data) {
    renderData.data.err = err;
    if (!err && data && data.length !== 0) {
      renderData.data.myecoupons = data;
    }
    res.render('wecinema/ecoupons', renderData);
  });
});

//代金券详情
app.get(['/:publicsignalshort/member/ecouponsinfo/:code'], chk_login.isLoggedIn, function(req, res) {
  var publicsignalshort = req.params['publicsignalshort'];
  var code = req.params['code'];
  if (code != '') {
    var options = {
      url: '/cardticket/info',
      args: {
        publicsignalshort: publicsignalshort,
        code: code
      }
    };

    var renderData = {};
    renderData.data = {
      cinema_id: req.cookies.cinema_id
    };

    model.fetchDataFromBack(options, function(err, data) {
      renderData.data.err = err;
      if (!err && data) {
        renderData.data.ecouponsinfo = data;
      }
      res.render('wecinema/ecoupons_detail', renderData);
    });
  }
  else {
    res.redirect(publicSignalShort + '/member/myecoupons');
  }
});
