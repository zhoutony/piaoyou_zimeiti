var util = require('util');

app.get(['/login/index'], function(req, res) {
  var renderData = {};

  renderData.data = {
    reversion: global.reversion,
    staticBase: global.staticBase
  };
  res.render('wecinema/login', renderData);
});
