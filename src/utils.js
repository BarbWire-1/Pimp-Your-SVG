
// handle rgb and named colors
function colorValueToHex(color) {
	if (color.startsWith('#')) return color;

	const rgbValues = color.match(/\d+/g);
	if (rgbValues) {
		return `#${rgbValues.map(value => {
			const hex = parseInt(value).toString(16).padStart(2, '0');
			return hex;
		}).join('')}`;
	}

	const tempElement = document.createElement('div');
	tempElement.style.color = color;
	document.body.appendChild(tempElement);
	const computedColor = window.getComputedStyle(tempElement).color;
	document.body.removeChild(tempElement);
	return colorValueToHex(computedColor);
}

// Utility function to create an SVG element with the given tag name and attributes
function createSVGElement(tag, attributes = {}) {
	const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (let [ key, value ] of Object.entries(attributes)) {
		el.setAttribute(key, value);
	}
	return el; // Return the created SVG element
}

export {colorValueToHex, createSVGElement}