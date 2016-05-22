/*
 * Created by LemonHall on 2015/4/
 */
var util = require('util');
var moment = require('moment');
var model = require('../util/model');
var chk_login = require('../util/check_login_middle');
var constant = require('../util/constant.js');

moment.locale('zh-cn');

// 获取用户的电影新闻
function getUserNews(req, pageIndex, callback) {
  var publicsignal = req.params.publicsignal;
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }

  var options = {
    url: '/queryUserNews.aspx',
    args: {
      // type: '-1',
      pageIndex: pageIndex,
      pageSize: 10,
      openId: req.cookies.openids || '',
      wxchannelCode: publicsignal
    }
  };

  model.fetchDataFromBack(options, function(err, data) {
    var userNews = data && data.movieNews;

    if (userNews) {
      userNews.forEach(function(news) {
        news.moment = moment(news.publishtime, 'YYYY-MM-DD hh:mm:ss').fromNow();
      });
    }

    callback(err, userNews, publicsignal);
  });
}

// 首页
app.get(['/my/index', '/:publicsignal/my/index'], chk_login.isLoggedIn, function(req, res) {//
  var renderData = {};
  var apiURL = '/QueryWeiXinUser.aspx';
  var open_id = req.cookies.openids || '';
  var city = req.cookies.city,
    locationId = 110100;
  if (city) {
    city = JSON.parse(city);
    if (city.locationId) {
      locationId = city.locationId;
    }
  }
  var publicsignal = req.params['publicsignal'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  var options = {
    url: apiURL,
    args: {
      openID: open_id,
      wxchannelCode: publicsignal
    }
  };
  renderData.data = {};
  renderData.data.reversion = global.reversion;
  renderData.data.staticBase = global.staticBase;
  //隐藏工具条
  renderData.data.publicsignal = publicsignal;
  renderData.data.locationId = locationId;
  renderData.data.isToolHide = true;

  // console.log('reversion:', reversion);
  model.fetchDataFromBack(options, function(err, data) {
    // console.log(data)
    if (!err && data) {
      renderData.data.uses = data;
    }

    getUserNews(req, 1, function(err, userNews) {
      if (!err && userNews) {
        renderData.data.userNews = userNews;
      }

      res.render('wecinema/my', renderData);
    });
  });

});


app.get(['/my/myorders', '/:publicsignal/my/myorders'], function(req, res) {
  var renderData = {};
  var apiURL = '/queryOrder.aspx';
  var openId = req.cookies.openids || '';
  var publicsignal = req.params['publicsignal'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  var options = {
    url: apiURL,
    args: {
      openID: openId,
      wxchannelCode: publicsignal
    }
  };
  renderData.data = {};

  // console.log(orders.orderID );
  // res.render('wecinema/cinemaorder', renderData);
  model.fetchDataFromBack(options, function(err, data) {
    // console.log(data);
    renderData.data.err = err;
    if (!err && data) {
      renderData.data = data;
    }

    res.render('wecinema/myorders', renderData);

  });
});

app.get(['/my/mask_myorder'], function(req, res) {
  var renderData = {};
  var apiURL = '';

  var options = {
    url: apiURL,
    args: {}
  };
  renderData.data = {};
  res.render('wecinema/mask-orderrule', renderData);
});


app.get(['/my/mypiao'], function(req, res) {
  var apiURL = '/queryPiaoyouCards.aspx';
  var openId = req.cookies.openids || '';

  var options = {
    url: apiURL,
    args: {
      openID: openId
    }
  };

  // console.log(orders.orderID );
  // res.render('wecinema/cinemaorder', renderData);
  model.fetchDataFromBack(options, function(err, data) {
    data = data || {};
    data.err = err;

    res.json(data);
  });
});

app.get(['/my/mypiao/:piaoId'], function(req, res) {
  var apiURL = '/queryPiaoyouCard.aspx';

  var options = {
    url: apiURL,
    args: {
      piaoyouCardID: req.params.piaoId
    }
  };

  model.fetchDataFromBack(options, function(err, data) {
    data = data || {};
    data.err = err;

    res.json(data);
  });
});

app.get(['/my/mask_mypiao'], function(req, res) {
  var renderData = {};
  var apiURL = '';

  var options = {
    url: apiURL,
    args: {}
  };
  renderData.data = {};
  res.render('wecinema/mask-piaorule', renderData);
});


app.get(['/my/myredbag'], function(req, res) {
  var apiURL = '/queryRedEnvelopes.aspx';
  var openId = req.cookies.openids || '';

  var options = {
    url: apiURL,
    args: {
      openID: openId
    }
  };

  // console.log(orders.orderID );
  // res.render('wecinema/cinemaorder', renderData);
  model.fetchDataFromBack(options, function(err, data) {
    data = data || {};
    data.err = err;

    res.json(data);
  });
});

app.get(['/my/myredbag/:redBagId'], function(req, res) {
  var apiURL = '/queryRedEnvelope.aspx';

  var options = {
    url: apiURL,
    args: {
      redEnvelopeID: req.params.redBagId
    }
  };

  model.fetchDataFromBack(options, function(err, data) {
    data = data || {};
    data.err = err;

    res.json(data);
  });
});

app.get(['/my/mask_myredbag'], function(req, res) {
  var renderData = {};
  var apiURL = '';

  var options = {
    url: apiURL,
    args: {}
  };
  renderData.data = {};
  res.render('wecinema/mask-redrule', renderData);
});

// 足迹
app.get(['/my/usernews/:pageindex', '/:publicsignal/my/usernews/:pageindex'], function(req, res) {
  getUserNews(req, req.params.pageindex, function(err, userNews, publicsignal) {
    res.render('wecinema/pagelets/user-news', {
      data: {
        err: err,
        publicsignal: publicsignal,
        userNews: userNews
      }
    });
  });
});

app.get(['/my/usernews/delete/:newsId'], function(req, res) {
  var options = {
    url: '/DeleteUserNewsHistroy.aspx',
    args: {
      openId: req.cookies.openids || '',
      movieNewID: req.params.newsId
    }
  };

  model.fetchDataFromBack(options, function(err, data) {
    res.json({
      err: err,
      data: data
    });
  });
});
