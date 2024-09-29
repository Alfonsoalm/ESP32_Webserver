# optipng-changba [![Build Status](https://travis-ci.org/ChangbaFE/optipng-bin.svg?branch=master)](https://travis-ci.org/ChangbaFE/optipng-bin)

> [OptiPNG](http://optipng.sourceforge.net) is a PNG optimizer that recompresses image files to a smaller size, without losing any information

You probably want [`imagemin-optipng`](https://github.com/imagemin/imagemin-optipng) instead.


## Install

```
$ npm install --save optipng-changba
```


## Usage

```js
const {promisify} = require('util');
const {execFile} = require('child_process');
const optipng = require('optipng-changba');

const execFileP = promsify(execFile);

(async () => {
	await execFile(optipng, ['-out', 'output.png', 'input.png']);
	console.log('Image minified!');
})();
```


## CLI

```
$ npm install --global optipng-changba
```

```
$ optipng --help
```
