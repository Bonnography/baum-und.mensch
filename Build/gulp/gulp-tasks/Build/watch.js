var config = require('../../gulpconfig')(),
    clean = require('../Cleaning/clean'),
    css = require('../scss/compile'),
    js = require('../js/concat'),
    fonts = require('../fonts/copy-fonts'),
    image = require('../img/imageoptimize'),
    gulp = require('gulp');

function watching () {
    gulp.watch(config.source.scssSelection, gulp.series(clean.css, css.scss));

    gulp.watch(config.source.rteCss, gulp.series(clean.css, css.scss));

    gulp.watch(config.source.mainJS, gulp.series(clean.js, js.js));

    gulp.watch(config.source.images,
        gulp.series(clean.image, image.optimize));

    gulp.watch(config.source.fonts, gulp.series(clean.font, fonts.copyFonts));

}

gulp.task('watch', watching);