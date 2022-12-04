import * as assert from 'assert';
import { decode } from '../src';

describe('Decoding tests', () => {

	describe('Validation tests', () => {

		const defaultMagnetUriObject = {
			displayName: null,
			length: null,
			infoHashes: [],
			webSeeds: [],
			acceptableSources: [],
			sources: [],
			keywords: [],
			manifest: null,
			trackers: [],
		};

		test('should return default object on empty string', () => {
			assert.deepStrictEqual(decode(''), defaultMagnetUriObject);
		});

		test('should return empty object if magnet identifier is invalid', () => {
			assert.deepStrictEqual(decode('asd'), defaultMagnetUriObject);
			assert.deepStrictEqual(decode('magn'), defaultMagnetUriObject);
			assert.deepStrictEqual(decode('magnet'), defaultMagnetUriObject);
			assert.deepStrictEqual(decode('magnet:'), defaultMagnetUriObject);
		});

		test('should return empty object if magnet link without parameters', () => {
			assert.deepStrictEqual(decode('magnet:?'), defaultMagnetUriObject);
		});

		test('should ignore invalid parameters', () => {
			assert.deepStrictEqual(decode('magnet:?bar=baz&cow=moo'), defaultMagnetUriObject);
		});

	});

	describe('Display name tests', () => {

		test('should decode display name', () => {
			const result = decode(`magnet:?dn=${encodeURIComponent('test-name_for_magnet-link.tar.gz')}`);
			assert.deepStrictEqual(result.displayName, 'test-name_for_magnet-link.tar.gz');
		});

	});

	describe('Length tests', () => {

		test('should decode length', () => {
			const result = decode('magnet:?xl=100500');
			assert.deepStrictEqual(result.length, 100500);
		});

	});

	describe('Info hash tests' , () => {

		test('should ignore topics without urn', () => {
			const result = decode('magnet:?xt=btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
			assert.deepStrictEqual(result.infoHashes, []);
		});

		test('should ignore not urn topics', () => {
			const result = decode('magnet:?xt=http:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
			assert.deepStrictEqual(result.infoHashes, []);
		});

		test('should ignore not btih topics', () => {
			const result = decode('magnet:?xt=urn:sha1:XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5');
			assert.deepStrictEqual(result.infoHashes, []);
		});

		test('should decode BitTorrent info hash', () => {
			const result = decode('magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
			assert.deepStrictEqual(result.infoHashes, [ 'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a' ]);
		});

		test('should decode Base32 BitTorrent info hash', () => {
			const result = decode('magnet:?xt=urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q');
			assert.deepStrictEqual(result.infoHashes, [ 'urn:btih:81e177e2cc00943b29fcfc635457f575237293b0' ]);
		});

	});

	describe('Web seed tests', () => {

		test('should decode web seed', () => {
			const result = decode('magnet:?ws=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz');
			assert.deepStrictEqual(result.webSeeds, [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ]);
		});

	});

	describe('Acceptable source tests', () => {

		test('should decode acceptable source', () => {
			const result = decode('magnet:?as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz');
			assert.deepStrictEqual(result.acceptableSources, [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ]);
		});

	});

	describe('Source tests', () => {

		test('should decode source', () => {
			const testLink = 'magnet:?'
				+ 'xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5'
				+ '&xs=dchub://example.org';

			const result = decode(testLink);
			assert.deepStrictEqual(result.sources, [
				'http://cache.example.org/XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5',
				'dchub://example.org',
			]);
		});

	});

	describe('Keyword tests', () => {

		test('should decode keywords', () => {
			const result = decode('magnet:?kt=martin+luther+king+mp3');
			assert.deepStrictEqual(result.keywords, [ 'martin', 'luther', 'king', 'mp3' ]);
		});

	});

	describe('Manifest tests', () => {

		test('should decode manifest', () => {
			const result = decode('magnet:?mt=http://weblog.foo/all-my-favorites.rss');
			assert.deepStrictEqual(result.manifest, 'http://weblog.foo/all-my-favorites.rss');
		});

	});

	describe('Tracker tests', () => {

		test('should decode trackers', () => {
			const testLink = 'magnet:?'
				+ 'tr=http%3A%2F%2Ftracker.example.org%2Fannounce.php%3Fuk%3D1111111111%26'
				+ '&tr=wss%3A%2F%2Ftracker.webtorrent.io';

			const result = decode(testLink);
			assert.deepStrictEqual(result.trackers, [
					'http://tracker.example.org/announce.php?uk=1111111111&',
					'wss://tracker.webtorrent.io',
			]);
		});

	});

	test('example test', () => {
		const result = decode('magnet:?dn=test-name_for_magnet-link.tar.gz&xl=100500&xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&tr=http%3A%2F%2Ftracker.example.org%2Fannounce.php%3Fua%3D1111111111&tr=wss%3A%2F%2Ftracker.webtorrent.io&kt=martin+luther+king+mp3&ws=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5&mt=http%3A%2F%2Fweblog.foo%2Fall-my-favorites.rss');
		assert.deepStrictEqual(result, {
			displayName: 'test-name_for_magnet-link.tar.gz',
			length: 100500,
			infoHashes: [ 'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a' ],
			webSeeds: [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ],
			acceptableSources: [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ],
			sources: [ 'http://cache.example.org/XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5' ],
			keywords: [ 'martin', 'luther', 'king', 'mp3' ],
			manifest: 'http://weblog.foo/all-my-favorites.rss',
			trackers: [
				'http://tracker.example.org/announce.php?ua=1111111111',
				'wss://tracker.webtorrent.io',
			],
		});
	});

	// test('t', () => {
	// 	const result = decode('magnet:?xt=urn:ed2k:354B15E68FB8F36D7CD88FF94116CDC1&xt=urn:tree:tiger:7N5OAMRNGMSSEUE3ORHOKWN4WWIQ5X4EBOOTLJY&xt=urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q&xl=10826029&dn=mediawiki-1.15.1.tar.gz&tr=udp%3A%2F%2Ftracker.example4.com%3A80%2Fannounce&as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5&xs=dchub://example.org');
	// 	console.log(result);
	// });

});
