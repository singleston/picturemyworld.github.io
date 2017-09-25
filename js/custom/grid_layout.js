/**
 * grid_layout.js
 *
 * Attach javascript to grid-gallery.
 * Initialize grid and update custom height for each grid item.
 */
// var grid =
// new CBPGridGallery(document.getElementById('grid-gallery'));

refreshGridLayout = function() {

	// Calculate and set the 'responsive' display size for the each thumbnails in the grid.
	[].forEach.call(document.getElementsByClassName('grid_thumbnail'), function(element) {
		let ratio = element.dataset.ratio
		let width = element.width
		let newHeight = (width / ratio).toFixed(2);
		element.style.height = newHeight + "px";
	});

	// Mansory custom grid layout
	new CBPGridGallery(document.getElementById('grid-gallery'));

	// Mazy loading
	var myLazyLoad = new LazyLoad({
		threshold: 0
	});
};

refreshGridLayout();
