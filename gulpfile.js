var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var plumber = require('gulp-plumber');
var ts = require('gulp-typescript');
var exec = require('gulp-exec');
var babel = require('gulp-babel');

gulp.task('clean', function (cb) {
    return del(['./built/**'], cb);
});

gulp.task('compile', function() {
    var tsProject = ts.createProject('./tsconfig.json', {
        sortOutput: true,
        typescript: require('typescript')
    });
    return tsProject.src()
        .pipe(plumber())
        .pipe(ts(tsProject))
        .js
        .pipe(gulp.dest('./built/es6'));
});

gulp.task('tsd', function() {
    return gulp.src('./')
        .pipe(exec('./node_modules/.bin/tsd install'))
        .pipe(exec('./node_modules/.bin/tsd rebundle'))
        .pipe(exec('./node_modules/.bin/tsd link'))
        .pipe(exec.reporter());
});

gulp.task('build-package-copy-src', function() {
    return gulp.src('./built/es5/src/**/*')
        .pipe(gulp.dest('./built/package'));
});

gulp.task('build-package-copy-files', function() {
    return gulp.src(['./package.json', './README.md'])
        .pipe(gulp.dest('./built/package'));
});

gulp.task('build-package-generate-dts', function () {
    var dtsGenerator = require('dts-generator');
    var name = require('./package.json').name;
    dtsGenerator.generate({
        name: name,
        baseDir: './src',
        files: [
            './src/MicroFramework.ts',
            './src/MicroFrameworkRunner.ts'
        ],
        out: './built/package/' + name + '.d.ts'
    });
});

gulp.task('toes5', function () {
    return gulp.src('./built/es6/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./built/es5'));
});

gulp.task('copy-sample1-resources', function() {
    return gulp.src(['./sample/sample1-question-answers-module/configuration/*'])
        .pipe(gulp.dest('./built/es5/sample/sample1-question-answers-module/configuration'));
});

gulp.task('run-sample1', function() {
    return gulp.src('./')
        .pipe(exec('node ./built/es5/sample/sample1-question-answers-module/app.js'))
        .pipe(exec.reporter());
});

gulp.task('run:sample1', function (cb) {
    return runSequence(
        'build',
        ['copy-sample1-resources', 'toes5'],
        'run-sample1',
        cb
    );
});

gulp.task('build', function(cb) {
    return runSequence(
        'clean',
        'tsd',
        'compile',
        'toes5',
        cb
    );
});

gulp.task('package', function(cb) {
    return runSequence(
        'build',
        ['build-package-copy-src', 'build-package-copy-files', 'build-package-generate-dts'],
        cb
    );
});

gulp.task('default', ['build']);