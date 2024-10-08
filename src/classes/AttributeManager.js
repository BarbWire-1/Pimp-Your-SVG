import { svgAttributes } from '../svgAttributes.js';
import { create, appendChildren } from '../shortHands.js';
import { colorValueToHex } from '../utils.js';
import HistoryManager from "./HistoryManager.js";
import TransformControl from "./TransformControl.js";


class AttributeManager {
	constructor (inputContainer, svgElementManager, patternManager) {
		this.inputContainer = inputContainer;
		this.svgElementManager = svgElementManager;
		this.activeEl = this.svgElementManager.activEl;
		this.patternManager = patternManager;
		this.historyManager = new HistoryManager(); // Initialize the history manager
		this.excludedAttributes = [ 'data-active', 'xmlns', 'xmlns:xlink', 'version', 'xml:space', 'transform', 'transform-origin' ];

	}
	appendComponents(obj, isParent = false, el) {
		if (!el) return;// exclude NOT svg els here (??)



		const sectionDiv = this.createSection(isParent, el);
		const attributesContainer = create('div', {
			class: 'attributes-container' + (isParent ? '-hidden' : ''),
			style: "display: " + (isParent ? "none" : "block")
		});

		if (el.tagName !== 'svg') {
			const transformControl = new TransformControl(el);
			transformControl.controlPanel.classList.add('transform-control-panel');

			attributesContainer.appendChild(transformControl.controlPanel);
		}

		Object.entries(obj).forEach(([ key, value ]) => {

			if (!this.excludedAttributes.includes(key)) {
				const attributeDiv = this.createAttributeDiv(key, value, el);
				attributesContainer.appendChild(attributeDiv);
				el.setAttribute(key, value)
			}
		});

		this.addNewAttributeInput(attributesContainer, el);
		sectionDiv.appendChild(attributesContainer);
		this.inputContainer.appendChild(sectionDiv);
		this.addToggleFunctionality(sectionDiv, attributesContainer);

		// // Save the initial state for undo/redo when modifying attributes
		const initialState = el.outerHTML;
		this.historyManager.saveState(initialState);

// 		//Add event listeners for changes to track them in history
// 				Object.entries(obj).forEach(([ key, value ]) => {
// 					if (!this.excludedAttributes.includes(key)) {
// 						// Modify this part to track the change in history
// 						const inputElement = this.createAttributeDiv(key, value, el);
//
// 						// // Track attribute changes for undo/redo
// 						inputElement.addEventListener('input', () => {
//
// 							const currentState = element.outerHTML;
// 							this.historyManager.saveState(currentState);
// 						});
// 					}
// 				});
		el.removeAttribute('style');// as splitted in single attributes
	}

	createSection(isParent, el) {


		const sectionDiv = create('div', { className: 'attribute-section' });
		const toggleArrow = create('span', { textContent: '▶', class: 'toggle-arrow' });
		const sectionTitle = create('div', {
			class: 'section-title',
			textContent: isParent ? `Parent (${el.tagName}) ` : `Element: ${el?.tagName}`,

		});

		// Append multiple children at once
		appendChildren(sectionDiv, toggleArrow, sectionTitle);

		return sectionDiv;
	}

	createColorInput(newEl, el, wrapper, label, key, value) {
		const colorWrapper = create('div', { class: 'color-input-wrapper' });
		const input = this.createInput(el, 'text', colorValueToHex(value) ,key);
		const colorPicker = this.createInput(el, 'color', colorValueToHex(value), key);

		// Event listener to synchronize input and color picker
		const syncColor = () => {
			input.value = colorPicker.value;
			el.setAttribute(key, colorPicker.value);
		};

		colorPicker.addEventListener('input', syncColor);

		input.addEventListener('input', () => {
			el.setAttribute(key, input.value);
			colorPicker.value = colorValueToHex(input.value);
		});

		appendChildren(colorWrapper, colorPicker);
		appendChildren(newEl, label, colorWrapper, wrapper);
		wrapper.appendChild(input);
	}

	createInput(element,type, value, key) {
		const input = create('input', { type, value, key });
		//console.log(input)
		// TODO NOT WORKING FOR TRANSFORM CONTROLS!!!!
		// on mouseup store prev state
		input.addEventListener('mouseup', () => {
			//console.log(input, "released")


			this.saveState(element); // Save state for history
		});
		return input;

	}

