import { createSVGElement } from '../utils.js';
class HighlightBox {
	constructor () {
	}

	createHighlightRectangle(el) {
		if (this.highlightBox) return;
		this.highlightBox = createSVGElement('rect', {
			class: 'highlight-box',
			fill: 'none',
			stroke: 'red',
			'stroke-width': 1,
			'stroke-dasharray': '2,2',
			'pointer-events': 'none',


		});
		document.querySelector('svg')?.appendChild(this.highlightBox);
		this.updateDimensions(el);
	}

	// using getBoundingClientRect and MatrixTransform
	updateDimensions(el) {

		const rect = el.getBoundingClientRect();

		// to consider nested transforms...
		const svg = document.querySelector('svg');
		const svgCTM = svg.getScreenCTM();

		// convert point to svg ccordSystem
		const point = svg.createSVGPoint();
		point.x = rect.left;
		point.y = rect.top;
		const svgPoint = point.matrixTransform(svgCTM.inverse());


		// dimensions in the SVG coordinate space
		const width = rect.width / svgCTM.a; //  x-axis scale
		const height = rect.height / svgCTM.a// y-axis scale

		// position and size of the highlight rectangle
		const dimensions = {
			'x': svgPoint.x,
			'y': svgPoint.y,
			'width': width,
			'height': height
		}
		Object.entries(dimensions).forEach(([ key, value ]) =>
			this.highlightBox.setAttribute(key, value)
		);


	}
}
export const highlightBox = new HighlightBox();