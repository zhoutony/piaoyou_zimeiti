var util = require('util');
var model = require('../util/model');
var constant = require('../util/constant');
var chk_login = require('../util/check_login_middle');

app.get(['/:locationID/filmlist/:showtype',
  '/:locationID/filmlist/:showtype/:sole',
  '/:publicsignal/:locationID/filmlist/:showtype',
  '/:publicsignal/:locationID/filmlist/:showtype/:sole'], chk_login.isLoggedIn, function(req, res) {
  var renderData = {};
  var apiURL = '/queryMovies.aspx';
  var _locationID = req.params['locationID'];
  var cookieCity = req.cookies.city ? JSON.parse(req.cookies.city).locationId : _locationID;
  var showtype = req.params['showtype'];//coming
  var type = showtype == 'hot' ? 1 : 2;
  var sole = req.params['sole'];

  var publicsignal = req.params['publicsignal'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }

  var options = {
    url: apiURL,
    args: {
      locationID: _locationID,//110000
      type: type,
      wxchannelCode: publicsignal
    }
  };

  renderData.data = {};
  renderData.data = {
    showtype: showtype,
    locationId: cookieCity,
    publicsignal: publicsignal,
  };

  model.fetchDataFromBack(options, function(err, data) {
    renderData.data.err = err;
    if (!err && data && data.movies) {
      renderData.data.movies = data.movies;
      renderData.data.shareInfo = data.shareInfo;
    }

    //隐藏工具条
    renderData.data.isToolHide = true;
    if (!sole) {
      res.render('wecinema/filmlist', renderData);
    } else {
      res.render('wecinema/movieList', renderData);
    }
  });
});

// 顶部广告
app.get(['/get/queryadvertisements/:type', '/:publicsignal/get/queryadvertisements/:type'], function(req, res) {
  var renderData = {};
  var apiURL = '/queryAdvertisements.aspx';
  var _type = parseInt(req.params['type']);
  var publicsignal = req.params['publicsignal'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  var options = {
    url: apiURL,
    args: {
      type: _type,
      wxchannelCode: publicsignal
    }
  };

  renderData.data = {};
  model.fetchDataFromBack(options, function(err, data) {
    renderData.data.err = err;
    if (!err && data && data.advertisements) {
      renderData.data.fourthAds = data.advertisements;
      renderData.data.isIndicator = _type == 4 ? true : false;
    }

    res.render('wecinema/filmlistAds', renderData);
  });
});
