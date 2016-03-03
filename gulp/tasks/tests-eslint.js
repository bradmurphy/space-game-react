/**
 * Runs jshint tests.
 * @tasks/test-jshint
 */

'use strict';

var cache = require('gulp-cached');
var eslint = require('gulp-eslint');

/**
 * @param gulp - function
 * @param options - object
 * options.src : JS files to test.
 * @returns {Function}
 */
module.exports = function( gulp, options ) {

  return function() {

    return gulp.src( options.src )
      .pipe(cache( 'eslint' ))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
  };

};
