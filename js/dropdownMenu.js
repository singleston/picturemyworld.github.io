/* Dropdown menu function */

/* When the user clicks on the menu button, toggle the dropdown content */
function toggleMenu() {
	let dropdownMenu = document.getElementById('dropdownMenu');
	let dropdownMenuButton = document.getElementById('dropdownMenuButton');

	// Toggle the display state of the dropdown content.
	dropdownMenu.style.display = ((dropdownMenu.style.display == 'block') ? 'none' : 'block');

	// Show the dropdown content when the mouse (if any) is over the button.
	dropdownMenuButton.onmouseover = function(e) {
		dropdownMenu.style.display = 'block'
	};

	// Hide the dropdown content when the mouse (if any) leave the content div.
	dropdownMenu.onmouseleave = function(e) {
		dropdownMenu.style.display = 'none'
	};
}
