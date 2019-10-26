var gulp = require('gulp'), // Подключаем Gulp
	sass = require('gulp-sass'), // Подключаем Sass пакет,
	browserSync = require('browser-sync'), // Подключаем Browser Sync
	uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del = require('del'), // Подключаем библиотеку для удаления файлов и папок
	imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache = require('gulp-cache'), // Подключаем библиотеку кеширования
	concat = require('gulp-concat'), // Подключаем библиотеку конкатенирования
	sourcemaps = require('gulp-sourcemaps'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
babel = require('gulp-babel'); // Babel
include = require('gulp-file-include'); // Библиотека для инклюда файлов

gulp.task('sass', async function () { // Создаем таск Sass
	return gulp.src('app/sass/**/*.scss') // Берем источник
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('all.css'))
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer({
			browsers: ['> 0.1%'],
			cascade: false
		}))
		.pipe(gulp.dest('build/css')) // Выгружаем результата в папку build/css
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({ suffix: '.min' })) // Добавляем суффикс .min
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/css')) // Выгружаем результата в папку build/css
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('scripts-libs', async function () {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/js/libs.js', // Берем файл с библиотеками
	])
		.pipe(plumber())
		.pipe(include({ // Инклюдим библиотеки
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('build/js')) // Выгружаем в папку build/js
		.pipe(rename({ suffix: '.min' })) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('build/js')) // Выгружаем в папку build/js
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('scripts', async function () {
	return gulp.src([ // Берем все необходимые файлы js и исключаем файл с библиотеками
		'app/js/*', '!app/js/libs.js'
	])
		.pipe(plumber())
		.pipe(gulp.dest('build/js')) // Выгружаем в папку build/js
		.pipe(browserSync.reload({ stream: true }))
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(rename({ suffix: '.min' })) // Добавляем суффикс .min
		.pipe(gulp.dest('build/js')) // Выгружаем в папку build/js
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('clean', async function () {
	return del.sync('build'); // Удаляем папку build перед сборкой
});

gulp.task('img', async function () {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(plumber())
		.pipe(cache(imagemin({ // С кешированием
			interlaced: true,
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('build/img'))
});
function html () {
	return gulp.src(['app/*.html'])
		.pipe(plumber())
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }))
}

gulp.task('html', async function () {
	return gulp.src(['app/*.html'])
		.pipe(plumber())
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }))
})

gulp.task('transferFonts', async function (cb) {
	return gulp.src(['app/fonts/*'])
		.pipe(gulp.dest('build/fonts'));
    cb();
})
gulp.task('build',gulp.series('clean','html', 'img', 'sass', 'scripts', 'scripts-libs', 'transferFonts'));

gulp.task('watch', async function () {
	browserSync.init({
		server: { // Определяем параметры сервера
			baseDir: 'build' // Директория для сервера - build
		},
	});
	gulp.series('build');
	gulp.watch('app/**/**.html', gulp.series('html')).on('change', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch("app/sass/**/*.scss", gulp.series('sass')).on('change', browserSync.reload); // Наблюдение за SCSS файлами в корне проекта
	gulp.watch('app/js/*.js',  gulp.series('scripts-libs', 'scripts'), browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('default', gulp.series('watch', function () {}));