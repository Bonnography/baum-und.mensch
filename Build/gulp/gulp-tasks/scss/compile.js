const config = require('../../gulpconfig')(),
    $ = require('gulp-load-plugins')(),
    gulp = require('gulp');


function gzip () {
    return gulp.src(config.target.css + '*.css')
        .pipe($.gzip())
        .pipe(gulp.dest(config.target.css));
}


function scssMain () {
    return gulp.src(config.source.scssSelection)
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.autoprefixer({
            cascade: false
        }))
        .pipe($.debug())
        .pipe($.cssbeautify({
            indent: '   ',
            openbrace: 'seperate-line',
            autosemicolon: true
        }))
        .pipe(gulp.dest(config.source.css))
        .pipe($.cssmin())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.target.css));
}
function scssRte () {
    return gulp.src(config.source.rteCss)
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.autoprefixer({
            cascade: false
        }))
        .pipe($.debug())
        .pipe($.cssbeautify({
            indent: '   ',
            openbrace: 'seperate-line',
            autosemicolon: true
        }))
        .pipe(gulp.dest(config.source.css))
        .pipe($.cssmin())
        .pipe(gulp.dest(config.target.rteCss));
}

const scss = gulp.series(scssMain, scssRte, gzip);
exports.scss = scss;
gulp.task('css', scssMain);