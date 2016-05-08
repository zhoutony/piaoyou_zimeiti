/*
 * Created by LemonHall on 2015/4/
 */
var _ = require('underscore');
var util = require('util');
var model = require('../util/model');

var constant = require('../util/constant');
var DateMethod = require('../util/date');

// 首页
// app.get(['/', '/index.html', '/:publicsignal'], function(req, res) {
//   var renderData = {};
//   var apiURL = '/queryAdvertisements.aspx';
//   var city = req.cookies.city,
//     locationId = 110100;
//   if (city) {
//     city = JSON.parse(city);
//     if (city.locationId) {
//       locationId = city.locationId;
//     }
//   }
//   var publicsignal = req.params['publicsignal'];
//   if (!publicsignal) {
//     publicsignal = constant.str.PUBLICSIGNAL;
//   }
//   // console.log('publicsignal:', publicsignal)
//   var options = {
//     url: apiURL,
//     args: {
//       type: '1,2,3',
//       wxchannelCode: publicsignal
//     }
//   };
//   renderData.data = {};
//   renderData.data = {
//     reversion: global.reversion,
//     staticBase: global.staticBase,
//     firstAds: [],
//     secondAds: [],
//     thirdAds: [],
//     locationId: locationId,
//     publicsignal: publicsignal
//   };
//   model.fetchDataFromBack(options, function(err, data) {
//     // console.log(data);
//     renderData.data.err = err;
//     if (!err && data) {
//       var ads = data.advertisements;
//       var _len = ads.length;
//       for (var i = 0; i < _len; i++) {
//         if (ads[i].advertisementType == 1) {
//           renderData.data.firstAds.push(ads[i]);
//         } else if (ads[i].advertisementType == 2) {
//           renderData.data.secondAds.push(ads[i]);

//         } else {
//           renderData.data.thirdAds.push(ads[i]);
//         }
//       }
//       renderData.data.baseData = data;
//       renderData.data.cachetime = data.shareInfo.cachetime;
//     }
//     //隐藏工具条
//     renderData.data.isToolHide = true;
//     res.render('wecinema/index', renderData);
//   });
// });

// 头条电影列表
app.get(['/hotmovienews', '/:publicsignal/hotmovienews'], function(req, res) {
  var renderData = {};
  var apiURL = '/queryTopLineMovieNews.aspx';
  var timestamp = req.query.timestamp || '';
  var sort = req.query.sort;

  var publicsignal = req.params['publicsignal'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  var options = {
    url: apiURL,
    args: {
      type: '-1',
      pageIndex: 1,
      pageSize: 10,
      CreateTime: timestamp,
      sort: sort,
      wxchannelCode: publicsignal
    }
  };

  renderData.data = {
    publicsignal: publicsignal
  };
  model.fetchDataFromBack(options, function(err, data) {
    // console.log(data);
    renderData.data.err = err;
    if (!err && data && data.movieNews) {
      if (data.movieNews.length == 0) {
        res.send('');
      } else {
        var len = data.movieNews.length;
        for (var i = 0; i < len; i++) {
          var publishtime = data.movieNews[i].publishtime;
          data.movieNews[i].timestamp = publishtime;
          data.movieNews[i].publishtime = DateMethod.movieNewsDate(publishtime)
        }

        renderData.data.movieNews = _.sortBy(data.movieNews, function(movieNews, index) {
          return movieNews.isTop ? parseInt(movieNews.isTop, 10) : index + 4;
        });
        res.render('wecinema/indexmovienews', renderData);
      }

    } else {
      res.send('');
    }
  });
});

//微信jsSDK签名
app.post(['/publicsignal/queryJsapiticket'], function(req, res) {
  // var publicsignalshort = req.params['publicsignal'];

  var options = {
    url: '/queryWeixinRightConfig.aspx',
    passType: 'send',
    args: req.body
  };
  // console.log('url:',options.args)
  model.fetchDataFromBack(options, function(err, data) {
    // console.log(err, data)
    res.send({'err': err, 'data': data});
  });
});

