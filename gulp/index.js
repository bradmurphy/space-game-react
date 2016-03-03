'use strict';

// vars
var gulp = require('gulp');
var bs = require('browser-sync').create();
var config = require('./config');

// two more states to minify code and create sourcemaps. The default is for local development.
gulp.task('dev', function(done) {
  config.flags.minify = true;
  config.flags.sourcemap = true;
  done();
});

gulp.task('prod', function(done) {
  config.flags.minify = true;
  config.flags.sourcemap = false;
  done();
});

// define stackable tasks
gulp.task('clean', require('./tasks/clean')( gulp, config.clean ));
gulp.task('images', require('./tasks/images')( gulp, bs, config.images ));
gulp.task('scripts-app', require('./tasks/scripts-app')( gulp, bs, config.scripts, config.flags ));
gulp.task('scripts-vendor', require('./tasks/scripts-vendor')( gulp, bs, config.scripts, config.flags ));
gulp.task('static', require('./tasks/static')( gulp, bs, config.static ));
gulp.task('styles', require('./tasks/styles')( gulp, bs, config.styles, config.flags ));
gulp.task('tests-jscs', require('./tasks/tests-jscs')( gulp, config.tests.lint ));
gulp.task('tests-eslint', require('./tasks/tests-eslint')( gulp, config.tests.lint ));
gulp.task('tests-mocha', require('./tasks/tests-mocha')( gulp, config.tests.mocha ));
gulp.task('version', require('./tasks/version')( gulp, config.version ));
gulp.task('bump', require('./tasks/bump')( gulp, config.bump ));

gulp.task('scripts', gulp.parallel( 'scripts-app', 'scripts-vendor' ));
gulp.task('tests', gulp.parallel( 'tests-jscs', 'tests-eslint', 'tests-mocha' ));

// define watch actions
gulp.task('watch', function(done) {

  bs.init({
    server: {
      baseDir: config.server.root
    },
    port: config.server.port,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  });

  gulp.watch(config.scripts.app.src, gulp.series( 'tests', 'scripts-app' ));
  gulp.watch(config.scripts.vendor.src, gulp.series( 'tests', 'scripts-vendor' ));
  gulp.watch(config.scripts.tests.src, gulp.series( 'tests' ));

  gulp.watch(config.styles.src, gulp.series( 'styles' ));
  gulp.watch(config.static.src, gulp.series( 'static' ));

  done();

});

// define user commands
gulp.task('build', gulp.series('clean', 'tests', gulp.parallel( 'static', 'scripts', 'styles', 'images' ) ));

gulp.task('build-dev', gulp.series('dev', 'build' ));

gulp.task('build-prod', gulp.series('prod', 'build', 'version' ));

gulp.task('watch-dev', gulp.series('dev', 'build', 'watch' ));

gulp.task('watch-prod', gulp.series('prod', 'build', 'watch' ));

gulp.task('default', gulp.series('watch-dev' ));