	createNumberOrTextInput(key, value, element) {
		const inputType = isNaN(value) ? 'text' : 'number';
		const input = this.createInput(element, inputType, value, key);

		input.addEventListener('input', () => {
			element.setAttribute(key, input.value);
			//TODO not properly implemented yet
			if (key === 'viewBox') {
				this.updateCheckerboard(); 
			}

		});



		return input;
	}
	saveState(el) {
		console.log("Storing previous state.", el);
	}
	updateCheckerboard() {
		this.patternManager?.updateCheckerBoard()
		// Logic to update the checkerboard goes here
		console.log("Updating checkerboard based on new viewBox.");
		// You can add your checkerboard update logic here.
	}

	createAttributeDiv(key, value, element) {
		const newEl = create('div', { class: 'input-element' });
		const wrapper = create('div', { class: 'input-row' });
		const label = create('label', { textContent: key });

		if (key === 'fill' || key === 'stroke') {
			this.createColorInput(newEl, element, wrapper, label, key, value);
		} else {
			const input = this.createNumberOrTextInput(key, value, element);
			appendChildren(newEl, label, wrapper);
			wrapper.appendChild(input);
		}

		// Create delete button
		const deleteButton = this.createDeleteButton(() => {
			element.removeAttribute(key);
			newEl.remove();
		});

		wrapper.appendChild(deleteButton);
		return newEl;
	}

	createDeleteButton(callback) {
		const button = create('button', { class: 'delete-attribute'});
		button.addEventListener('click', callback);
		return button;
	}


	addNewAttributeInput(attributesContainer, element) {
		const newAttributeDiv = create('div');
		const label = create('label', { textContent: 'Add Attribute'} );
		const attributeSelect = create('select');
		const inputValue = create('input');
		const addButton = create('button', {class: 'add-btn'});

		// Get existing attributes from the element
		const elAttributes = Array.from(element.attributes).map(attr => attr.name);

		// Merge common and specific attributes, then filter out existing ones
		const tagName = element.tagName.toLowerCase();
		const allAttributes = [ ...svgAttributes.common, ...(svgAttributes[ tagName ] || []) ]
			.filter(attr => !elAttributes.includes(attr));

		// Append filtered attributes to the select dropdown
		allAttributes.forEach(attr => {
			const option = create('option', { value: attr, textContent: attr });
			attributeSelect.appendChild(option);
		});

		// Set up input and button functionality
		inputValue.placeholder = 'Attribute Value';
		addButton.textContent = '+';

		// Add new attribute to the element and the UI on button click
		addButton.addEventListener('click', () => {
			const key = attributeSelect.value;
			const value = inputValue.value.trim();

			if (key && value) {
				element.setAttribute(key, value);
				const attributeDiv = this.createAttributeDiv(key, value, element);
				attributesContainer.insertBefore(attributeDiv, newAttributeDiv);
				inputValue.value = '';
			}
		});
attributesContainer.appendChild(label)
		// Append the select, input, and button to the new attribute div
		appendChildren(newAttributeDiv, attributeSelect, inputValue, addButton);
		attributesContainer.appendChild(newAttributeDiv);
	}




	addToggleFunctionality(sectionDiv, attributesContainer) {
		const toggleArrow = sectionDiv.querySelector('span');

		toggleArrow.addEventListener('click', () => {

			const isHidden = attributesContainer.style.display === 'none';

			attributesContainer.style.display = isHidden ? 'block' : 'none';
			toggleArrow.textContent = isHidden ? '▼' : '▶';
		});
	}






	// 	// Undo the last action
		undo() {
			const lastState = this.historyManager.undo();
			if (lastState) {
				console.log(lastState)
				this.applyState(lastState);
			}
		}

		// Redo the last undone action
		redo() {
			const nextState = this.historyManager.redo();
			if (nextState) {
				console.log(nextState)
				this.applyState(nextState);
			}
		}

	// Apply the SVG state from undo/redo
	applyState(state) {
		const parser = new DOMParser();
		const newSvgElement = parser.parseFromString(state, 'image/svg+xml').documentElement;
		this.svgElementManager.editor.svgContainer.innerHTML = '';
		this.svgElementManager.editor.svgContainer.appendChild(newSvgElement);
	}
}

export default AttributeManager;
