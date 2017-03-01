var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({
  browsers: ['last 5 versions']
});
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var minify = require('gulp-minify');
var autoClose = require('browser-sync-close-hook');
var imagemin = require('gulp-imagemin');

gulp.task('less', function() {
  gulp.src('less/layout.less')
    .pipe(less({
      plugins: [autoprefix]
    })
    .on('error', function (err) {
      console.log(err);
    })
    )
    .pipe(cssmin()
    .on('error', function(err) {
      console.log(err);
    }))
    .pipe(rename({
      basename: "main",
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css'))
    .on('end', function() {
       browserSync.reload();
    });
});

gulp.task('pattern-js', function() {
  gulp.src('js/jquery.pattern-library.js')
    .pipe(minify({
      noSource: true,
      ext:{
          min:'.min.js'
      }
    }))
    .pipe(gulp.dest('dist/js'))
    .on('end', function() {
      browserSync.reload();
    });
});

gulp.task('init-js', function() {
  gulp.src('js/init.js')
    .pipe(minify({
      noSource: true,
      ext:{
          min:'.min.js'
      }
    }))
    .pipe(gulp.dest('dist/js'))
    .on('end', function() {
      browserSync.reload();
    });
});

gulp.task('images', function(){
  gulp.src('images/*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/images'));
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.use({
    plugin() {},
    hooks: {
      'client:js': autoClose,
    },
  });
  browserSync({
    proxy: "localhost:2002",
    port: 2004,
    notify: false,
    ui: false
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'server.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('default', ['browser-sync', 'less', 'pattern-js', 'init-js', 'images'], function () {
  gulp.watch([
    'less/*'
  ], ['less']);
  gulp.watch([
    'js/*'
  ], ['pattern-js', 'init-js']);
  gulp.watch([
    'dist/index.html'
  ], reload);
});
