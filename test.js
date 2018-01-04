'use strict';

/* Dependencies */
var tape = require('tape');
var clone = require('vfile');
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

tape('vfile-undo', function (t) {
  var test = update(file);
  var test2 = update(file);
  test.path = 'baz';
  test = update(test);
  t.notDeepEqual(test, test2);

  test = update.undo(test);
  t.deepEqual(test, test2);

  test.path = 'baz';
  test = update(test);
  delete test.contents[0].contents;

  t.ok(update.undo(test));

  t.end();
});

tape('vfile-update', function (t) {
  t.doesNotThrow(function () {
    t.test('callback with node and parent', function (t) {
      var test = update(file, function (node, parent) {
        t.ok(parent);
        t.ok(node);
        t.ok(parent.contents.indexOf(node) > -1);
      });
      t.ok(test);
      t.end();
    });

    t.test('returns an updated copy of file', function (t) {
      var test = update(file);
      t.ok(test);
      t.notDeepEqual(test, file);
      t.end();
    });

    t.test('skips nodes with no path', function (t) {
      var test = clone(file);
      delete test.contents[0].contents[0].contents;
      t.ok(update(test));
      t.end();
    });

    t.test('changing path after update', function (t) {
      var test = update(file);
      test.path = 'baz/foo';
      test = update(test);
      t.deepEqual(test, update(test));
      t.end();
    });
  });
  t.end();
});

