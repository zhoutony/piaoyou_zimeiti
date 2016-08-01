var util = require('util');
var model = require('../util/model');
var chk_login = require('../util/check_login_middle');
var DateMethod = require('../util/date.js');
var constant = require('../util/constant.js');

// app.get(['/movienews/:sourceId/:movieNewId', '/:publicsignal/movienews/:sourceId/:movieNewId'], chk_login.isLoggedIn, function(req, res) {
//   var renderData = {};
//   var apiURL = '/queryMovieNewsByID.aspx';
//   var movieNewId = req.params['movieNewId'];
//   var sourceId = req.params['sourceId'];
//   var open_id = req.cookies.openids || '';
//   var publicsignal = req.params['publicsignal'];
//   if (!publicsignal) {
//     publicsignal = constant.str.PUBLICSIGNAL;
//   }
//   var options = {
//     url: apiURL,
//     args: {
//       newsID: movieNewId,
//       openId: open_id,
//       wxchannelCode: publicsignal
//     }
//   };
//   var city = req.cookies.city,
//     locationId = 110100;
//   if (city) {
//     city = JSON.parse(city);
//     if (city.locationId) {
//       locationId = city.locationId;
//     }
//   }

//   renderData.data = {};
//   renderData.data = {
//     reversion: global.reversion,
//     staticBase: global.staticBase
//   };
//   // console.log(global.reversion,global.staticBase);
//   model.fetchDataFromBack(options, function(err, data) {
//     // console.log(data)
//     renderData.data.err = err;
//     if (!err && data) {
//       renderData.data = data;
//       renderData.data.newsInfo.publishtime = DateMethod.movieNewsDate(renderData.data.newsInfo.publishtime);
//       renderData.data.reversion = global.reversion;
//       renderData.data.staticBase = global.staticBase;
//       renderData.data.sourceId = sourceId;
//       renderData.data.newsId = movieNewId;
//       renderData.data.publicsignal = publicsignal;
//       renderData.data.locationId = locationId;
//       // console.log(data);
//       if (data.newsInfo && data.newsInfo.content) {
//         var content = data.newsInfo.content;
//         renderData.data.newsInfo.content = content.toString().replace(/script/g, 'link');
//       }
//     }
//     res.render('wecinema/movienews', renderData);
//   });
// });

// 顶部广告
app.get(['/get/queryadvertisements', '/:publicsignal/get/queryadvertisements'], function(req, res) {
  var renderData = {};
  var apiURL = '/queryAdvertisements.aspx';
  var publicsignal = req.params['publicsignal'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  var options = {
    url: apiURL,
    args: {
      type: '5',
      wxchannelCode: publicsignal
    }
  };
  renderData.data = {};
  model.fetchDataFromBack(options, function(err, data) {
    // console.log(data);
    renderData.data.err = err;
    if (!err && data && data.advertisements) {
      renderData.data.fourthAds = data.advertisements;

    } else {

    }
    res.render('wecinema/filmlistAds', renderData);
  });
});
