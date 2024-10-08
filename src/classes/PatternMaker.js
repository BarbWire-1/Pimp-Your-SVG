import { appendChildren } from "../shortHands.js";

import { createSVGElement } from "../utils.js";

class PatternManager {
	constructor (svgContainer) {
		this.svgContainer = svgContainer;
		this.patternId = 'checkerboardPattern';
		this.isCheckerboardVisible = true;
		this.rect = null;
	}

	createCheckerBoardPattern(svgElement) {
		let pattern = svgElement.querySelector(`#${this.patternId}`);
		if (!pattern) {
			// Create the pattern
			pattern = createSVGElement('pattern', {
				id: this.patternId,
				width: 20,
				height: 20,
				patternUnits: 'userSpaceOnUse'
			});

			// Squares in the pattern
			pattern.appendChild(createSVGElement('rect', { x: 0, y: 0, width: 20, height: 20, fill: 'lightgray', stroke: 'none' }));
			pattern.appendChild(createSVGElement('rect', { x: 10, y: 0, width: 10, height: 10, fill: 'white', stroke: 'none' }));
			pattern.appendChild(createSVGElement('rect', { x: 0, y: 10, width: 10, height: 10, fill: 'white', stroke: 'none' }));
		}
		svgElement.appendChild(pattern);
	}

	addCheckerboardPattern(svgElement) {
		const { width, height } = this.getSVGDimensions(svgElement);

		// Pattern fill rect
		this.rect = createSVGElement('rect', {
			x: 0,
			y: 0,
			width: width,
			height: height,
			fill: `url(#${this.patternId})`,
			class: 'checkerboard-rect',
			'pointer-events': 'none'
		});

		svgElement.prepend(this.rect);
	}

	// Method to update the checkerboard when viewBox or dimensions change
	updateCheckerBoard() {

	console.log("should update pattern")
		const { width, height } = this.getSVGDimensions();

		// If the rect already exists, update its size
		if (this.rect) {
			this.rect.setAttribute('width', width);
			this.rect.setAttribute('height', height);
		}
	}

	toggleCheckerboardVisibility(svgElement) {
		this.isCheckerboardVisible = !this.isCheckerboardVisible;

		const checkerboardRect = svgElement.querySelector('.checkerboard-rect');
		if (checkerboardRect) {
			checkerboardRect.style.display = this.isCheckerboardVisible ? 'block' : 'none';
		}
	}

	// Helper function to get the dimensions of the SVG
	getSVGDimensions() {

		const svgElement = this.svgContainer.querySelector('svg')
		let width, height;
		console.log(svgElement.getAttribute('viewBox'))
		// Check for the viewBox attribute
		if (svgElement.getAttribute('viewBox')) {
			const viewBox = svgElement.getAttribute('viewBox').split(' ');
			width = viewBox[ 2 ];
			height = viewBox[ 3 ];
		} else {
			// Fallback to width and height attributes
			width = svgElement.getAttribute('width') || '100%';
			height = svgElement.getAttribute('height') || '100%';
		}
console.log({width}, {height})
		return { width, height };
	}
}

export default PatternManager;
