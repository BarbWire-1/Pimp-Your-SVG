// shortHands.js
// src/scripts/fromScratch/shortHands.js

// src/scripts/fromScratch/shortHands.js

function create(tagName, options = {}) {
	const element = document.createElement(tagName);

	if (options.innerHTML) {
		element.innerHTML = options.innerHTML;
	}
	if (options.textContent) {
		element.textContent = options.textContent;
	}
	if (options) {
		Object.keys(options).forEach(attr => {
			element.setAttribute(attr, options[ attr ]);
		});
	}



	return element;
}

function appendTo(parent, child) {
	if (parent && child) {
		parent.appendChild(child);
	} else {
		console.error(`AppendTo failed: ${parent} or ${child }is undefined or null`, { parent, child });
	}
}

function select(selector) {
	const element = document.querySelector(selector);
	if (!element) {
		console.error(`Select failed: No element found for selector "${selector}"`);
	}
	return element;
}

function selectAll(selector) {
	const elements = document.querySelectorAll(selector);
	if (!elements.length) {
		console.error(`SelectAll failed: No elements found for selector "${selector}"`);
	}
	return elements;
}

function listenFor(element, event, handler) {
	if (element && typeof handler === 'function') {
		element.addEventListener(event, handler);
	} else {
		console.error('ListenFor failed: Element or handler is invalid', { element, event, handler });
	}
}

function appendChildren(parent, ...children){
		children.forEach(child => parent.appendChild(child));
	};

const getById = (id) => document.getElementById(id);

export {create, appendTo, appendChildren, select, selectAll, listenFor, getById}