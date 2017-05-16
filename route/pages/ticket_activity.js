var util = require('util');
var model = require('../util/model');
var chk_login = require('../util/check_login_middle');
var constant = require('../util/constant');

app.get(['/:cityId/ticket_activity/:activityId/:from', '/:publicsignal/:cityId/ticket_activity/:activityId/:from'], chk_login.isLoggedIn, function(req, res) {
  var renderData = {};
  var apiURL = '/queryActivityCinemas.aspx';
  var cityId = req.params['cityId'];
  var cityID = req.cookies.city ? JSON.parse(req.cookies.city).locationId : cityId;
  // var movieId = req.params['movieId'];
  var activityId = req.params['activityId'];
  var from = req.params['from'];
  var publicsignal = req.params['publicsignal'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  var options = {
    url: apiURL,
    args: {
      locationID: cityID,
      // movieID: movieId,
      activityID: activityId,
      from: from,
      pageIndex: 1,
      pageSize: 100,
      wxchannelCode: publicsignal
    }
  };


  // 获取用户坐标
  var currentCoords;

  try {
    currentCoords = JSON.parse(req.cookies.currentCoords);

  } catch (err) {
  }

  if (currentCoords && currentCoords.longitude && currentCoords.latitude) {
    options.args.longitude = currentCoords.longitude;
    options.args.latitude = currentCoords.latitude;
    
  }
  renderData.data = {};
  renderData.data = {
    reversion: global.reversion,
    staticBase: global.staticBase,
    cinemas: [],
    movie: [],
    publicsignal: publicsignal
  }
  // console.log(`http://weiticket.com:8086/queryActivityCinemas.aspx?${$.param(params)}`);
  model.fetchDataFromBack(options, function(err, data) {
    
    renderData.data.err = err;
    if (!err && data) {
      var cinemas = data.cinemas;
      renderData.data.cinemas = getCinemas(cinemas);
      renderData.data.movie = data.movie;
      renderData.data.shareInfo = data.shareInfo;
      renderData.data.cityName = cinemas && cinemas.length ? cinemas[0].cityName : '';
    }
    res.render('wecinema/ticket_activity', renderData);
  });
});


function getCinemas(_cinemas) {
  if (_cinemas) {
    var _len = _cinemas.length,
      cinemas = [];
    if (_len > 0) {
      var UpperMap = {};
      for (var i = 0; i < _len; i++) {
        var cinema = _cinemas[i];
        var UpperFirst = cinema.districtName;
        if (UpperMap[UpperFirst] === undefined) {
          UpperMap[UpperFirst] = [];
          UpperMap[UpperFirst].push(cinema);
        } else {
          UpperMap[UpperFirst].push(cinema);
        }
      }
      return UpperMap;
    } else {
      return {};
    }
  } else {
    return {};
  }
}
