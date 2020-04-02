import * as assert from 'assert';
import { decode } from '../lib';

// DISPLAY_NAME = 'dn',
// LENGTH = 'xl',
// INFO_HASH = 'xt',
// WEB_SEED = 'ws',
// ACCEPTABLE_SOURCE = 'as',
// SOURCE = 'xs',
// KEYWORD = 'kt',
// MANIFEST = 'mt',
// TRACKER = 'tr',


describe('Decoding tests', () => {

	// const testLink = 'magnet:?
	// xt=urn:ed2k:354B15E68FB8F36D7CD88FF94116CDC1
	// &xl=10826029
	// &dn=mediawiki-1.15.1.tar.gz
	// &xt=urn:tree:tiger:7N5OAMRNGMSSEUE3ORHOKWN4WWIQ5X4EBOOTLJY
	// &xt=urn:sha1:XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5
	// &xt=urn:aich:7ZDRR3ZQW4JMHUQZUMJGQN2VNGLV3CVN
	// &xt=urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q
	// &tr=http%3A%2F%2Ftracker.example.org%2Fannounce.php%3Fuk%3D1111111111%26
	// &tr=wss%3A%2F%2Ftracker.webtorrent.io
	// &as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz
	// &ws=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz
	// &xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5
	// &xs=dchub://example.org';

	describe('Validation tests', () => {

		test('should return empty object on empty string', () => {
			assert.deepStrictEqual(decode(''), {});
		});

		test('should return empty object if magnet identifier is invalid', () => {
			assert.deepStrictEqual(decode('asd'), {});
			assert.deepStrictEqual(decode('magn'), {});
			assert.deepStrictEqual(decode('magnet'), {});
			assert.deepStrictEqual(decode('magnet:'), {});
		});

		test('should return empty object if magnet link without parameters', () => {
			assert.deepStrictEqual(decode('magnet:?'), {});
		});

		test('should ignore invalid parameters', () => {
			assert.deepStrictEqual(decode('magnet:?bar=baz&cow=moo'), {});
		});

	});

	describe('Display name tests', () => {

		test('should decode display name', () => {
			const result = decode('magnet:?dn=test-name_for_magnet-link.tar.gz');
			assert.deepStrictEqual(result, { displayNames: [ 'test-name_for_magnet-link.tar.gz' ] });
		});

	});

	describe('Length tests', () => {

		test('should decode length', () => {
			const result = decode('magnet:?xl=100500');
			assert.deepStrictEqual(result, { length: 100500 });
		});

	});

	describe('Info hash tests' , () => {

		test('should ignore topics without urn', () => {
			const result = decode('magnet:?xt=btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
			assert.deepStrictEqual(result, { infoHashes: [] });
		});

		test('should ignore not urn topics', () => {
			const result = decode('magnet:?xt=http:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
			assert.deepStrictEqual(result, { infoHashes: [] });
		});

		test('should ignore not btih topics', () => {
			const result = decode('magnet:?xt=urn:sha1:XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5');
			assert.deepStrictEqual(result, { infoHashes: [] });
		});

		test('should decode BitTorrent info hash', () => {
			const result = decode('magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
			assert.deepStrictEqual(result, { infoHashes: [ 'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a' ] });
		});

		test('should decode Base32 BitTorrent info hash', () => {
			const result = decode('magnet:?xt=urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q');
			assert.deepStrictEqual(result, { infoHashes: [ 'urn:btih:81e177e2cc00943b29fcfc635457f575237293b0' ] });
		});

	});

	describe('Web seed tests', () => {

		test('should decode web seed', () => {
			const result = decode('magnet:?ws=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz');
			assert.deepStrictEqual(result, { webSeeds: [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ] });
		});

	});

	describe('Acceptable source tests', () => {

		test('should decode acceptable source', () => {
			const result = decode('magnet:?as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz');
			assert.deepStrictEqual(result, { acceptableSources: [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ] });
		});

	});

	describe('Source tests', () => {

		test('should decode source', () => {
			const testLink = 'magnet:?'
				+ 'xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5'
				+ '&xs=dchub://example.org';

			const result = decode(testLink);
			assert.deepStrictEqual(result, { sources: [
				'http://cache.example.org/XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5',
				'dchub://example.org',
			] });
		});

	});

	describe('Keyword tests', () => {

		test('should decode keywords', () => {
			const result = decode('magnet:?kt=martin+luther+king+mp3');
			assert.deepStrictEqual(result, { keywords: [ 'martin', 'luther', 'king', 'mp3' ] });
		});

	});

	describe('Manifest tests', () => {

		test('should decode manifest', () => {
			const result = decode('magnet:?mt=http://weblog.foo/all-my-favorites.rss');
			assert.deepStrictEqual(result, { manifest: 'http://weblog.foo/all-my-favorites.rss' });
		});

	});

	describe('Tracker tests', () => {

		test('should decode trackers', () => {
			const testLink = 'magnet:?'
				+ 'tr=http%3A%2F%2Ftracker.example.org%2Fannounce.php%3Fuk%3D1111111111%26'
				+ '&tr=wss%3A%2F%2Ftracker.webtorrent.io';

			const result = decode(testLink);
			assert.deepStrictEqual(result, { trackers: [
					'http://tracker.example.org/announce.php?uk=1111111111&',
					'wss://tracker.webtorrent.io',
			] });
		});

	});

});
