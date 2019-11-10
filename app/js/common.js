$(document).ready(function() {
	let mobile = false;
	if ( $(window).width() < '768') {
		mobile = true;
	}
	ymaps.ready(init);
	function init() {
		console.log(mobile);
		var myMap = new ymaps.Map("map", {
				center: (mobile) ? [55.699157, 37.806075] :[55.699484, 37.818073],
				zoom: 14,
				controls: []
			}, {
				searchControlProvider: 'yandex#search',
				suppressMapOpenBlock: true
			}),
			MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
				'<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
			),
			myPlacemarkWithContent = new ymaps.Placemark([55.699157, 37.806075], {
				// Контент метки.
				hintContent: 'Boston',
				balloonContent: '<b>Наш адрес</b><br>' +
					'Москва, ул. Большая Семеновская<br>' +
					'21 стр. 2<br>' +
					'<b>Режим работы</b><br>' +
					'С 9:00 до 18:00',
			}, {
				iconLayout: 'default#imageWithContent',
				iconImageHref: 'img/placemark.svg',
				iconImageSize: [47, 62],
				iconImageOffset: [-23, -62],
				iconContentOffset: [15, 15],
				iconContentLayout: MyIconContentLayout
			});
		myMap.geoObjects
			.add(myPlacemarkWithContent);
	}

	var mySwiper = new Swiper ('.swiper-container', {
		// Optional parameters
		pagination: {
			el: '.c-bullets__wrapper',
			type: 'bullets',
			bulletClass: 'c-bullets__bullet',
			bulletActiveClass: 'c-bullets__bullet--active',
			clickable: true
		},
		// Navigation arrows
		navigation: {
			nextEl: '.c-slide-arrows__arrow--right',
			prevEl: '.c-slide-arrows__arrow--left',
			disabledClass: 'c-slide-arrows__arrow--disable'
		},
		loop: true
	});
	$('.js-menu-button').on('click', function(e){
		$(e.currentTarget).toggleClass('c-menu-button--active');
	});
	$('.c-hamburger-menu__item--parent').on('click', function(e){
		$(e.currentTarget).parent().find('.c-drop-menu').fadeToggle("slow", "linear");
	});
	$(window).scroll(function () {
		if ($(window).width() > 768) {
			if ($(this).scrollTop() > 700) {
				$('.c-header').addClass("c-header--fixed");
			} else {
				$('.c-header').removeClass("c-header--fixed");
			}
		} else {
			if ($(this).scrollTop() > 61) {
				$('body').addClass('fixed-panel');
				$('.c-top-panel').addClass("c-top-panel--fixed");
			} else {

				$('.c-top-panel').removeClass("c-top-panel--fixed");
				$('body').removeClass('fixed-panel');
			}
		}
	});
});