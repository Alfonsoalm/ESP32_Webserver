'use strict';
const os = require('os');
const path = require('path');
const binBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

const cpuNumber = os.cpus().length;

const args = [
	'-copy',
	'none',
	'-optimize',
	'-outfile',
	path.join(__dirname, '../test/fixtures/test-optimized.jpg'),
	path.join(__dirname, '../test/fixtures/test.jpg')
];

bin.run(args).then(() => {
	log.success('jpegtran pre-build test passed successfully');
}).catch(async error => {
	log.warn(error.message);
	log.warn('jpegtran pre-build test failed');
	log.info('compiling from source');

	const cfg = [
		'cmake -G"Unix Makefiles"',
		`-DENABLE_SHARED=0 -DCMAKE_INSTALL_PREFIX="${bin.dest()}" -DCMAKE_INSTALL_BINDIR="${bin.dest()}"`,
		'.'
	].join(' ');

	try {
		await binBuild.file(path.resolve(__dirname, '../vendor/source/libjpeg-turbo-2.0.5.tar.gz'), [
			cfg,
			`make -j${cpuNumber}`,
			'make install'
		]);

		log.success('jpegtran built successfully');
	} catch (error) {
		log.error(error.stack);

		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
});
