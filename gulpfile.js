var gulp = require('gulp');
var browserify = require('browserify');  // Bundles JS.
var del = require('del');  // Deletes files.
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');

var paths = {
  libs: ['./src/js/libs.js'],
  js: ['src/js/**/*.js', 'src/js/**/*.jsx'],
  css: ['./src/css/**/*.css'],
  target: 'dist/'
};

var browserifyOpts = {
  paths: ["src/js/", "node_modules/"],
  debug: true // creates source maps. Doesn't affect output
};

var uglifyOpts = {
	mangle: false
};

// An example of a dependency task, it will be run before the css/js tasks.
// Dependency tasks should call the callback to tell the parent task that
// they're done.
gulp.task('clean', function(done) {
  del([paths.target + '/*'], {force:true}, done);
});

gulp.task('ie-libs', function() {
  browserify(['./node_modules/es5-shim/es5-shim.min.js', './node_modules/es5-shim/es5-sham.min.js'])
    .bundle()
    .pipe(source('wlibs-ie.js'))
    .pipe(gulp.dest(paths.target))
});

gulp.task('libs', ['ie-libs'], function() {
  browserify(browserifyOpts)
    .require(paths.libs, {expose: "libs"})
    .bundle()
    .pipe(source('wlibs.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(streamify(uglify(uglifyOpts)))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.target));
});

gulp.task('js', ['libs'], function() {
  browserify(browserifyOpts)
    .external("libs")
    .require("widgets", {expose: "widgets"})
    .transform(babelify, {presets: ["es2015", "react"]})
    .bundle()
    .pipe(source('wwidgets.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(streamify(uglify(uglifyOpts)))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.target));
});

gulp.task('css', function(){
  gulp.src(paths.css)
    .pipe(concatCss("wwidgets.css"))
    .pipe(minifyCss())
    .pipe(gulp.dest(paths.target));
});

// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
  gulp.watch(paths.libs, ['libs']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.css, ['css']);
});

gulp.task('compile', ['css', 'js']);

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['clean', 'compile', 'watch']);
