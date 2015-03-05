//:::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
// Dependencies
//
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::
var gulp = require('gulp');

var browserify = require('browserify'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    cjsx = require('gulp-coffee-react-transform'),
    mainBowerFiles = require('main-bower-files'),
    newer = require('gulp-newer'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    source = require('vinyl-source-stream'),
    watch = require('gulp-watch');

//gulp-jshint
//gulp-uglifyjs
//run-sequence (for having 1 task run many)
//gulp-autoprefixer
//gulp-open (for opening browser tab to launch local site, only use this if can manage to set FE stuff up locally)
//css-sprite
//gulp-if (for help piping css-sprite images into correct file/folder)
//gulp-replace (for css-sprite regex)
//gulp-minify-css
//gulp-imagemin
//gulp-combine-media-queries
//gulp-livereload (if can manage to set FE stuff up locally)
//gulp-connect (if launching locally)
//gulp-clean
//gulp-file-include (if can manage to set FE stuff up locally and separate from everything else)

    
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
// Config/Environment variables
//
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::
var srcRoot = '../movado_core/preprocessed/',
    distRoot = '../movado_core/cartridge/static/default/';

var config = {
    bower: {
        src: './bower_components',
        dest: distRoot + 'js/vendor'
    },
    coffee: {
        src: srcRoot + 'coffee/**/*.coffee',
        dest: distRoot + 'js'
    },
    dwbrowserify: {
        src: srcRoot + 'js/dw/app.js',
        dest: distRoot + 'js/dw'
    },
    sass: {
        src: srcRoot + 'scss/**/*.scss',
        dest: distRoot + 'css'
    },
    onPlumberError: function(error) {
        console.log(error.toString());
        this.emit('end');
    }
}

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
// Tasks defined
//
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::
// don't need this as the bowerrc file tells the dependencies to be saved
// to the cartridge itself
// gulp.task('bower', function() {
//     return gulp.src(mainBowerFiles())
//         .pipe(plumber(config.onPlumberError))
//         .pipe(gulp.dest(config.bower.dest))
// });

gulp.task('coffee', function () {
    return gulp.src(config.coffee.src)
        .pipe(plumber(config.onPlumberError))
        .pipe(newer(config.coffee.dest))
        .pipe(cjsx())
        .pipe(coffee())
        .pipe(gulp.dest(config.coffee.dest));
});

// had to ignore a few require statements
// TODO: investigate imagesloaded and promise and how to get them without 
// breaking the convention
gulp.task('dwbrowserify', function() {
    return browserify(config.dwbrowserify.src)
        .ignore('lodash')
        .ignore('imagesloaded')
        .ignore('promise')
        .bundle()
        .pipe(plumber(config.onPlumberError))
        .pipe(source('dwscript.js'))
        .pipe(gulp.dest(config.dwbrowserify.dest));
});

gulp.task('sass', function () {
    return gulp.src(config.sass.src)
        .pipe(plumber(config.onPlumberError))
        .pipe(newer(config.sass.dest))
        .pipe(sass())
        .pipe(gulp.dest(config.sass.dest));
});

gulp.task('watch', function () {
    watch(config.sass.src, function() {
        gulp.start('sass');
    });
    
    watch(config.coffee.src, function() {
        gulp.start('coffee');
    });
});

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
// Default task defined
//
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::
gulp.task('default', ['watch']);