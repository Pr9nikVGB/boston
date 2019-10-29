$(function() {
	ymaps.ready(init);
	function init() {
		var myMap = new ymaps.Map("map", {
				center: [55.699484, 37.818073],
				zoom: 14,
				controls: []
			}, {
				searchControlProvider: 'yandex#search'
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
});