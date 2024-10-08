//TODO CLEAN THIS!!!!!!!!
// TODO set select value to NAME again, NOT point!!!
// TODO add scaleX,y set lock/unlock buttons for scale and skew

//TODO the bbox must be UPDATED ON EACH CHANGE

import { create, appendChildren } from '../shortHands.js';
import { highlightBox } from './HighlightBox.js';

class TransformControl {
	constructor (element) {
		this.element = element;
		this.scaleLock = true;

		//UI
		this.controlPanel = create('div', { class: "transform-control" });
		this.contentContainer = create('div', { class: 'transform-content', style: "display: none" });

		this.init();
	}

	init() {
		if (!this.element) return;
		appendChildren(this.controlPanel, this.createHeader(), this.contentContainer);
		this.transformOriginSelect = this.createTransformOriginSelect('Transform Origin');
		this.transforms = this.initTransformInputs(); //create transforms inputs and populate obj

		this.createLockButtons();
	}

	// Initialize transform inputs as an object
	initTransformInputs() {

		if (!this.element) return;
		const transform = this.element.getAttribute('transform') || '';


		const transformConfig = {

			translateX: {
				label: 'Translation X',
				value: this.getTranslation(transform)[ 0 ],
				step: 1, min: -1500, max: 1500
			},
			translateY: {
				label: 'Translation Y',
				value: this.getTranslation(transform)[ 1 ],
				step: 1, min: -1500, max: 1500
			},
			rotation: {
				label: 'Rotation',
				value: this.getRotation(transform),
				step: 1, min: 0, max: 360
			},
			scaleX: {
				label: 'Scale X',
				value: this.getScale(transform)[ 0 ],
				step: 0.01, min: 0.1, max: 5
			},
			scaleY: {
				label: 'Scale Y',
				value: this.getScale(transform)[ 1 ],
				step: 0.01, min: 0.1, max: 5
			},
			skewX: {
				label: 'Skew X',
				value: this.getSkewX(transform),
				step: 0.1, min: -25, max: 25
			},
			skewY: {
				label: 'Skew Y',
				value: this.getSkewY(transform),
				step: 0.1, min: -25, max: 25
			},
		};

		// Create inputs for each transform and assign them back to the config
		Object.keys(transformConfig).forEach(key => {

			const { label, value, step, min, max } = transformConfig[ key ];
			transformConfig[ key ].input = this.createInput(label, value, step, min, max);
		});
		highlightBox.createHighlightRectangle(this.element);
		highlightBox.updateDimensions(this.element);

		return transformConfig; //  populated transforms object
	}

	// Create the collapsible header with an arrow
	createHeader() {
		const header = create('div', { class: 'transform-header section-title' });
		const arrow = create('span', { class: 'arrow', textContent: '▶' });
		const title = create('span', { textContent: 'Transform' });

		// Toggle collapse on header click
		header.addEventListener('click', () => this.toggleCollapse());
		appendChildren(header, arrow, title);
		return header;
	}

	// Toggle the collapsed state
	toggleCollapse() {
		const isCollapsed = this.contentContainer.style.display === 'none';
		this.contentContainer.style.display = isCollapsed ? 'block' : 'none';
		const arrow = this.controlPanel.querySelector('.arrow');
		arrow.textContent = isCollapsed ? '▼' : '▶';
	}


	// Set input values using an object
	setInputsValues(values) {
		//console.log('Setting input values:', values); // Debugging log
		Object.keys(this.transforms).forEach(key => {
			const input = this.transforms[ key ]?.input;
			if (input) {
				input.value = values[ key ] !== undefined ? values[ key ] : this.transforms[ key ].value;
				const range = input.nextElementSibling;
				if (range) {
					range.value = input.value;
					range.min = this.transforms[ key ].min || range.min;
					range.max = this.transforms[ key ].max || range.max;
				}
			} else {
				console.error(`Input for ${key} is undefined.`);
			}
		});
		this.transformOriginSelect.value = values.transformOrigin || 'top-left';
	}

	// Create an input field dynamically
	createInput(labelText, initialValue, step, min = null, max = null) {
		const container = create('div');
		const label = create('label', { textContent: labelText });

		const input = create('input', {
			type: 'number',
			value: initialValue,
			step: step,
			min: min,
			max: max
		});

		const range = create('input', {
			type: 'range',
			value: initialValue,
			step: step,
			min: min,
			max: max
		});

		input.addEventListener('input', () => {
			range.value = input.value;
			this.applyTransform();
		});

		range.addEventListener('input', () => {
			input.value = range.value;
			this.applyTransform();
		});

		appendChildren(container, label, input, range);
		this.contentContainer.appendChild(container);
		return input;
	}

