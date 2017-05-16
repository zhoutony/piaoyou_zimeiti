var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  context: path.join(__dirname, './static/script/weiticket/'),
  entry: {
    cinemaList: './cinema_list.js',
    index: './index.js',
    chooseCinema: './choose_cinema.js',
    schedule: './schedule.js',
    onlineseat: './onlineseat.js',
    mine: './mine.js',
    selflist: './selflist.js',
    payment: './payment.js',
    result: './result.js',
    mycards: './mycards.js',
    bindingcard: './bindingcard.js',
    checkbincard: './checkbincard.js',
    setcookie: './setcookie.js',
    myecoupons: './myecoupons.js',
    event: './event.js',
    filmlist: './filmlist.js',
    ticket: './ticket.js',
    login: './login.js',
    movienews: './movienews.js',
    medialist: './medialist.js',
    orderwait: './orderwait.js',
    orderResult: './orderResult.js',
    getTitle: './getTitle.js'
  },
  output: {
    path: path.join(__dirname, './dist/script/'),
    filename: '[name].js',
    publicPath: '/script/',
  },
  module: {
    loaders: [
      { test: /\.jade$/, loader: 'jade' },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
    new AssetsPlugin({ filename: 'assets.json', path: __dirname }),
  ],
};
