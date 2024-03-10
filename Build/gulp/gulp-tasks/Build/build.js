const config = require('../../gulpconfig')(),
    $ = require('gulp-load-plugins')(),
    clean = require('../Cleaning/clean'),
    css = require('../scss/compile'),
    js = require('../js/concat'),
    fonts = require('../fonts/copy-fonts'),
    image = require('../img/imageoptimize'),
    gulp = require('gulp');



gulp.task('build',
    gulp.series(
        clean.build,
        css.scss,
        js.js,
        fonts.copyFonts,
        image.optimize
    ));
