const gulp = require('gulp'),
 webpack = require('webpack'),
 webpackStream = require('webpack-stream'),
 { VueLoaderPlugin } = require('vue-loader'),
 clean = require('gulp-clean'),
 fileInclude = require('gulp-file-include'),
 plumber = require('gulp-plumber'),
 notify = require('gulp-notify'),
 fs = require('fs'),
 browserSync = require('browser-sync').create(),
 sass = require('gulp-sass')(require('sass')),
 sassGlob = require('gulp-sass-glob'),
 sourceMaps = require('gulp-sourcemaps')
;


gulp.task('clean:dev', function (done) {
 if (fs.existsSync('./build/')) {
    return gulp.src('./build/', { read: false }).pipe(clean({ force: true }));
 }
 done();
});

const fileIncludeSetting = {
 prefix: '@@',
 basepath: '@file',
};

const plumberNotify = (title) => {
 return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error <%= error.message %>',
      sound: false,
    }),
 };
};

gulp.task('html:dev', function () {
 return gulp
    .src('./src/index.html')
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(gulp.dest('./build/'));
});

gulp.task('sass:dev', function () {
	return (
		gulp
			.src('./src/**/*.scss')
			.pipe(plumber(plumberNotify('SCSS')))
			.pipe(sourceMaps.init())
			.pipe(sassGlob())
			.pipe(sass())
			.pipe(sourceMaps.write())
			.pipe(gulp.dest('./build/css/'))
	);
});

gulp.task('fonts:dev', function () {
	return gulp
		.src('./src/fonts/**/*')
		.pipe(gulp.dest('./build/fonts/'));
});

gulp.task('vue', function buildVue() {
 return gulp
    .src('./src/main.js')
    .pipe(plumber(plumberNotify('VUE')))
    .pipe(
      webpackStream({
        mode: 'development',
        module: {
          rules: [
            {
              test: /\.vue$/,
              loader: 'vue-loader',
            },
            {
              test: /\.css$/,
              use: ['vue-style-loader', 'css-loader'],
            },
          ],
        },
        plugins: [
          new VueLoaderPlugin(),
          new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: true,
          }),
        ],
      })
    )
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('browser-sync', function() {
 browserSync.init({
    server: {
      baseDir: "./build"
    },
    notify: false
 });
});

gulp.task('watch:dev', function () {
 gulp.watch('./src/index.html', gulp.parallel('html:dev'));
 gulp.watch('./src/**/*.scss', gulp.parallel('sass:dev'));
 gulp.watch(['./src/**/*.vue','./src/**/*.js'], gulp.parallel('vue'));

 gulp.watch('./build/**/*').on('change', browserSync.reload);
});

gulp.task(
 'default',
 gulp.series('clean:dev', gulp.parallel('html:dev','sass:dev', 'vue','fonts:dev'),gulp.parallel('browser-sync', 'watch:dev')),
 
);
