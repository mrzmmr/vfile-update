'use strict';

const visit = require('vfile-visit');

module.exports = update;
module.exports.undo = undo;

function update(file, callback) {
	if (typeof callback !== 'function') {
		callback = function () {};
	}

	return visit(file, (current, parent, index) => {
		if (current.path && parent.path) {
			current.dirname = parent.path;
		}

		callback(current, parent, index);
	});
}

function undo(file) {
	return visit(file, current => {
		if (current.history.length > 1) {
			current.history.pop();
		}
	});
}
