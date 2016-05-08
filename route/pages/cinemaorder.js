var util = require('util');
var model = require('../util/model');

app.get(['/cinemaorder/index'], function(req, res) {
  var renderData = {};

  var options = {
    url: '/queryOrder.aspx',
    args: {},
  };

  renderData.data = {};

  model.fetchDataFromBack(options, function(err, data) {
    renderData.data.err = err;
    if (!err && data) {
      renderData.data = data;
    }

    res.render('wecinema/cinemaorder', renderData);
  });
});
