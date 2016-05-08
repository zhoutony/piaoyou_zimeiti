var util = require('util');
var model = require('../util/model');

//选择城市
app.get(['/get/citys'], function(req, res) {
  var renderData = {};
  var options = {
    url: '/queryLocations.aspx',
    args: {
      locationID: 110000,
      type: 1,
      pageIndex: 1,
      pageSize: 10
    }
  };

  renderData.data = {};
  model.fetchDataFromBack(options, function(err, data) {
    // console.log(data)
    renderData.data = {
      err: err,
      citys: null
    };

    if (data && data.locations) {
      renderData.data.citys = group_data(data.locations);
    }

    res.render('wecinema/city', renderData);
  });

});

// 获取定位
app.get(['/queryLocation/:longitude/:latitude'], function(req, res) {
  var options = {
    url: '/queryLocationByLatitudeLongitude.aspx',
    args: {
      longitude: req.params.longitude,
      latitude: req.params.latitude
    }
  };

  model.fetchDataFromBack(options, function(err, data) {
    res.json(data || {});
  });
});

var group_data = function(city_list) {
  if (!city_list) return;
  //-先将city_list排序
  city_list.sort(getSortFun('asc', 'namePinyin'));

  var UpperMap = {};
  var hotCity = {};
  for (var i = 0; i < city_list.length; i++) {
    var city_obj = city_list[i];
    var UpperFirst = city_obj.namePinyin.toUpperCase().substr(0, 1);
    if (UpperMap[UpperFirst] === undefined) {
      UpperMap[UpperFirst] = [];
      UpperMap[UpperFirst].push(city_obj);
    } else {
      UpperMap[UpperFirst].push(city_obj);
    }
  }

  return UpperMap;
};

var getSortFun = function(order, sortBy) {
  var ordAlpah = (order == 'asc') ? '>' : '<';
  var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
  return sortFun;
};
