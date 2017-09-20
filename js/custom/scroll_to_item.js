// Pure JavaScript equivalent to jQuery's `$.ready()` function when the page/dom is ready
// Trick working for all web browsers.
// https://stackoverflow.com/a/30319853/2790648
function ready(f){/in/.test(document.readyState)?setTimeout('ready('+f+')',9):f()}
ready(function(){
	let identifier = window.location.hash.substring(1);
	let element = document.getElementById(identifier);
	let header_height = document.getElementsByClassName("header_container")[0].getBoundingClientRect().height
	if (element && header_height) {
		const elementTop = element.getBoundingClientRect().top;
		const middle = elementTop - header_height - 20; // Extra margin
		window.scrollTo(0, middle);
	}
});
