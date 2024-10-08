class HistoryManager {
	constructor (limit = 20) {
		this.undoStack = JSON.parse(localStorage.getItem('undoStack')) || [];
		this.redoStack = [];
		this.limit = limit;
		this.counter = 0
	}

	// Save a new state to the undo stack
	saveState(state) {
		console.log("state", this.counter++)
		// Add the current state to the undo stack and clear the redo stack
		this.undoStack.push(state);
		this.redoStack = [];

		// If the undo stack exceeds the limit, remove the oldest state
		if (this.undoStack.length > this.limit) {
			this.undoStack.shift();
		}

		// Save the updated undo stack to localStorage
		this.updateLocalStorage();
	}

	// Undo the last action
	undo() {
		if (this.undoStack.length > 0) {
			const lastState = this.undoStack.pop();
			this.redoStack.push(lastState);
			this.updateLocalStorage();
			return lastState; // Return the last state to apply it
		}
		return null; // No more undo actions available
	}

	// Redo the last undone action
	redo() {
		if (this.redoStack.length > 0) {
			const nextState = this.redoStack.pop();
			this.undoStack.push(nextState);
			this.updateLocalStorage();
			return nextState; // Return the next state to apply it
		}
		return null; // No more redo actions available
	}

	// Update the localStorage with the current undo stack
	updateLocalStorage() {
		localStorage.setItem('undoStack', JSON.stringify(this.undoStack));
	}
}

export default HistoryManager;
