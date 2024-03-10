const config = require('../../gulpconfig')(),
    $ = require('gulp-load-plugins')(),
    stylish = require('jshint-stylish'),
    gulp = require('gulp');

function jsLint () {
    return gulp.src(config.source.mainJS)
        .pipe($.eslint('../.eslintrc'))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
}

exports.jsLint = jsLint;
gulp.task('jsLint', jsLint);