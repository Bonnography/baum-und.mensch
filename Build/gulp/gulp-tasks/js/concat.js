const config = require('../../gulpconfig')(),
    $ = require('gulp-load-plugins')(),
    stylish = require('jshint-stylish'),
    jshint = require('gulp-jshint'),
    gulp = require('gulp');

function jsConcat() {
    return gulp.src(config.source.jsLibs)
        .pipe($.plumber())
        .pipe($.concat('default-libs.js'))
        .pipe(gulp.dest(config.source.jsFile))
        .pipe($.uglify({
            mangle: {
                toplevel: true
            },
            compress: {
                drop_console: true
            },
            output: {
                beautify: false,
                comments: false
            }
        }))
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.plumber.stop())
        .pipe(gulp.dest(config.target.js))
        .pipe($.gzip())
        .pipe(gulp.dest(config.target.js));
}

function jsMain() {
    return gulp.src(config.source.mainJS)
        .pipe($.uglify({
            compress: {
                unused: false
            }
        }))
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.target.js))
        .pipe($.gzip())
        .pipe(gulp.dest(config.target.js));
}

function jsForm() {
    return gulp.src(config.source.formJs)
        .pipe($.uglify({
            compress: {
                unused: false
            }
        }))
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.target.formJs))
        .pipe($.gzip())
        .pipe(gulp.dest(config.target.formJs));
}


function jsLint () {
    return gulp.src(config.source.mainJS)
        .pipe($.eslint('../.eslintrc'))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
}

const js = gulp.series(jsLint, gulp.parallel(jsConcat, jsMain, jsForm));
exports.js = js;
