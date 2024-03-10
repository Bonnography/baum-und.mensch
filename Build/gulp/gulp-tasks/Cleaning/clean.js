const config = require('../../gulpconfig')(),
    $ = require('gulp-load-plugins')(),
    gulp = require('gulp');


function build () {
    return gulp.src(outputFolder, {allowEmpty: true, read: false})
        .pipe($.clean());
}

function css () {
    return gulp.src(config.target.css, {allowEmpty: true, read: false})
        .pipe($.clean());
}

function js() {
    return gulp.src(config.target.js, {allowEmpty: true, read: false})
        .pipe($.clean());
}

function font () {
    return gulp.src(config.target.fonts, {allowEmpty: true, read: false})
        .pipe($.clean());
}
function image () {
    return gulp.src(config.target.images, {allowEmpty: true, read: false})
        .pipe($.clean());
}

exports.build = build;
exports.css = css;
exports.js = js;
exports.font = font;
exports.image = image;