app.get(['/video', '/:publicsignal/video'], function(req, res) {
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
  res.render('wecinema/video', renderData);
});
