'use strict';

const visit = require('vfile-visit');

module.exports = (file, fn = () => {}) => {
	return visit(file, (current, parent, index) => {
		if (current.path && parent.path) {
			current.dirname = parent.path;
		}

		fn(current, parent, index);
	});
};

module.exports.undo = file =>
	visit(file, current => {
		if (current.history.length > 1) {
			current.history.pop();
		}
	});
