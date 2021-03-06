var gulp       = require("gulp");
var browserify = require("browserify");
var cssmin     = require("gulp-cssmin");
var connect    = require("gulp-connect");
var concat     = require('gulp-concat');
var watch      = require("gulp-watch");
var debug      = require("gulp-debug");
var source     = require("vinyl-source-stream");
var jshint       = require("gulp-jshint");

var srcDir      = "./src/";
var destDir     = "dist/";
var htmlSrc     = srcDir + "**/*.html";
var imageSrc    = srcDir + "img/**/*";
var imageDest   = destDir + "img/";
var jsSrc       = srcDir + "js/application.js";
var jsDest      = destDir + "js/";
var jsDestFile  = "application.js";
var cssSrc      = srcDir + "css/**/*.css";
var cssDest     = destDir + "css/";
var dataSrc     = srcDir + "data/**/*";
var dataDest    = destDir + "data/";
var cssDestFile = "styles.css";
var watchFiles  = srcDir + "**/*";
var watchTasks  = ["default"];

gulp.task("copy:html", function() {
  gulp.src(htmlSrc).pipe(gulp.dest(destDir));
});


gulp.task("copy:images", function() {
  gulp.src(imageSrc).pipe(gulp.dest(imageDest));
});

gulp.task("copy:data", function() {
  gulp.src(dataSrc).pipe(gulp.dest(dataDest));
});

gulp.task("browserify", function() {
  browserify(jsSrc)
    .transform("brfs")
    .bundle({debug: true})
    .pipe(source(jsDestFile))
    .pipe(gulp.dest(jsDest));
});


gulp.task('lint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task("cssmin", function() {
  gulp.src(cssSrc)
    .pipe(cssmin())
    .pipe(concat(cssDestFile))
    .pipe(gulp.dest(cssDest));
});

gulp.task("server", function() {
  connect.server({
    port: process.env.UI_PORT || 9001,
    root: destDir,
    livereload: true
  });
});

gulp.task("watch", function() {
  gulp.src(watchFiles)
    .pipe(watch(function(files) {
      gulp.start.apply(gulp, watchTasks);
    }));
});

gulp.task("default", ["lint", "copy:html", "copy:images", "copy:data", "browserify", "cssmin"]);
gulp.task('develop', ['server', 'watch']);
