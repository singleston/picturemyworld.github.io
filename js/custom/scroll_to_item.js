// Pure JavaScript equivalent to jQuery's `$.ready()` function when the page/dom is ready
// Trick working for all web browsers.
// https://stackoverflow.com/a/30319853/2790648
function ready(f){/in/.test(document.readyState)?setTimeout('ready('+f+')',9):f()}
ready(function(){
	let identifier = window.location.hash.substring(1);
	let element = document.getElementById(identifier);
	if (element) {
		// Pure Javascript scroll to with alignment.
		// https://stackoverflow.com/a/36499256/2790648
		const elementRect = element.getBoundingClientRect();
		const absoluteElementTop = elementRect.top + window.pageYOffset;
		const middle = absoluteElementTop - 90; // `-90`in order to show the element under the nav bar, not behind it.
		window.scrollTo(0, middle);
	}
});
