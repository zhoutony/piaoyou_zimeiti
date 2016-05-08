app.get(['/skippop/index'], function(req, res) {
  var renderData = {};

  renderData.data = {
    reversion: global.reversion,
    staticBase: global.staticBase
  };

  res.render('wecinema/skippop', renderData);
});
