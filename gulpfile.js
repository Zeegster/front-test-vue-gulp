// Importing necessary modules
import gulp from 'gulp';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import { VueLoaderPlugin } from 'vue-loader';
import fileInclude from 'gulp-file-include';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import fs from 'fs';
import browserSync from 'browser-sync';
import sassCompiler from 'sass'; // Importing Dart Sass
import sassGlob from 'gulp-sass-glob';
import sourceMaps from 'gulp-sourcemaps';
import autoPrefixer from 'gulp-autoprefixer';
import gulpClean from 'gulp-clean';
import postcss from 'gulp-postcss';

let sass;
(async () => {
  const sassModule = await import('gulp-sass');
  const sassCompilerModule = await import('sass');
  sass = sassModule.default(sassCompilerModule.default);
})();

// Define tasks using ES module syntax
export const cleanDev = (done) => {
  if (fs.existsSync('./build/')) {
    return gulp.src('./build/', { read: false }).pipe(gulpClean({ force: true }));
  }
  done();
};

const fileIncludeSetting = {
  prefix: '@@',
  basepath: '@file',
};

const plumberNotify = (title) => ({
  errorHandler: notify.onError({
    title: title,
    message: 'Error <%= error.message %>',
    sound: false,
  }),
});

export const htmlDev = () =>
  gulp
  .src('./src/index.html')
  .pipe(plumber(plumberNotify('HTML')))
  .pipe(fileInclude(fileIncludeSetting))
  .pipe(gulp.dest('./build/'));

export const sassDev = () =>
  gulp
  .src('./src/**/*.scss')
  .pipe(plumber(plumberNotify('SCSS')))
  .pipe(sourceMaps.init())
  .pipe(sassGlob())
  .pipe(sass())
  .pipe(postcss())  
  .pipe(sourceMaps.write())
  .pipe(gulp.dest('./build/css/'));

export const fontsDev = () =>
  gulp
  .src('./src/fonts/**/*')
  .pipe(gulp.dest('./build/fonts/'));

export const vueBuild = () =>
  gulp
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
              options: 
                postcss([autoPrefixer()])
              ,
            },
            {
              test: /\.css$/,
              use: ['vue-style-loader', 'css-loader','postcss-loader'],
            },
            {
              test: /\.scss$/,
              use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
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

export const browserSyncTask = () => {
  browserSync.init({
    server: {
      baseDir: './build',
    },
    notify: false,
  });
};

export const watchDev = () => {
  gulp.watch('./src/index.html', gulp.parallel(htmlDev));
  gulp.watch('./src/**/*.scss', gulp.parallel(sassDev));
  gulp.watch(['./src/**/*.vue', './src/**/*.js'], gulp.parallel(vueBuild));

  gulp.watch('./build/**/*').on('change', browserSync.reload);
};

// Default task
export default gulp.series(
  cleanDev,
  gulp.parallel(htmlDev, sassDev, vueBuild, fontsDev),
  gulp.parallel(browserSyncTask, watchDev)
);