var gulp = require('gulp');
var sourcemaps = require("gulp-sourcemaps");
var babel = require('gulp-babel');
var concat = require('gulp-concat');

gulp.task('scripts', function () {
  return gulp.src('./js/!(compiled)*.js') //do not concat the compiled file
    .pipe(sourcemaps.init())
    .pipe(concat('compiled.js'))
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./js/'));
});

gulp.task('default', ['scripts']);

gulp.task('watch', ['scripts'], function(){
  gulp.watch('js/!(compiled)*.js', ['scripts']);
});