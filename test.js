'use strict';

/* Dependencies */
var tape = require('tape');
var clone = require('clone');
var vfile = require('vfile');
var update = require('./');

var file = vfile({
  path: 'foo',
  contents: [
    vfile({
      path: 'bar',
      contents: [
        vfile({
          path: 'bar.txt',
          contents: 'Bar'
        })
      ]
    }),
    vfile({
      path: 'foo.txt',
      contents: 'Foo'
    })
  ]
});

tape('cloned copy !== file', function (t) {
  var copy = clone(file);
  t.ok(copy !== file);
  t.end();
});

tape('undo - file', function (t) {
  var copy = clone(file);
  var updated = update(copy);
  t.deepEqual(file, update.undo(updated));
  t.end();
});

tape('update - file', function (t) {
  var copy = clone(file);
  copy.contents[0].path = 'foo/bar';
  copy.contents[1].path = 'foo/foo.txt';
  copy.contents[0].contents[0].path = 'foo/bar/bar.txt';
  t.deepEqual(copy, update(file));
  t.end();
});

tape('undo - if theres no contents then skip', function (t) {
  var copy = clone(file);
  delete copy.contents[0].contents;
  t.ok(update.undo(copy));
  t.end();
});

tape('update - if theres no contents then skip', function (t) {
  var copy = clone(file);
  delete copy.contents[0].contents;
  t.ok(update(copy));
  t.end();
});

tape('update - if history.length === 0, then skip', function (t) {
  var copy = clone(file);
  copy.contents[0].history = [];
  t.ok(update(copy));
  t.end();
});

tape('undo - if history.length === 0, then skip', function (t) {
  var copy = clone(file);
  copy.contents[0].history = [];
  t.ok(update.undo(copy));
  t.end();
});

tape('update - callback', function (t) {
  var foo = vfile({path: 'foo'})
  var bar = update(foo, function (current) {
    current.path = 'bar'
    t.notSame(current, foo)
  })
  t.end()
})

// tape('update - callback', function (t) {
//   var copy = clone(file);
//   update(copy, function (node, parent) {
//     t.ok(node !== copy);
//     if (parent && parent.contents) {
//       t.ok(parent.contents.indexOf(node) > -1);
//     }
//   });
//   t.end();
// });
