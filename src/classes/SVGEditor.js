import SVGElementManager from "./SVGElementManager.js";
import FileHandler from "./FileHandler.js";
import Downloader from "./Downloader.js";
import PatternManager from "./PatternMaker.js";
import AttributeManager from "./AttributeManager.js";

class SVGEditor {
	constructor (svgContainer, inputContainer) {
		this.svgContainer = svgContainer;
		this.inputContainer = inputContainer;
		this.svgElementManager = new SVGElementManager(this);
		this.fileHandler = new FileHandler(this);
		this.downloader = new Downloader(this);
		this.patternManager = new PatternManager(this.svgContainer) || null;
		this.attributeManager = new AttributeManager(this.inputContainer, this.svgElementManager);

		this.initEventListeners();
	}

	// Initialize event listeners for SVG interactions
	initEventListeners() {
		this.svgContainer.addEventListener('click', (e) => this.svgElementManager.onSVGClick(e));
		document.getElementById('file-input').addEventListener('change', (e) => this.fileHandler.onFileUpload(e));
		document.getElementById('download-btn').addEventListener('click', () => this.downloader.downloadSVG());
	}
}

export default SVGEditor;
