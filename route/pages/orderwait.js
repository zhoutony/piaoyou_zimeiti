var util = require('util');
var model = require('../util/model');
var constant = require('../util/constant');

app.get(['/pay/orderwait/:orderId', '/:publicsignal/pay/orderwait/:orderId'], function(req, res) {
  var renderData = {};
  var publicsignal = req.params['publicsignal'];
  var orderId = req.params['orderId'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  renderData.data = {
    reversion: global.reversion,
    staticBase: global.staticBase,
    publicsignal: publicsignal,
    orderId: orderId
  };
  res.render('wecinema/orderwait', renderData);
});


app.get(['/:publicsignal/ticketresult/:orderId'], function(req, res) {
  var renderData = {};
  var apiURL = '/QueryTicketResult.aspx';
  var publicsignal = req.params['publicsignal'];
  var orderId = req.params['orderId'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  var options = {
    url: apiURL,
    passType: 'send',
    args: {
      wxchannelCode: publicsignal,
      orderID: orderId
    }
  };

  renderData.data = {};
  model.fetchDataFromBack(options, function(err, data) {
    renderData.err = err;
    if (!err && data) {
      renderData.data = data;
    }
    res.send(renderData);
  });
});
