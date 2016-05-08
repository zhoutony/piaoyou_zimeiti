var util = require('util');
var model = require('../util/model');
var constant = require('../util/constant');

app.get(['/selflist', '/:publicsignal/selflist'], function(req, res) {
  var options = {
    url: '/QueryNewsSourceList.aspx',
    args: {
      openId: req.cookies.openids || ''
    }
  };
  var publicsignal = req.params['publicsignal'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }

  model.fetchDataFromBack(options, function(err, data) {
    data = !err && data ? data : {};
    data.reversion = global.reversion;
    data.staticBase = global.staticBase;
    data.publicsignal = publicsignal;

    res.render('wecinema/selflist', {
      data: data
    });
  });
});

app.get(['/selflist/subscribe/:sourceId'], function(req, res) {
  var options = {
    url: '/SubscriberWeMedia.aspx',
    args: {
      sourceID: req.params.sourceId,
      openId: req.cookies.openids || ''
    }
  };

  model.fetchDataFromBack(options, function(err) {
    res.json({err: err});
  });
});

app.get(['/selflist/unsubscribe/:sourceId'], function(req, res) {
  var options = {
    url: '/UnSubscriberWeMedia.aspx',
    args: {
      sourceID: req.params.sourceId,
      openId: req.cookies.openids || ''
    }
  };

  model.fetchDataFromBack(options, function(err, data) {
    res.json({err: err, data: data});
  });
});
