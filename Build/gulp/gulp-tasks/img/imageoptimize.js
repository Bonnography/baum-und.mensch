const config = require('../../gulpconfig')(),
    $ = require('gulp-load-plugins')(),
    gulp = require('gulp');

function optimizeImages () {
    return gulp.src(config.source.images)
        .pipe($.imagemin([
            $.imagemin.optipng({
                optimizationLevel: 5
            }),
            $.imagemin.mozjpeg({
                progressive: true
            }),
            $.imagemin.gifsicle({
                interlaced: true
            }),
            $.imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            })
        ], {verbose: true}))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest(config.target.images));
}
function icons () {
    return gulp.src(config.source.icons)
        .pipe($.imagemin([
            $.imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            })
        ], {verbose: true}))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest(config.target.icons));
}

function ico () {
    return gulp.src(config.source.ico)
        .pipe($.debug({
            title: 'Ico:'
        }))
        .pipe(gulp.dest(config.target.images));
}

function backendimg () {
    return gulp.src(config.source.backendimg)
        .pipe($.imagemin([
            $.imagemin.optipng({
                optimizationLevel: 5
            }),
            $.imagemin.mozjpeg({
                progressive: true
            }),
            $.imagemin.gifsicle({
                interlaced: true
            }),
            $.imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            })
        ], {verbose: true}))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest(config.target.backendimages));
}

function fileicons () {
    return gulp.src(config.source.fileicons)
        .pipe($.imagemin([
            $.imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            })
        ], {verbose: true}))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest(config.target.fileicons));
}

const optimize = gulp.series(optimizeImages, gulp.parallel(icons, fileicons, backendimg, ico));
exports.optimize = optimize;