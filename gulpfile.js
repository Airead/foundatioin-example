'use strict';
var browser = require('browser-sync');
var gulp = require('gulp');
var sequence = require('run-sequence');
var sass = require('gulp-sass');


// Port to use for the development server.
var PORT = 8000;

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

var PATHS = {
    sass: [
        'node_modules/foundation-sites/scss',
    ],
};

var EXAMPLE_PATHS = [
    './public'
];

// Browser Sync wrapper task
// allows for proper injection of css files
gulp.task('reload', function(cb) {
    browser.reload();
    cb();
});

gulp.task('server', function() {
    browser.init({
        server: {
            baseDir: ".",
            index: ['index.html', "./public/index.html"]
        },
        port: PORT,
        middleware: function(req, res, next) {
            if (req.url === '/') {
                res.writeHead(302, {
                    'Location': 'public/'
                });
                return res.end();
            }
            next();
        }
    });
});

gulp.task('clean', function(done) {
    done();
});

// Build the "dist" folder by running all of the above tasks
gulp.task('build', function(done) {
    sequence('clean', ['sass'], done);
});

gulp.task('sass', function(done) {
    gulp.src('./public/**/app.scss')
        .pipe(sass({
            includePaths: PATHS.sass
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public'))
        .pipe(browser.reload({stream: true}));
    done();
});

// Build the site, run the server, and watch for file changes
gulp.task('default', ['build', 'server'], function() {
    gulp.watch(['public/**/*.scss'], ['sass']);
    gulp.watch(['public/**/*.html'], ['reload']);
});
