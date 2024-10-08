import { createSVGElement } from "../utils.js";
class PatternManager {
	constructor (svgContainer) {
		this.svgContainer = svgContainer;
		this.patternId = 'checkerboardPattern';
		this.isCheckerboardVisible = true;

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


			//squares in the pattern
			pattern.appendChild(createSVGElement('rect', { x: 0, y: 0, width: 20, height: 20, fill: 'lightgray', stroke: 'none' }));
			pattern.appendChild(createSVGElement('rect', { x: 10, y: 0, width: 10, height: 10, fill: 'white', stroke: 'none' }));
			pattern.appendChild(createSVGElement('rect', { x: 0, y: 10, width: 10, height: 10, fill: 'white', stroke: 'none' }));
		}
		svgElement.appendChild(pattern);
	}

	addCheckerboardPattern(svgElement) {

		let width, height;

		// Check for the viewBox attribute
		if (svgElement.getAttribute('viewBox')) {
			const viewBox = svgElement.getAttribute('viewBox').split(' ');
			width = viewBox[ 2 ];
			height = viewBox[ 3 ];
		} else {
			// TODO ??? fo I really need that?
			width = svgElement.getAttribute('width') || '100%';
			height = svgElement.getAttribute('height') || '100%';
		}

		//  pattern fill rect
		const rect = createSVGElement('rect', {
			x: 0,
			y: 0,
			width: width,
			height: height,
			fill: `url(#${this.patternId})`,
			class: 'checkerboard-rect',
			'pointer-events': 'none'
		});

		svgElement.prepend(rect);
	}


	toggleCheckerboardVisibility(svgElement) {
		this.isCheckerboardVisible = !this.isCheckerboardVisible;


		const checkerboardRect = svgElement.querySelector('.checkerboard-rect');
		if (checkerboardRect) {
			checkerboardRect.style.display = this.isCheckerboardVisible ? 'block' : 'none';
		}
	}


}
export default PatternManager;