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
  renderData.data.wxUser = req.cookies.wxUser?JSON.parse(req.cookies.wxUser):null;
  if (!req.cookies.wxUser) {
    res.cookie('openids', '', {
      maxAge:-1,
      path: '/'
    }); 
  }
  //console.log('reversion:', reversion);
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

app.get(['/my/myorders_check'], function(req, res) {
  var apiURL = '/queryOrder.aspx';
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

//毒舌订单列表
app.get(['/my/dsmovie', '/:publicsignal/my/dsmovie'], chk_login.isLoggedIn, function(req, res) {
  var renderData = {};
  var apiURL = '/queryOrder.aspx';
  var openId = req.cookies.openids || '';
  var cookiePhone = req.cookies.tel || '';
  var publicsignal = req.params['publicsignal'];
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  var options = {
    url: apiURL,
    args: {
      openID: openId,
      phone: cookiePhone,
      wxchannelCode: publicsignal
    }
  };
  renderData.data = {};

  // console.log(options );
  // res.render('wecinema/cinemaorder', renderData);
  model.fetchDataFromBack(options, function(err, data) {
    // console.log(data);
    renderData.data.err = err;
    if (!err && data) {
      renderData.data = data;
    }

    res.render('wecinema/my_ds', renderData);

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


app.get(['/my/mycode'], function(req, res) {
  var apiURL = '/queryETickets.aspx';
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
    // console.log(data);
    res.json(data);
  });
});

app.get(['/my/mycode/:codeBagId'], function(req, res) {
  var apiURL = '/queryETicket.aspx';

  var options = {
    url: apiURL,
    args: {
      eTicketId: req.params.codeBagId
    }
  };
  // console.log(options);
  model.fetchDataFromBack(options, function(err, data) {
    data = data || {};
    data.err = err;
    // console.log(data);
    res.json(data);
  });
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

app.post(['/my/addcard'], function(req, res) {
  var apiURL = '/BindPC.aspx';
  var openId = req.cookies.openids || '';
  
    var cardnum = req.query.cardnum;
    var pwd = req.query.pwd;
    var mobile = req.query.mobile;
    var code = req.query.code;
    var guid = req.cookies.guid;
    
    
    var options = {
    url: apiURL,
    args: {
      openID: openId,
      cno: cardnum,
      pwd: pwd,
      mobile: mobile,
      code: code,
      guid: guid
    }
  };
// console.log(options);

  model.fetchDataFromBack(options, function(err, data) {
    // console.log(data);
    data = data || {};
    data.err = err;

    res.json(data);
    // console.log(err,data);
  });
});


app.post(['/my/addcode'], function(req, res) {
  var apiURL = '/BindETicket.aspx';
  var openId = req.cookies.openids || '';
  
    var codenum = req.query.codenum;
    var mobile = req.query.mobile;
    
    
    var options = {
    url: apiURL,
    args: {
      openID: openId,
      code: codenum,
      mobile: mobile,
    }
  };
// console.log(options);

  model.fetchDataFromBack(options, function(err, data) {
    // console.log(data);
    data = data || {};
    data.err = err;

    res.json(data);
    // console.log(err,data);
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
    // console.log(data);
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
    // console.log(data);
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

//绑定手机号
app.post(['/my/bindPhone'], function(req, res) {
  var apiURL = '/Register.aspx';
  var openId = req.cookies.openids || '';
  
    var bindNum = req.query.bindNum;
    var bindCode = req.query.bindCode;
    var bindPwd = req.query.bindPwd;
    
    
    var options = {
    url: apiURL,
    args: {
      openID: openId,
      phone: bindNum,
      pwd: bindPwd,
      code: bindCode,
    }
  };
// console.log(options);

  model.fetchDataFromBack(options, function(err, data) {
    // console.log(data);
    data = data || {};
    data.err = err;

    res.json(data);
    // console.log(err,data);
  });
});

app.get(['/my/isBind'], function(req, res) {
  var apiURL = '/NeedPhone.aspx';
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
    // console.log(data);
    data = data || {};
    data.err = err;

    res.json(data);
  });
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
