var gulp = require('gulp');


// JS
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

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
    .pipe(gulp.dest('./app/js/'));
};

gulp.task('scripts', bundle);


// Server
var browserSync = require('browser-sync').create();

gulp.task('server', ['scripts'], function() {

  browserSync.init({
    open: false,
    notify: false,
    files: ['./app/css/*.css', './app/js/*.js', './app/*.html'],
    server: {
      baseDir: './app'
    }
  });
});


gulp.task('default', ['scripts', 'server']);
