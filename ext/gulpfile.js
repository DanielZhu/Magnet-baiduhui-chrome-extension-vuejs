'use strict'

var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    webpack = require('webpack'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del');

var config = require('./webpack.config');

/**
 *  清理生产目录文件
 */
gulp.task('clean', function(cb) {
    del(['./output', './dist']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
    });
});

/**
 *  执行webpack打包
 */
gulp.task('webpack', ['clean'], function (cb) {
    webpack(config, cb);
});

/**
 *  压缩css文件
 */
gulp.task('style', function () {
    gulp.src('./output/style.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('output'));
});

gulp.task('copyExtFilesOnlyJS', function () {
    gulp.src([
        './eventPage.js'
    ], {
        base: './'
    })
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest('output'));
});

gulp.task('libScript', function () {
    gulp.src([
        './src/libs/**'
    ], {
        base: './'
    })
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest('output'));
});

gulp.task('copyExtFilesExceptJS', function () {
    gulp.src([
        './_locales/**',
        './*.html',
        './*.json'
    ], {
        base: './'
    })
    .pipe(htmlmin({collapseWhitespace: true}))
    .on('error', gutil.log)
    .pipe(gulp.dest('output'));
});

gulp.task('resource', function () {
    gulp.src([
        './src/assets/images/**'
    ], {
        base: './'
    })
    .pipe(gulp.dest('output'));

    gulp.src([
        './dist/**'
    ], {
        base: './'
    })
    .pipe(gulp.dest('output'));

    gulp.src([
        './src/assets/sound/**'
    ], {
        base: './'
    })
    .pipe(gulp.dest('output'));
});

gulp.task('default', ['webpack'], function () {
    console.log(process.env.NODE_ENV);
    gulp.start('style', 'copyExtFilesExceptJS', 'resource', 'copyExtFilesOnlyJS', 'libScript');
});
