let gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify-es').default,
  cleanCSS = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  copy = require('gulp-copy');
(del = require('del')),
  (imagemin = require('gulp-imagemin')),
  (cache = require('gulp-cache')),
  (autoprefixer = require('gulp-autoprefixer')),
  (plumber = require('gulp-plumber')),
  (pug = require('gulp-pug')),
  (pugLinter = require('gulp-pug-linter')),
  (bemValidator = require('gulp-html-bem-validator'));

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: 'dev',
      index: 'html/index.html',
    },
    notify: true,
  });
});

gulp.task('sass', function () {
  return gulp
    .src('app/sass/**/*.sass')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(
      autoprefixer({
        grid: true,
        overrideBrowserslist: ['last 10 versions'],
      })
    )
    .pipe(cleanCSS()) // Опционально, закомментировать при отладке
    .pipe(gulp.dest('dev/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', function () {
  return gulp
    .src(['app/js/index.js'])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dev/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('pug', function () {
  return gulp
    .src('app/pug/**/*.pug')
    .pipe(plumber())
    .pipe(pugLinter({ reporter: 'default' }))
    .pipe(pug())
    .pipe(bemValidator())
    .pipe(gulp.dest('dev/html'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('imagemin', function () {
  return gulp
    .src('app/img/**/*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dev/img'));
});

gulp.task('imageBuild', function () {
  return gulp
    .src('dev/img/**/*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('removedist', function () {
  return del(['dist'], { force: true });
});

gulp.task('removeDev', function () {
  return del(['dev'], { force: true });
});

gulp.task('clearcache', function () {
  return cache.clearAll();
});

gulp.task('buildHtml', function () {
  return gulp.src(['dev/html/index.html']).pipe(gulp.dest('dist/html'));
});
gulp.task('buildCss', function () {
  return gulp.src(['dev/css/styles.min.css']).pipe(gulp.dest('dist/css'));
});
gulp.task('buildJs', function () {
  return gulp.src(['dev/js/scripts.min.js']).pipe(gulp.dest('dist/js'));
});
gulp.task('buildFonts', function () {
  return gulp.src(['dev/fonts/**/*']).pipe(gulp.dest('dist/fonts'));
});

gulp.task('copyImg', function () {
  return gulp.src('app/img/*').pipe(gulp.dest('dev/img'));
});

gulp.task('copyFont', function () {
  return gulp.src('app/fonts/*').pipe(gulp.dest('dev/fonts'));
});

gulp.task('copy', gulp.parallel('copyImg', 'copyFont'));

gulp.task('watch', function () {
  gulp.watch('app/pug/*.pug', gulp.parallel('pug'));
  gulp.watch('app/sass/*.sass', gulp.parallel('sass'));
  gulp.watch(['app/js/index.js'], gulp.parallel('js'));
});

gulp.task('initDev', gulp.series('removeDev', 'copy', 'pug', 'sass', 'js'));

gulp.task(
  'build',
  gulp.series(
    'removedist',
    'initDev',
    'imageBuild',
    'buildFonts',
    'buildHtml',
    'buildCss',
    'buildJs'
  )
);
gulp.task('default', gulp.parallel('initDev', 'browser-sync', 'watch'));
