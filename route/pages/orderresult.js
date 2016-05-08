var util = require('util');
var constant = require('../util/constant.js');

app.get(['/order/succeed', '/:publicsignal/order/succeed'], function(req, res) {
  var renderData = {};
  var publicsignal = req.params['publicsignal'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  renderData.data = {
    publicsignal: publicsignal,
    reversion: global.reversion,
    staticBase: global.staticBase
  };

  res.render('wecinema/ordersucc', renderData);
});


app.get(['/order/eorr', '/:publicsignal/order/eorr'], function(req, res) {
  var renderData = {};
  var publicsignal = req.params['publicsignal'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }

  renderData.data = {
    publicsignal: publicsignal,
    reversion: global.reversion,
    staticBase: global.staticBase
  };

  res.render('wecinema/ordereorr', renderData);
});
