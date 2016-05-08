var _ = require('lodash');

app.use('/index.html', function(req, res, next) {
  res.redirect('/');
});

app.use(['/'], function(req, res, next) {
  const assets = require('../assets.json');
  _.extend(app.locals.assets, assets);
  res.render('wecinema/app');
});
