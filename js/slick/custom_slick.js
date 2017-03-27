/* customsslick.js */

function setupSlick(initialIndex) {

	console.log("sliiiick")
	console.log(initialIndex)
	$('.responsive').slick({
		initialSlide: initialIndex,
		slidesToShow: 1, 
		slidesToScroll: 1, 
		infinite: false, 
		dots: true, 
		centerMode: true, 
		variableWidth: true, 
		adaptiveHeight: true, 
		variableHeight: true
	});
}

$(document).ready(function(){
	setupSlick(5)
});
