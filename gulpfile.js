'use strict';

const gulp                 = require('gulp'),
    sass                   = require('gulp-sass'),
    autoprefixer           = require('gulp-autoprefixer'),
    cleanCSS               = require('gulp-clean-css'),
    pump                   = require('pump'),
    rigger                 = require('gulp-rigger'),
    imagemin               = require('gulp-imagemin'),
    rename                 = require('gulp-rename'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminSvgo           = require('gulp-imagemin').svgo,
    imageminPngquant       = require('imagemin-pngquant'),
    browserSync            = require('browser-sync').create(),
    watch                  = require('gulp-watch'),
    del                    = require('del'),
    concat                 = require('gulp-concat'),
    uglify                 = require('gulp-uglify-es').default;

var task = {};

var path = {
  build: {
    html: 'dist/',
    stylesheets: 'dist/assets/stylesheets/',
    img: 'dist/assets/images/',
    favicon: 'dist/assets/favicon',
    javascript: 'dist/assets/javascript/',
    fonts: 'dist/assets/fonts/',
  },
  src: {
    html: 'src/*.{html,txt}',
    stylesheets: 'src/assets/stylesheets/*.scss',
    img: 'src/assets/images/**/*.{jpg,png,svg}',
    favicon: 'src/assets/favicon/*.*',
    javascript: 'src/assets/javascript/**/*.js',
    fonts: 'src/assets/fonts/**/*.*',
  },
  watch: {
    html: 'src/**/*.{html,txt}',
    stylesheets: 'src/assets/stylesheets/**/*.scss',
    img: 'src/assets/images/**/*.{jpg,png,svg}',
    favicon: 'src/assets/favicon/*.*',
    javascript: 'src/assets/javascript/**/*.js',
    fonts: 'src/assets/fonts/**/*.*',
  }
};

gulp.task('clean', (done) => {
  del.sync(path.build.img);
  done();
});

// HTML
gulp.task('html:build', (done) => {
  gulp.src(path.src.html)
  .pipe(rigger())
  .pipe(gulp.dest(path.build.html))
  .pipe(browserSync.reload({
    stream: true
  }));
  done();
});

//Stylesheets
gulp.task('sass:build', (done) => {
  gulp.src(path.src.stylesheets)
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 2 versions', 'Safari >= 7', 'ie >=10'],
    cascade: false
  }))
  .pipe(cleanCSS({compatibility: 'ie10', inline: ['none']})) //format: 'beautify'
  .pipe(gulp.dest(path.build.stylesheets))
  .pipe(browserSync.reload({
    stream: true
  }));
  done();
});

// JAVASCRIPT
// gulp.task('javascript:vendors', (done) => {
//   return gulp.src([
//     'node_modules/fullpage.js/dist/fullpage.js'
//   ])
//   .pipe(uglify())
//   .pipe(concat('vendors.min.js'))
//   .pipe(gulp.dest(path.build.javascript));
//   done();
// });

// gulp.task('javascript:build', (done) => {
//   gulp.src(path.src.javascript)
//   .pipe(uglify())
//   .pipe(gulp.dest(path.build.javascript))
//   .pipe(browserSync.reload({
//     stream: true
//   }));
//   done();
// });

// FONTS
gulp.task('fonts:build', (done) => {
  gulp.src(path.src.fonts)
  .pipe(gulp.dest(path.build.fonts))
  .pipe(browserSync.reload({
    stream: true
  }));
  done();
});

gulp.task('img:build', (done) => {
  gulp.src(path.src.img)
  .pipe(imagemin([
    imageminJpegRecompress({
      loops:6,
      min: 50,
      max: 90,
      quality:'medium'
    }),
    imageminPngquant({nofs: true, speed: 1}),
    imageminSvgo({
      plugins: [
				{ inlineStyles: false }
			]
    }),
  ]))
  .pipe(rename(function(opt) {
    opt.basename = opt.basename.split(' ').join('_');
    return opt;
  }))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(gulp.dest(path.build.img));
  done();
});

gulp.task('favicon:build', (done) => {
  gulp.src(path.src.favicon)
  .pipe(rename(function(opt) {
    opt.basename = opt.basename.split(' ').join('_');
    return opt;
  }))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(gulp.dest(path.build.favicon));
  done();
});

// Server
gulp.task('server', (done) => {
  browserSync.init({
    port : 3200,
    server: {
      baseDir: "dist"
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0'
      }
    },
    open: true
  });
  done();
});

gulp.task('build', gulp.series(
  'html:build',
  'sass:build',
  'img:build',
  'fonts:build',
  'favicon:build',
), function(done) {
    done();
});


gulp.task('watch', () => {
  watch(path.watch.html, gulp.series('html:build'));
  watch(path.watch.stylesheets, gulp.series('sass:build'));
  watch(path.watch.img, gulp.series('img:build'));
  watch(path.watch.fonts, gulp.series('fonts:build'));
});

gulp.task('default', gulp.series('clean', 'build', gulp.parallel('server', 'watch')));
