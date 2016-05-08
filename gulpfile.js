var gulp = require('gulp');
var webpack = require('webpack');
var webpackDevelopmentConfig = require('./webpack.config.development');
var webpackProductionConfig = require('./webpack.config.production');

var appWebpackDevelopmentConfig = require('./app/webpack.config.development');
var appWebpackProductionConfig = require('./app/webpack.config.production');

var staticGlob = ['static/**/*.*', '!static/**/*.js'];
var scriptGlob = ['static/**/*.js'];
var appGlob = ['app/**/*.js', 'app/**/*.css'];

gulp.task('static', function() {
  return gulp.src(staticGlob)
    .pipe(gulp.dest('dist'));
});

gulp.task('webpack', function(callback) {
  var compiler = webpack(webpackDevelopmentConfig);
  compiler.run(callback);
});

gulp.task('app-webpack', function(callback) {
  var compiler = webpack(appWebpackDevelopmentConfig);
  compiler.run(callback);
});

gulp.task('watch', function() {
  gulp.watch(staticGlob, ['static']);
  gulp.watch(scriptGlob, ['webpack']);
  gulp.watch(appGlob, ['app-webpack']);
});

gulp.task('webpack-production', function(callback) {
  var compiler = webpack(webpackProductionConfig);
  compiler.run(callback);
});

gulp.task('app-webpack-production', function(callback) {
  var compiler = webpack(appWebpackProductionConfig);
  compiler.run(callback);
});

gulp.task('default', ['static', 'webpack', 'app-webpack', 'watch']);
gulp.task('release', ['static', 'webpack-production']);
