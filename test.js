'use strict';

const {test} = require('tap');
const clone = require('clone');
const vfile = require('vfile');
const update = require('.');

const file = vfile({
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

test('cloned copy !== file', t => {
	const copy = clone(file);
	t.ok(copy !== file);
	t.end();
});

test('undo - file', t => {
	const copy = clone(file);
	const updated = update(copy);
	t.deepEqual(file, update.undo(updated));
	t.end();
});

test('update - file', t => {
	const copy = clone(file);
	copy.contents[0].path = 'foo/bar';
	copy.contents[1].path = 'foo/foo.txt';
	copy.contents[0].contents[0].path = 'foo/bar/bar.txt';
	t.deepEqual(copy, update(file));
	t.end();
});

test('undo - if theres no contents then skip', t => {
	const copy = clone(file);
	delete copy.contents[0].contents;
	t.ok(update.undo(copy));
	t.end();
});

test('update - if theres no contents then skip', t => {
	const copy = clone(file);
	delete copy.contents[0].contents;
	t.ok(update(copy));
	t.end();
});

test('update - if history.length === 0, then skip', t => {
	const copy = clone(file);
	copy.contents[0].history = [];
	t.ok(update(copy));
	t.end();
});

test('undo - if history.length === 0, then skip', t => {
	const copy = clone(file);
	copy.contents[0].history = [];
	t.ok(update.undo(copy));
	t.end();
});

test('update - callback', t => {
	const foo = vfile({path: 'foo'});
	update(foo, current => {
		current.path = 'bar';
		t.notSame(current, foo);
	});
	t.end();
});
