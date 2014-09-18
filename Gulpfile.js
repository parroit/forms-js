/*
 * forms
 * https://github.com/parroit/forms
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var pure = require('gulp-pure-cjs');

gulp.task('watch-build', function () {
  gulp.watch(['./lib/**/*.js'], ['build']);
});

gulp.task('build', function() {
    return gulp.src('./lib/forms.js')

        .pipe(pure({
            exports: 'forms',
            output: 'forms.js'
        })).on('error', function(err) {
            console.log(err);
        })
        .pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
  return gulp.src('./test/*.js')
    .pipe(mocha({
      ui: 'bdd',
      reporter: 'spec'
    }));
});

gulp.task('watch-test', function () {
  gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['test']);
});

gulp.task('default', ['test', 'watch']);
