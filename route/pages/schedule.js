var util = require('util');
var model = require('../util/model');
var chk_login = require('../util/check_login_middle');
var constant = require('../util/constant.js');

app.get(['/schedule/:cinemaId/:movieId',
  '/:publicsignal/schedule/:cinemaId/:movieId',
  '/:publicsignal/one_movie_schedule/:isShowtime/:cinemaId/:movieId'], chk_login.isLoggedIn, function(req, res) {

  var renderData = {},
    apiURL = '/queryShows.aspx',
    cinemaId = req.params['cinemaId'],
    movieId = req.params['movieId'],
    dateTime = req.params['dateTime'],
    publicsignal = req.params['publicsignal'],
    isShowtime = req.params['isShowtime'];
  if(req.cookies.activity){
    var activityId = JSON.parse(req.cookies.activity).activityID;
    var from = JSON.parse(req.cookies.activity).from;
  }
    
  if (isShowtime == '1') {
    isShowtime = 'true';
  } else {
    isShowtime = 'false';
  }

  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  var options = {
    url: apiURL,
    args: {
      cinemaID: cinemaId,
      movieID: movieId,
      dateTime: '',
      wxchannelCode: publicsignal,
      isShowtime: isShowtime,
    }
  };
  if(req.cookies.activity){
    options.args.activityID = activityId;
    options.args.from = from;
  }
  
  renderData.data = {};
  renderData.data = {
    reversion: global.reversion,
    staticBase: global.staticBase,
    shows: [],
    movies: [],
    cinema: null,
    movieId: movieId,
    publicsignal: publicsignal
  };
  
  model.fetchDataFromBack(options, function(err, data) {
    renderData.data.err = err;
    if (!err && data) {
      renderData.data.shows = data.shows;
      renderData.data.movies = data.movies;
      renderData.data.cinema = data.cinema;
      renderData.data.shareInfo = data.shareInfo;
    }
    if (isShowtime == 'true') {
      res.render('wecinema/one_movie_schedule', renderData);
    } else {
      res.render('wecinema/schedule', renderData);
    }

  });
});
