'use strict';

const gulp = require('gulp');
const dns = require('dns');
const os = require('os');
const open = require('open');
const refresh = require('gulp-livereload');
const livereload = require('connect-livereload');
const server = require('./server')(livereload);

gulp.task('serve', () => {

  // lookup the local ip and open the browser with it (instead of localhost).
  // This is so the 2nd screen url works on local networks

  dns.lookup(os.hostname(), function (err, address, family) {

    let url = 'http://' + address + ':' + server.port;

    console.log('http server started @', url);
    open(url);

  });

});

gulp.task('livereload', () => {

  // livereload should start listening on the server livereload port (35729)

  refresh.listen(server.lrport);

});

gulp.task('watch', () => {

  // watch the public and bower_components directories for changes

  gulp.watch('public/**').on('change', refresh.changed);
  gulp.watch('bower_components/**').on('change', refresh.changed);

});

gulp.task('default', ['serve', 'livereload', 'watch']);
