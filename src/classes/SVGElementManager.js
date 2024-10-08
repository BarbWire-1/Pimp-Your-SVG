import TransformControl from "./TransformControl.js";



class SVGElementManager {
	constructor (editor) {
		this.editor = editor;
		this.activeEl = null;
		this.isRootSelected = false;
		this.control = new TransformControl(this.activeEl)
	}

	// get all ancestor <g> or <svg> elements
	getAncestorContainers(element) {
		let containers = [];
		let currentElement = element;

		// traverse up to allow control on inherited props
		while (currentElement) {
			let parent = currentElement.parentElement;

			if (parent && (parent.tagName === 'g' || parent.tagName === 'svg')) {
				containers.push(parent);
			}
			currentElement = parent;
		}

		return containers;
	}


	onSVGClick(e) {

		let target = e.target;
		this.editor.inputContainer.replaceChildren();
		this.setActiveElement(target);
		this.control.element = target;

		const activeElementSettings = this.getSettings(target);
		const ancestors = this.getAncestorContainers(target);

		const manager = this.editor.attributeManager
		// populate inputs for clicked element
		manager.appendComponents(activeElementSettings, false, target);


		ancestors.forEach(ancestor => {
			const ancestorSettings = this.getSettings(ancestor);
			manager.appendComponents(ancestorSettings, true, ancestor);
		});
	}


	// set active SVG element - data-active
	setActiveElement(el) {

		// reset previous
		if (this.activeEl) {
			this.activeEl.removeAttribute('data-active');
			if (this.highlightBox) {
				this.highlightBox.remove();
				this.highlightBox = null;
			}
		}
		// set new
		this.activeEl = el;
		this.activeEl.setAttribute('data-active', 'true');

	}


	getSettings(el) {
		let obj = {};
		let keys = el.getAttributeNames();

		keys.forEach(key => {
			if (key === 'style') {
				// if the key is 'style', parse it into props
				const styles = el.getAttribute('style');
				const styleObj = this.parseStyleAttribute(styles);
				Object.assign(obj, styleObj); // merge style and individual props
			} else {
				obj[ key ] = el.getAttribute(key);
			}
		});

		return obj;
	}


	applyStyles(styles, propagate = false) {
		// Apply the styles to the active element
		Object.keys(styles).forEach(style => {

			if (style === 'fill' || style === 'stroke') {

				this.activeEl.setAttribute(style, styles[ style ]);
			} else {

				this.activeEl.style[ style ] = styles[ style ];
			}
		});

		// TODO not sure whether this is necessary or done automatically(??)
		if (propagate && this.activeEl.children.length > 0) {

			Array.from(this.activeEl.children).forEach(child => {

				Object.keys(styles).forEach(style => {
					if (style === 'fill' || style === 'stroke') {
						child.setAttribute(style, styles[ style ]);
					} else {
						child.style[ style ] = styles[ style ];
					}
				});
			});
		}
	}


	parseStyleAttribute(styleString) {
		let styleObj = {};
		const styles = styleString.split(';');

		styles.forEach(style => {

			if (style.trim()) {

				const [ key, value ] = style.split(':').map(s => s.trim());
				if (key && value) {
					styleObj[ key ] = value;
				}
			}
		});

		return styleObj; // the parsed styles as an object
	}


}

export default SVGElementManager;