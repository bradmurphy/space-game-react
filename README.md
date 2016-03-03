# Getting started

This scaffold has two global dependencies: Node and Gulp. To install Node, find the installer here:

* [Node](https://nodejs.org/)

To install Gulp 4, run:

    npm run gulp4

Finally, to install local project dependencies, run:

    npm install

To kick off a dev build, start a local server and open the project in a browser, run:

    gulp


# Gulp

This project uses the Gulp taskrunner to run a number of different tasks including file copying, moving, and deletion,
validation, testing, image processing, distribution packaging, and open the project in a browser.

## Tasks

The tasks listed here are in the format __taskname__ *(dependencies)*. Each task may be called on the command line with the
command `gulp taskname`. The following tasks will probably be called most often:

### default *(watch-dev)*
The default task, which can be called with just `gulp`. Dev build + local server.

### watch-dev *(dev, build, watch)*
Dev build + local server.

### watch-prod *(prod, build, watch)*
Prod build + local server.

### build-dev *(dev, build)*
Set dev flags and build.

### build-prod *(prod, build, version)*
Set prod flags and build.

### build *(clean, tests, static, scripts, styles, images)*
Calls sub tasks to build the project files.

### images
Process and copy images from the images folder into the build.

### scripts *(scripts-app, scripts-vendor)*
Generate build scripts.

### static
Copy files from the static folder into the build.

### styles
Generate build stylesheets.

### tests *(tests-jscs, tests-jshint, tests-mocha)*
Run validation and unit tests.

### version

If no `--version=STRING-OR-NUMBER-HERE` arguments are used, a version number from new Date().getTime() is added
to the JS and CSS file names. main.build.js would be `main.build.1433375041078.js` and `index.css` would be
`index.1433375041078.css`. index.html would have the following comments at the bottom of the file while the CSS
and JS files will have this included at the top.

   `Version: 1433375041078`

   `Created: Wed Jun 03 2015 16:44:01 GMT-0700 (Pacific Daylight Time)`

To use your own version number use `--version=STRING-OR-NUMBER-HERE`

## Config
The `./gulp/config.js` file contains a number of different configuration properties for the various build tasks listed
below.

# Change Log
Since we haven't had a changelog, all changes after commit 7f1fe73 are documented here. The main goal of this update is to impliment gulp 4.0.

v1.0.0-rc1

## Changed
- Migrated to gulp 4.0
- Simplified & streamlined a number of tasks
- Minify task now removes sourcemaps
- Replaced gulp-clean with del


## Added
- Version task to append a version to the build-prod task.
- Sourcemaps for vendor.js & bower.js files
- Added CSS to the minify task
- Added .hbs file to the watch list

## Fixed
- jscs will no longer stop watch on errors
- Watch now runs before scripts task

## Deprecated
- Clean was deprecated

## Removed
- Bower was removed
- Minify task was removed. It's now a flag paramater and built into the respective tasks.
