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
	autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
babel = require('gulp-babel'); // Babel
include = require('gulp-file-include'); // Библиотека для инклюда файлов

gulp.task('sass', function () { // Создаем таск Sass
	return gulp.src('app/sass/*.scss') // Берем источник
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('build/css')) // Выгружаем результата в папку build/css
		.pipe(cssnano()) // Сжимаем
		.pipe(rename({ suffix: '.min' })) // Добавляем суффикс .min
		.pipe(gulp.dest('build/css')) // Выгружаем результата в папку build/css
		.pipe(browserSync.reload({
			stream: true
		})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function () { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'build' // Директория для сервера - build
		},
		notify: false // Отключаем уведомления
	});
});

gulp.task('scripts-libs', function () {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/js/libs.js', // Берем файл с библиотеками
	])
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

gulp.task('scripts', function () {
	return gulp.src([ // Берем все необходимые файлы js и исключаем файл с библиотеками
		'app/js/*', '!app/js/libs.js'
	])
		.pipe(gulp.dest('build/js')) // Выгружаем в папку build/js
		.pipe(browserSync.reload({ stream: true }))
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(rename({ suffix: '.min' })) // Добавляем суффикс .min
		.pipe(gulp.dest('build/js')) // Выгружаем в папку build/js
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('clean', function () {
	return del.sync('build'); // Удаляем папку build перед сборкой
});

gulp.task('img', function () {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({ // С кешированием
			// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('build/img')); // Выгружаем на продакшен
});

gulp.task('html', function () {
	return gulp.src(['app/*.html'])
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }))
})

// gulp.task('clear', function (callback) {
// 	return cache.clearAll();
// });

gulp.task('build', ['clean', 'html', 'sass', 'scripts', 'scripts-libs', 'img'])

gulp.task('watch', ['browser-sync', 'build'], function () {
	gulp.watch("app/sass/*.scss", ['sass']).on('change', browserSync.reload); // Наблюдение за SCSS файлами в корне проекта
	gulp.watch('app/*.html', ['html'], browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch(['app/js/*.js'], ['scripts-libs', 'scripts'], browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('default', ['watch']);