var gulp = require('gulp');


// JS
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var b = browserify('./src/scripts/app.jsx', {
  cache: {},
  packageCache: {},
  fullPaths: true
});

b = watchify(b);

b.transform(reactify);
b.on('update', bundle);

function bundle() {
  return b.bundle()
    .on('error', function(e) {
      console.log(e);
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', function(e) {
          console.log('JS Error', e);
        })
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./app/js/'));
};

gulp.task('scripts', bundle);


// Dev Server
var browserSyncDev = require('browser-sync').create('Dev');

gulp.task('serverDev', ['scripts'], function() {

  browserSyncDev.init({
    open: false,
    notify: false,
    files: ['./app/css/*.css', './app/js/*.js', './app/*.html'],
    server: {
      baseDir: './app'
    },
    port: 3000
  });
});


// Root Server
var browserSyncRoot = require('browser-sync').create('Root');

gulp.task('serverRoot', function() {

  browserSyncRoot.init({
    open: false,
    notify: false,
    files: ['./**/*'],
    server: {
      baseDir: './'
    },
    port: 3010
  });
});


gulp.task('default', ['scripts', 'serverDev', 'serverRoot']);
