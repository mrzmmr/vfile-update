'use strict';

/* Dependencies */
var clone = require('clone');
var vfile = require('vfile');

module.exports = update;
module.exports.undo = undo;
module.exports.update = update;

function update(file, options, callback) {
  var container = vfile({path: '.', contents: []});
  var queue = [clone(file), container];
  var i;

  if (typeof options === 'function' && !callback) {
    callback = options;
    options = {};
  } else {
    callback = function () {};
  }

  while (queue.length > 0) {
    var n = queue.shift();
    var p = queue.shift();

    if (!n.contents) {
      continue;
    }

    if (n !== file) {
      n.dirname = p.path;
    }

    if (p.contents.indexOf(n) < 0) {
      p.contents.push(n);
    }

    callback(n, p);

    if (Array.isArray(n.contents)) {
      for (i in n.contents) {
        if (n.contents[i].history.length > 0) {
          queue.push(n.contents[i], n);
        }
      }
    }
  }

  return container.contents[0];
}

function undo(file) {
  var container = vfile({path: '.', contents: []});
  var queue = [clone(file), container];
  var i;

  while (queue.length > 0) {
    var n = queue.shift();
    var p = queue.shift();

    if (n.history.length > 0) {
      n.history.pop();
    }

    if (!n.contents) {
      continue;
    }

    if (p.contents.indexOf(n) < 0) {
      p.contents.push(n);
    }

    if (Array.isArray(n.contents)) {
      for (i in n.contents) {
        if (n.contents[i].history.length > 0) {
          queue.push(n.contents[i], n);
        }
      }
    }
  }

  return container.contents[0];
}
