// 'use strict';

// const gulp = require('gulp'),
//   sass = require('gulp-sass'),
//   browserSync = require('browser-sync').create(),
//   autoprefixer = require('gulp-autoprefixer'),
//   cleanCss = require('gulp-clean-css'),
//   concatCss = require('gulp-concat-css'),
//   concatJS = require('gulp-concat'),
//   babel = require('gulp-babel'),
//   uglify = require('gulp-uglify'),
//   rename = require('gulp-rename'),
//   del = require('del'),
//   cache = require('gulp-cache');

// const paths = {
//   styles: {
//     src: 'src/scss/**/*.scss',
//     dest: 'src/css/'
//   },
//   scripts: {
//     src: 'src/js/**/*.js',
//     dest: 'src/lib/'
//   }
// };


// gulp.task('browser-sync', function () {
//   browserSync.init({
//     server: {
//       baseDir: 'src'
//     }
//   });
// });

// gulp.task('scss', () => {
//   return gulp.src(paths.styles.src)
//     .pipe(sass().on('error', sass.logError))
//     .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
//       cascade: false
//     }))
//     .pipe(concatCss('style.css'))
//     .pipe(gulp.dest(paths.styles.dest))
//     .pipe(cleanCss({
//       compatibility: 'ie8'
//     }))
//     .pipe(rename({
//       suffix: '.min'
//     }))
//     .pipe(gulp.dest(paths.styles.dest))
//     .pipe(browserSync.stream());
// });

// gulp.task('js', async () => {
//   return gulp.src(paths.scripts.src)
//     .pipe(babel())
//     .pipe(uglify())
//     .pipe(concatJS('index.min.js'))
//     .pipe(gulp.dest(paths.scripts.dest));
// });

// gulp.task('prebuild', async () => {

//   gulp.src('src/css/**/*.min.css')
//     .pipe(gulp.dest('dist/css'));

//   gulp.src('src/lib')
//     .pipe(gulp.dest('dist/js'));

//   gulp.src('src/*.html')
//     .pipe(gulp.dest('dist'));

// });

// gulp.task('clean', async () => {
//   return del.sync('dist');
// });

// gulp.task('cache', () => {
//   return cache.clearAll();
// });

// gulp.task('watch', () => {
//   gulp.watch(paths.styles.src, gulp.parallel('scss'));
//   gulp.watch('src/**/*.html');
//   gulp.watch(paths.scripts.src, gulp.parallel('js'));
// });

// gulp.task('default', gulp.parallel('scss','js', 'browser-sync', 'watch'));

// gulp.task('build', gulp.parallel('prebuild', 'clean', 'scss'));





'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCss = require('gulp-clean-css'),
  concatCss = require('gulp-concat-css'),
  // uglify = require('gulp-uglifyjs'),
  rename = require('gulp-rename'),
  del = require('del'),
  cache = require('gulp-cache');

gulp.task('reload-css', function () {
  return gulp.src('./src/scss/**/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: false
    }))
    .pipe(concatCss('style.css'))
    .pipe(gulp.dest('./src/css/'))
    .pipe(cleanCss({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./src/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: false
  });
});

gulp.task('clean', async function () {
  return del.sync('dist');
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(browserSync.reload({
      stream: true
    }));
});

// gulp.task('js', function() {
//   return gulp.src('src/js/**/*.js')
//     .pipe(uglify('script.js'))
//     .pipe(gulp.dest('src/js'))
//     .pipe(browserSync.reload({
//       stream: true
//     }));
// });

gulp.task('prebuild', async function () {

  gulp.src('src/css/**/*.min.css')
    .pipe(gulp.dest('dist/css'));

  gulp.src('src/js/**/script.js')
    .pipe(gulp.dest('dist/js'));

  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));

});

gulp.task('cache', function () {
  return cache.clearAll();
});

gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', gulp.parallel('reload-css'));
  gulp.watch('src/**/*.html', gulp.parallel('html'));
  gulp.watch('src/js/**/*.js', gulp.parallel('html'));
});

gulp.task('default', gulp.parallel('reload-css', 'browser-sync', 'watch'));

gulp.task('build', gulp.parallel('prebuild', 'clean', 'reload-css'));
