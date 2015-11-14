var gulp      = require('gulp'),
    babel     = require('gulp-babel'),
    concat    = require('gulp-concat'),
    connect   = require('gulp-connect'),
    minifyCSS = require('gulp-minify-css'),
    open      = require('gulp-open'),
    uglify    = require('gulp-uglify'),
    watch     = require('gulp-watch');

var options = {
  port: 8080
};

var paths = {
  jsFiles: [
    'bower_components/react/react.js',
    'bower_components/react/react-dom.js',
    'dist/components.js'
  ],
  cssFiles: [
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'src/css/app.css'
  ]
};

gulp.task('babel', function () {
  gulp.src('src/js/components.js')
    .pipe(babel({presets: ['es2015', 'react']}))
    .pipe(gulp.dest('dist'));
});

gulp.task('uglify', ['babel'], function () {
  return gulp.src(paths.jsFiles)
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('minifyCSS', function () {
  gulp.src(paths.cssFiles)
    .pipe(minifyCSS())
    .pipe(concat('app.css'))
    .pipe(gulp.dest('dist'));
});


gulp.task('connect', function () {
  connect.server({
    port: options.port,
    livereload: true
  });
});

gulp.task('open', function () {
  gulp.src(__filename)
    .pipe(open({uri: ('http://localhost:' + options.port + '/')}));
});

gulp.task('watch', function () {
  gulp.watch('src/js/components.js', ['babel', 'uglify']);
  gulp.watch('src/css/app.css', ['minifyCSS']);
});

gulp.task('default', ['babel', 'uglify', 'minifyCSS', 'connect', 'open', 'watch']);
