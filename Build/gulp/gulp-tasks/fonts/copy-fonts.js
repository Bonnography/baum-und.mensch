const config = require('../../gulpconfig')(),
    $ = require('gulp-load-plugins')(),
    gulp = require('gulp');

function copyFonts () {
    return gulp.src(config.source.fonts)
        .pipe($.debug({
            title: 'Fonts:'
        }))
        .pipe(gulp.dest(config.target.fonts));
}

exports.copyFonts = copyFonts;