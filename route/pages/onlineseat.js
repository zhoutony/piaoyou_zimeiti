/*
 * Created by LemonHall on 2015/4/
 */
var util = require('util');
var model = require('../util/model');
var chk_login = require('../util/check_login_middle');
var constant = require('../util/constant');

app.get(['/room/:showtimeId', '/:publicsignal/room/:showtimeId'], chk_login.isLoggedIn, function(req, res) {

  var renderData = {};
  var apiURL = '/queryShowSeats.aspx';
  var showtimeId = req.params['showtimeId'];
  var publicsignal = req.params['publicsignal'];
  var open_id = req.cookies.openids || '';
  
  if(req.cookies.activity){
    var activityId = JSON.parse(req.cookies.activity).activityID;
    var from = JSON.parse(req.cookies.activity).from;
  }
  if (!publicsignal) {
    publicsignal = constant.str.PUBLICSIGNAL;
  }
  var options = {
    url: apiURL,
    args: {
      showtimeID: showtimeId,
      wxchannelCode: publicsignal
    }
  };

  if(req.cookies.activity){
    options.args.activityID = activityId;
    options.args.from = from;
  }

  renderData.data = {};
  renderData.data = {
    reversion: global.reversion,
    staticBase: global.staticBase
  };

  model.fetchDataFromBack(options, function(err, data) {
    
    renderData.data.err = err;
    if (!err && data && data.seats) {
      renderData.data = data;
      renderData.data.seats = setSeats(data.seats);
      renderData.data.reversion = global.reversion;
      renderData.data.staticBase = global.staticBase;
      renderData.data.publicsignal = publicsignal;
      renderData.data.open_id = open_id;
    } else {

    }
    // console.log('data:', JSON.stringify(renderData.data.seats));
    res.render('wecinema/onlineseat', renderData);
  });
});

app.post(['/lockseats/:showtimeId'], function(req, res) {

  if(req.cookies.activity){
    var activityId = JSON.parse(req.cookies.activity).activityID;
    var from = JSON.parse(req.cookies.activity).from;
  }
  var options = {
    url: '/lockSeats.aspx',
    passType: 'send',
    args: req.body,
  };
  if(req.cookies.activity){
    options.args.activityID = activityId;
    options.args.from = from;
  }

  options.args.openId = req.cookies.openids || '';
  model.fetchDataFromBack(options, function(err, data) {
    if (data) {
      res.send(JSON.parse(data));
    } else {
      res.send(err);
    }

  });
});


function setSeats(seats) {
  var _seats = [];
  var _seats1;
  var _seat;

  for (var i = 0; i < seats.length; i++) {
    _seat = seats[i];
    if (!_seats[_seat.xCoord]) {
      _seats[_seat.xCoord] = [];
    }
    _seats[_seat.xCoord][_seat.yCoord] = _seat;

  }
  _seats1 = prepard_seat(_seats);
  return _seats1;
}


var prepard_seat = function(seat_list) {

  if (!seat_list && seat_list.length == 0)return;
  if (!seat_list[0])return;
  var sSeatInfo = seat_list;
  var collen = sSeatInfo.length;
  var rowlen = sSeatInfo[0].length; //取得row数据
  var rowNullCount = 0;

  sSeatInfo[collen - 1][0].rowStatus = 'last';
  var new_arr = [],
    rowNum = sSeatInfo[0][0].rowNum;
  if (rowNum == '') {
    for (var i = 0; i < collen; i++) {
      if (sSeatInfo[i][0].rowNum != '') {
        sSeatInfo[i][0].rowStatus = 'first';
        rowNullCount = i;
        break;
      } else {
        sSeatInfo[i][0].desc = 'vacant_seat';
      }
    }
  } else {
    sSeatInfo[0][0].rowStatus = 'first';
  }

  var new_row = {
    colNum: '',
    loveCode: '',
    rowNum: '',
    seatID: '',
    seatName: '',
    status: '2',
    type: '',
    xCoord: '',
    yCoord: '',
    desc: 'vacant_seat'
  };

  // console.log('rowNullCount:',rowNullCount)
  // console.log(JSON.stringify(seat_list))
  // console.log(rowlen, collen)
  for (var j = 0; j < rowlen; j++) {
    new_arr.push(new_row);
  }
  if (rowNullCount > 3) {
    for (j = 0; j < rowNullCount; j++) {
      sSeatInfo.push(new_arr);
    }
  } else {
    if (rowlen > collen) {
      // console.log(rowlen+'::::'+collen)
      var _num = Math.floor((rowlen - collen) / 2);
      _num += _num % 2;
      // console.log('_num:', _num)
      for (j = 0; j < _num; j++) {
        sSeatInfo.unshift(new_arr);
      }
      for (j = 0; j < _num; j++) {
        sSeatInfo.push(new_arr);
      }
    }
  }
  return sSeatInfo;
}; //END of prepard_seat........................................................

