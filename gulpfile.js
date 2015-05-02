'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var browserify = require('browserify');
var watchify = require('watchify');
var karma = require('gulp-karma');

var vinitlSource = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var transform = require('vinyl-transform');

var testsIndex = path.join(__dirname, 'tests-index.js');

gutil.log('path:', testsIndex);

var testsBundler = watchify(browserify(testsIndex, watchify.args));

//gulp.task('tests', function () {
//    rebundle(testsBundler, testsIndex)();
//});

testsBundler.on('update', rebundle(testsBundler, testsIndex));
testsBundler.on('log', gutil.log);

function rebundle (bundler) {
    return function (files) {
        gutil.log('changed files:', files);

        return bundler.bundle()
            .on('error', function (error) {
                // gutil.log(error);
                gutil.log(error.message);
                // gutil.log(error.stack);
                // gutil.log.bind(gutil, 'Browserify Error')
            })
            .pipe(vinitlSource('index.js'))
            // .pipe(buffer())
            .pipe(gulp.dest('./tests'))
            ;
    };
}

gulp.task('test', function () {
    // Be sure to return the stream
    return gulp.src(['./tests/spec/*'])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        })
        .on('end', function () {
            gutil.log('Done!');
        });
});
