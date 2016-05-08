var util = require('util');
var model = require('../util/model');
var chk_login = require('../util/check_login_middle');
var constant = require('../util/constant');
var DateMethod = require('../util/date');

// app.get(['/medialist/:sourceId', '/medialist/:sourceId/:pageIndex',
//   '/:publicsignal/medialist/:sourceId',
//   '/:publicsignal/medialist/:sourceId/:pageIndex'], chk_login.isLoggedIn, function(req, res) {
//   var renderData = {};
//   var apiURL = '/queryTopLineMovieNews.aspx';
//   var open_id = req.cookies.openids || '';
//   var sourceId = req.params['sourceId'];
//   var isScrollBottomPlus = false;
//   var pageIndex = req.params['pageIndex'];
//   if (pageIndex) {
//     isScrollBottomPlus = true;
//   } else {
//     pageIndex = 1;
//   }
//   var publicsignal = req.params['publicsignal'];
//   if (!publicsignal) {
//     publicsignal = constant.str.PUBLICSIGNAL;
//   }
//   // var showtype = sourceID;
//   var options = {
//     url: apiURL,
//     args: {
//       type: sourceId,
//       pageIndex: pageIndex,
//       pageSize: 10,
//       openId: open_id,
//       wxchannelCode: publicsignal
//     }
//   };
//   renderData.data = {};
//   // console.log('open_id:', open_id)
//   model.fetchDataFromBack(options, function(err, data) {
//     // console.log(data);
//     renderData.data.err = err;
//     if (!err && data) {
//       if (data.movieNews && data.movieNews.length > 0) {
//         var len = data.movieNews.length;
//         for (var i = 0; i < len; i++) {
//           var publishtime = data.movieNews[i].publishtime
//           data.movieNews[i].publishtime = DateMethod.movieNewsDate(publishtime)
//         }
//       }
//       renderData.data = data;
//       renderData.data.reversion = global.reversion;
//       renderData.data.staticBase = global.staticBase;
//       renderData.data.sourceId = sourceId;
//       renderData.data.publicsignal = publicsignal;
//     }
//     if (isScrollBottomPlus) {
//       res.render('wecinema/one_medialist', renderData);
//     } else {
//       res.render('wecinema/medialist', renderData);
//     }

//   });
// });

// 分享回调
app.post(['/yesunion/sharecallback'], function(req, res) {
  //渲染准备用数据
  var renderData = {};
  var apiURL = '/ShareCallback.aspx';
  var options = {
    url: apiURL,
    passType: 'send',
    args: req.body
  };

  renderData.data = {};
  // console.log('sharecallback');
  model.fetchDataFromBack(options, function(err, data) {
    // console.log('data:', data);
    renderData.data.err = err;
    if (!err && data) {
      renderData.data = data;
    } else {

    }
    res.send(renderData);
  });
});

// 订阅
app.post(['/yesunion/subscriberWeMedia'], function(req, res) {
  //渲染准备用数据
  var renderData = {};
  var apiURL = '/subscriberWeMedia.aspx';
  var options = {
    url: apiURL,
    passType: 'send',
    args: req.body
  };

  renderData.data = {};
  // console.log('options:', options);
  model.fetchDataFromBack(options, function(err, data) {
    // console.log('data:', data);
    renderData.data.err = err;
    if (!err && data) {
      renderData.data = data;
    } else {

    }
    res.send(renderData);
  });
});

// 解除订阅
app.post(['/yesunion/unsubscriberWeMedia'], function(req, res) {
  //渲染准备用数据
  var renderData = {};
  var apiURL = '/unsubscriberWeMedia.aspx';
  var options = {
    url: apiURL,
    passType: 'send',
    args: req.body
  };

  renderData.data = {};
  // console.log('unsubscriberWeMedia:',options);
  model.fetchDataFromBack(options, function(err, data) {
    console.log('data:', data);
    renderData.data.err = err;
    if (!err && data) {
      renderData.data = data;
    } else {

    }
    res.send(renderData);
  });
});


