var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var	imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');


//scripts task
//Uglifies JS
gulp.task('scripts', function(){
	gulp.src('**/js/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'))
});

//minify task
//minify html
gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});

//styles task
//uglify CSS
gulp.task('styles', function(){
	gulp.src('**/css/*.css')
	.pipe(uglifycss())
	.pipe(gulp.dest('dist/css'))
	.on('error', console.error.bind(console))
});

//imagemin task
//minifies images
gulp.task('imagemin', function(){
	gulp.src('**/images/*')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img'))
});

//watch task
gulp.task('watch', function(){
	gulp.watch('**/js/*.js', ['scripts']);
	gulp.watch('**/css/*.css', ['styles']);
	gulp.watch('index.html', ['minify']);
	gulp.watch('**/images/*', ['imagemin']);
});

gulp.task('default', ['scripts', 'styles', 'watch', 'minify', 'imagemin']);
