// TODO style!!
// TODO finegrain opacity
// TODO add some filters?


// TODO checkerboard only added every second load
// TODO checkboard and highlightBox need to be UPDATED on changes
// TODO control controlPanel!! append to inputContainer


// TODO MENU
// TODO 10 back/for states???

//TODO parents need two clicks to open WTF(???)

// TODO exclude checker and div from transformControl (pointer-events?)


// TODO add rearrange layers


// TODO ZOOM
// TODO navigation-controls

// TODO apply origin on select!!! IF NONE APPLY top-left

// TODO convert points back into transform-select string????


import SVGEditor from "./src/classes/SVGEditor.js";
import TransformControl from "./src/classes/TransformControl.js";


const container = document.getElementById('input-container');
container.innerText = "Click an element in your svg to open the settings panel."
const svgContainer = document.getElementById('svg-container');


// Instantiate the editor
const editor = new SVGEditor(svgContainer, container);

// TODO change this to either load or insert svg (2 buttons - or better MENU)
document.getElementById('replace-toggle').addEventListener('change', (e) => {
    const replaceMode = e.target.checked;
    editor.fileHandler.toggleReplaceMode(replaceMode);
});
document.getElementById('checkerboard-toggle').addEventListener('change', function (e) {
    const svg = document.querySelector('svg');
    editor.patternManager.toggleCheckerboardVisibility(svg);
});
// document.getElementById('undoBtn').addEventListener('click', () => {
//     editor.attributeManager.undo();
// });
//
// document.getElementById('redoBtn').addEventListener('click', () => {
//     editor.attributeManager.redo();
// });

let test = new TransformControl().controlPanel
//container.appendChild(test)