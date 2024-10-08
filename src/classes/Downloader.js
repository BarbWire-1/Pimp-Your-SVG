class Downloader {
	constructor (editor) {
		this.editor = editor;
	}

	// Function to download the current SVG
	downloadSVG() {
		// Remove checkerboard and bounding box before downloading
		this.removeCheckerboardAndBoundingBox();

		const svg = this.editor.svgContainer.querySelector('svg');
		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(svg);
		const blob = new Blob([ svgString ], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'download.svg';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		// TODO this logic is wrong! It should always be there just not visible
		// Restore the checkerboard pattern after download if it was visible
		if (this.editor.patternManager.isCheckerboardVisible) {
			this.editor.patternManager.addCheckerboardPattern(svg);
		}

	}

	// remove visual helpers
	removeCheckerboardAndBoundingBox() {


		const frame = document.querySelector('.highlight-box');
		if (frame) {
			frame.remove();
		}

		// Remove checkerboard rectangle if it exists
		const existingRect = document.querySelector('.checkerboard-rect');
		if (existingRect) {
			existingRect.remove();
		}
	}
}
export default Downloader;