	// Create lock buttons for scale and skew
	createLockButtons() {
		this.scaleLockButton = this.createLockButton('Lock Scale', this.scaleLock, this.toggleScaleLock);
		// this.skewLockButton = this.createLockButton('Lock Skew', this.skewLock, this.toggleSkewLock);
	}

	// Create a lock button
	createLockButton(labelText, initialState, toggleFn) {
		const container = create('div');
		const label = create('label', { textContent: labelText });
		const button = create('button', { textContent: initialState ? '🔒' : '🔓' });

		button.addEventListener('click', () => {
			button.textContent = toggleFn() ? '🔒' : '🔓';
		});

		appendChildren(container, label, button);
		this.contentContainer.appendChild(container);
		return button;
	}

	// Toggle scale lock
	toggleScaleLock = () => {
		this.scaleLock = !this.scaleLock;
		return this.scaleLock;
	}

	// // Toggle skew lock
	// toggleSkewLock = () => {
	// 	this.skewLock = !this.skewLock;
	// 	return this.skewLock;
	// }

	// Apply transformations to the element
	applyTransform() {
		if (!this.element) return;

		let { translateX, translateY, rotation, scaleX, scaleY, skewX, skewY } = this.extractValues();

		if (this.scaleLock) {
			scaleY = scaleX;
			this.transforms.scaleY.input.value = scaleX;
		}

		if (this.skewLock) {
			skewY = skewX;
			this.transforms.skewY.input.value = skewX;
		}

		const matrix = this.getMatrix(this.element);
		const newTransform = `matrix(${matrix.join(' ')}) translate(${translateX} ${translateY}) rotate(${rotation}) scale(${scaleX} ${scaleY}) skewX(${skewX}) skewY(${skewY})`;

		this.element.setAttribute('transform', newTransform.trim());
		highlightBox.updateDimensions(this.element);
	}

	// extract values from the inputs
	extractValues() {
		const values = {};
		Object.keys(this.transforms).forEach(key => {
			values[ key ] = parseFloat(this.transforms[ key ].input.value) || (key.startsWith('scale') ? 1 : 0);
		});
		return values;
	}




	// Create a dropdown for transform-origin
	createTransformOriginSelect(labelText) {
		const container = create('div');
		const label = create('label', { textContent: labelText });

		const select = create('select');

		// Options for transform-origin
		const options = [ 'top-left', 'top-right', 'center', 'bottom-left', 'bottom-right' ];

		options.forEach(option => {
			const opt = create('option', {
				value: option,
				textContent: option.replace('-', ' ').toUpperCase(),
			});
			select.appendChild(opt);
		});

		select.addEventListener('change', () => this.applyTransformOrigin());

		appendChildren(container, label, select)

		this.contentContainer.appendChild(container); container
		return select;
	}

	// based on the selected option
	applyTransformOrigin() {
		if (!this.element) return;

		const originOption = this.transformOriginSelect.value;
		const { x, y, width, height } = this.element.getBBox();

		const point = (a, b) => `${a} ${b}`;
		const originMap = {
			'top-left': point(x, y),
			'top-right': point(x + width, y),
			'center': point(x + width / 2, y + height / 2),
			'bottom-left': point(x, y + height),
			'bottom-right': point(x + width, y + height),
		};

		const origin = originMap[ originOption ];

		this.element.setAttribute('transform-origin', origin);
		highlightBox.updateDimensions(this.element);
	}

	// extract single transform values from the element's transform string
	getTranslation(transform) {
		const match = /translate\(\s*([^,\s]+)[,\s]+([^)]*)\)/.exec(transform) || /translate\(\s*([^,\s]+)[,\s]*([^)]*)\)/.exec(transform);
		return match ? [ match[ 1 ], match[ 2 ] ] : [ 0, 0 ];
	}

	getRotation(transform) {
		const match = /rotate\(\s*([^)]*)\)/.exec(transform);
		return match ? match[ 1 ] : 0;
	}

	getScale(transform) {
		const match = /scale\(\s*([^,\s]+)[,\s]*([^)]*)?\)/.exec(transform);
		return match ? [ match[ 1 ], match[ 2 ] || match[ 1 ] ] : [ 1, 1 ];
	}

	getSkewX(transform) {
		const match = /skewX\(\s*([^)]*)\)/.exec(transform);
		return match ? match[ 1 ] : 0;
	}

	getSkewY(transform) {
		const match = /skewY\(\s*([^)]*)\)/.exec(transform);
		return match ? match[ 1 ] : 0;
	}

	getMatrix(element) {
		const transform = element.getAttribute('transform') || '';
		const match = /matrix\(\s*([^)]+)\)/.exec(transform);
		if (match) {
			return match[ 1 ].trim().split(/\s+/).map(Number);
		} else {
			return [ 1, 0, 0, 1, 0, 0 ]; // default to identity matrix if no matrix found
		}
	}
}

export default TransformControl;
