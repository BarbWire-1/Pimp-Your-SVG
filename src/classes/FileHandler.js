class FileHandler {
	constructor (editor) {
		this.editor = editor;
		this.replaceMode = true;
	}

	// replace or nest new svg
	toggleReplaceMode(value) {
		this.replaceMode = value;
	}

	// Handle SVG file upload
	onFileUpload(event) {
		const file = event.target.files[ 0 ];
		const reader = new FileReader();

		reader.onload = (e) => {
			const svgContent = e.target.result;
			const parser = new DOMParser();
			const newSvgElement = parser.parseFromString(svgContent, 'image/svg+xml').documentElement;
newSvgElement.setAttribute('pointer-events', 'all')
			if (!newSvgElement.id) {
				newSvgElement.id = 'uploaded-svg'; // Assign a unique ID if none exists
			}

			const existingSvg = this.editor.svgContainer.querySelector('svg');

			if (this.replaceMode) {
				// Replace: Remove current SVG content and load the new one
				this.editor.svgContainer.innerHTML = ''; // Clear the SVG container
				this.editor.svgContainer.appendChild(newSvgElement); // Add new SVG element
				this.editor.patternManager.createCheckerBoardPattern(newSvgElement);
				this.editor.patternManager.addCheckerboardPattern(newSvgElement);
			} else {
				// Nest: Append the loaded SVG content into the existing <svg> element
				if (existingSvg) {
					existingSvg.appendChild(newSvgElement);
				} else {
					// If no existing SVG, just append the new one
					this.editor.svgContainer.appendChild(newSvgElement);
				}
			}

			// // Add the checkerboard pattern to the new or existing SVG
			// this.editor.patternManager.addCheckerboardPattern(existingSvg || newSvgElement);
			// Show the attributes of the root <svg> (new or existing)
			this.editor.attributeManager.appendComponents(existingSvg || newSvgElement);
		};

		reader.readAsText(file);
	}
}

export default FileHandler;
