import * as assert from 'assert';
import { encode } from '../src';

describe('Encoding tests', () => {

	describe('Display name tests', () => {

		test('should encode display name', () => {
			const result = encode({ displayName: 'test-name_for_magnet-link.tar.gz' });
			assert.deepStrictEqual(result, 'magnet:?dn=test-name_for_magnet-link.tar.gz');
		});

	});

	describe('Length tests', () => {

		test('should encode length', () => {
			const result = encode({ length: 100500 });
			assert.deepStrictEqual(result, 'magnet:?xl=100500');
		});

	});

	describe('Info hash tests' , () => {

		test('should encode BitTorrent info hash with specified urn protocol ', () => {
			const result = encode({ infoHashes: [ 'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a' ] });
			assert.deepStrictEqual(result, 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
		});

		test('should encode BitTorrent info hash without specified urn protocol', () => {
			const result = encode({ infoHashes: [ 'c12fe1c06bba254a9dc9f519b335aa7c1367a88a' ] });
			assert.deepStrictEqual(result, 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
		});

		test('should encode BitTorrent info hash from buffer', () => {
			const result = encode({ infoHashes: [ Buffer.from('c12fe1c06bba254a9dc9f519b335aa7c1367a88a', 'hex') ] });
			assert.deepStrictEqual(result, 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
		});

	});

	describe('Web seed tests', () => {

		test('should encode web seed', () => {
			const result = encode({ webSeeds: [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ] });
			assert.deepStrictEqual(result, 'magnet:?ws=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz');
		});

	});

	describe('Acceptable source tests', () => {

		test('should encode acceptable source', () => {
			const result = encode({ acceptableSources: [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ] });
			assert.deepStrictEqual(result, 'magnet:?as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz');
		});

	});

	describe('Source tests', () => {

		test('should encode source', () => {
			const result = encode({ sources: [
				'http://cache.example.org/XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5',
				// 'dchub://example.org', // TODO: should it be encodeURIComponent() ?
			] });
			assert.deepStrictEqual(result, 'magnet:?xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5');
		});

	});

	describe('Keyword tests', () => {

		test('should encode keywords', () => {
			const result = encode({ keywords: [ 'martin', 'luther', 'king', 'mp3' ] });
			assert.deepStrictEqual(result, 'magnet:?kt=martin+luther+king+mp3');
		});

	});

	describe('Manifest tests', () => {

		test('should encode manifest', () => {
			const result = encode({ manifest: 'http://weblog.foo/all-my-favorites.rss' });
			assert.deepStrictEqual(result, 'magnet:?mt=http%3A%2F%2Fweblog.foo%2Fall-my-favorites.rss');
		});

	});

	describe('Tracker tests', () => {

		test('should encode trackers', () => {
			const result = encode({ trackers: [
				'http://tracker.example.org/announce.php?uk=1111111111&',
				'wss://tracker.webtorrent.io',
			] });
			assert.deepStrictEqual(result, 'magnet:?tr=http%3A%2F%2Ftracker.example.org%2Fannounce.php%3Fuk%3D1111111111%26&tr=wss%3A%2F%2Ftracker.webtorrent.io');
		});

	});

	test('example test', () => {
		const result = encode({
			displayName: 'test-name_for_magnet-link.tar.gz',
			length: 100500,
			infoHashes: [ 'c12fe1c06bba254a9dc9f519b335aa7c1367a88a' ],
			webSeeds: [ 'http://example.com/test-name_for_magnet-link.tar.gz' ],
			acceptableSources: [ 'http://example.com/test-name_for_magnet-link.tar.gz' ],
			sources: [ 'http://cache.example.com/c12fe1c06bba254a9dc9f519b335aa7c1367a88a' ],
			keywords: [ 'test-name_for_magnet-link', 'tar', 'gz' ],
			manifest: 'http://example.com/manifest',
			trackers: [
				'http://tracker.example.com/announce.php?ua=1111111111',
				'wss://tracker.webtorrent.io',
			],
		});
		assert.deepStrictEqual(result, 'magnet:?dn=test-name_for_magnet-link.tar.gz&xl=100500&xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&tr=http%3A%2F%2Ftracker.example.com%2Fannounce.php%3Fua%3D1111111111&tr=wss%3A%2F%2Ftracker.webtorrent.io&kt=test-name_for_magnet-link+tar+gz&ws=http%3A%2F%2Fexample.com%2Ftest-name_for_magnet-link.tar.gz&as=http%3A%2F%2Fexample.com%2Ftest-name_for_magnet-link.tar.gz&xs=http%3A%2F%2Fcache.example.com%2Fc12fe1c06bba254a9dc9f519b335aa7c1367a88a&mt=http%3A%2F%2Fexample.com%2Fmanifest');
	});

});
