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

test('vfile-update', t => {
	t.deepEqual(
		update.undo(update(file)),
		file,
		'should undo updating files history.'
	);

	t.doesNotThrow(() => {
		const copy = clone(file);
		delete copy.contents[0].contents;
		t.ok(
			update.undo(copy),
			'should skip file if there is no contents.'
		);
	});

	t.doesNotThrow(() => {
		const copy = clone(file);
		delete copy.contents[0].contents;
		t.ok(
			update.undo(copy),
			'should skip undo if there is no contents.'
		);
	});

	t.equal(
		update(file).contents[0].path,
		'foo/bar',
		'should update correctly (contents[0]).'
	);
	t.equal(
		update(file).contents[1].path,
		'foo/foo.txt',
		'should update correctly (contents[1]).'
	);

	t.equal(
		update(file).contents[0].contents[0].path,
		'foo/bar/bar.txt',
		'should update correctly (nested).'
	);

	t.doesNotThrow(() => {
		const copy = clone(file);
		copy.contents[0].history = [];
		t.ok(
			update.undo(copy),
			'should skip if history length is 0.'
		);
	});

	t.doesNotThrow(() => {
		const copy = clone(file);
		copy.contents[0].history = [];
		t.ok(
			update.undo(copy),
			'skip undo if history length is 0.'
		);
	});

	t.doesNotThrow(() => {
		const foo = vfile({path: 'foo'});
		update(foo, current => {
			current.path = 'bar';

			t.notSame(
				current,
				foo,
				'should call callback..'
			);
		});
	});

	t.end();
});

