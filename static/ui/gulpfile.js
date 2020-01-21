// Include gulp
var gulp = require( 'gulp' );

// Include Our Plugins
var concat = require( 'gulp-concat' );
var ngAnnotate = require( 'gulp-ng-annotate' );
var rename = require( 'gulp-rename' );
var sourcemaps = require( 'gulp-sourcemaps' );
var uglify = require( 'gulp-uglify' );

var appPaths = {
    'dist': 'dist/',
    'components': 'modules/'
}

var jsFiles = [
    appPaths.components + '**/*.js',
    '!' + appPaths.components + 'app.js',
    '!' + appPaths.components + 'app.config.js',
 //   '!' + appPaths.components + 'core/**/*.js',
];

// Concatenate & Minify JS
gulp.task( 'scripts', function () {
    return gulp.src( jsFiles )
        .pipe( sourcemaps.init() )
        .pipe( concat( 'app.js', {
            //newLine: ';'
        } ) )
        .pipe( gulp.dest( appPaths.dist ) )
        .pipe( rename( 'app.min.js' ) )
        .pipe( uglify( {
            mangle: true
        } ) )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( appPaths.dist ) );
} );

// Watch Files For Changes
gulp.task( 'watch', function () {
    gulp.watch( jsFiles, [ 'scripts' ] );
} );

// Default Task
gulp.task( 'default', ['scripts'] );