var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');

gulp.task('scripts', function () {
  return gulp.src('./js/!(compiled)*.js') //do not concat the compiled file
    .pipe(concat('compiled.js'))
    .pipe(babel())
    .pipe(gulp.dest('./js/'));
});

gulp.task('default', ['scripts']);

gulp.task('watch', function(){
	gulp.watch('js/!(compiled)*.js', ['scripts']);
});