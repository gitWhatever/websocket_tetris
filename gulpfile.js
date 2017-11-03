var gulp = require('gulp');
var del = require('del');
// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer')

// var pg = require('./package');
// var versionName = pg.name + '.' + pg.version

gulp.task('watch', function() {
	gulp.watch('js/**/*.js', ['build']);
});

gulp.task('build', function () {
    return browserify('./js/index.js')
       .bundle()
       .pipe(source('bundle.js'))
       .pipe(buffer())
       .pipe(gulp.dest('./prd'));

});

gulp.task('clean', function () {
    return del([
        'prd/*.js',
    ]);
});

gulp.task('default', ['clean'], function() {
    setTimeout(function() {
        gulp.start('build', 'watch');
    },4);
});