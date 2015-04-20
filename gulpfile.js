var gulp = require('gulp');
var sourcemaps = require("gulp-sourcemaps");
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream')

gulp.task('babel', function() {
  return gulp.src('./js/src/!(compiled)*.js') //do not concat the compiled file
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./js/dist/'));
});

function build(debug){
  return browserify('./js/dist/flipper.js', {'debug': debug})
    .bundle()
    .pipe(source('compiled.js'))
    .pipe(gulp.dest('./js/'));
}

gulp.task('build-dev', ['babel'], function() {
  return build(true);
});

gulp.task('build-prod', ['babel'], function() {
  return build(false);
});

gulp.task('default', ['build-dev']);

gulp.task('watch', ['build-dev'], function() {
  gulp.watch('js/src/*.js', ['build-dev']);
});