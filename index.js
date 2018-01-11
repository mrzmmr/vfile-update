'use strict';

/* Dependencies */
var assert = require('assert');
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

    if (!n || !n.contents || !n.path) {
      continue;
    }

    /* If n !deepStrictEqual file then update dirname. */
    try {
      assert.deepStrictEqual(n, file);
    } catch (err) {
      n.dirname = p.path;
    }

    if (p.contents.indexOf(n) < 0) {
      p.contents.push(n);
    }

    callback(n, p);

    if (Array.isArray(n.contents)) {
      i = -1;
      while (i++ < n.contents.length - 1) {
        queue.push(n.contents[i], n);
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

    if (!n || !n.contents || !n.history) {
      continue;
    }

    if (n.history.length > 1) {
      n.history.pop();
    }

    if (p.contents.indexOf(n) < 0) {
      p.contents.push(n);
    }

    if (Array.isArray(n.contents)) {
      i = -1;
      while (i++ < n.contents.length - 1) {
        queue.push(n.contents[i], n);
      }
    }
  }

  return container.contents[0];
}
