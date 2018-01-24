# vfile-update

> Update paths on nested [vfiles](https://github.com/vfile/vfile)

[![Travis](https://img.shields.io/travis/mrzmmr/vfile-update.svg)](https://travis-ci.org/mrzmmr/vfile-update)
[![Coveralls github](https://img.shields.io/coveralls/github/mrzmmr/vfile-update.svg)](https://coveralls.io/github/mrzmmr/vfile-update)
[![David](https://img.shields.io/david/mrzmmr/vfile-update.svg)](https://david-dm.org/mrzmmr/vfile-update)


Update nested [vfile](https://github.com/vfile/vfile) paths in a given vfile's contents. Both update and update.undo return modified copies of the vfile passed to them and don't affect the original. 

## install

```sh
npm i vfile-update
```

## usage

```js
var vfile = require('vfile')
var update = require('vfile-update')

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
    })
  ]
})

var updated = update(file)
console.log(updated.contents[0].contents[0].history)
// ['bar.txt', 'foo/bar/bar.txt']

var undone = update.undo(updated)
console.log(undone.contents[0].contents[0].history
// ['bar.txt']
```

## api

### `update (file[, callback])`
Creates a copy of file and updates paths on its contents. returns the updated copy of file.

returns `VFile`

#### `file`
`VFile`
VFile to work on

#### `callback?`
`function`
Optional callback will be called on each sub vfile.

### `update#undo (file)`
Creates a copy of file and undoes update on sub vfile's history. 

returns `VFile`

#### `file`
`VFile`

## License

MIT &copy; Paul Zimmer
