/**
 * Bumps package version.
 * @tasks/bump
 */

'use strict';

var bump = require('gulp-bump');

/**
 * @param gulp - function
 * @param options - object
 * options.src : Source package file
 * @returns {Function}
 */
module.exports = function( gulp, options ) {

  return function() {

    return gulp.src( options.src )
      .pipe(bump())
      .pipe(gulp.dest('./'))
      .on('error', function(error) {
        console.log(error.message);
      });

  };

};
