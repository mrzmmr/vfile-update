'use strict';

const visit = require('vfile-visit');

const update = file => {
	return visit(file, (current, index, parent) => {
		if (current.path && parent.path) {
			current.dirname = parent.path;
		}
	});
};

const undo = file => {
	return visit(file, current => {
		if (current.history.length > 1) {
			current.history.pop();
		}
	});
};

module.exports = update;
module.exports.undo = undo;
