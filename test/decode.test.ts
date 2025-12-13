import * as assert from 'assert';
import { decode } from '../src';

describe('Decoding tests', () => {

	describe('Validation tests', () => {

		const defaultMagnetUriObject = {
			displayName: null,
			length: null,
			infoHashes: [],
			infoHashData: [],
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

		test('should handle non-numeric length', () => {
			const result = decode('magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&xl=abc');
			assert.strictEqual(result.length, null);
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

		test('should ignore unsupported hash types', () => {
			const result = decode('magnet:?xt=urn:tree:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
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

		test('should handle urn:btih with invalid hash length', () => {
			const result = decode('magnet:?xt=urn:btih:tooshort');
			assert.deepStrictEqual(result.infoHashes, []);
		});

		test('should handle urn:btih with invalid hex characters', () => {
			const result = decode('magnet:?xt=urn:btih:zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
			assert.deepStrictEqual(result.infoHashes, []);
		});

		test('should handle urn without hash value', () => {
			const result = decode('magnet:?xt=urn:btih:');
			assert.deepStrictEqual(result.infoHashes, []);
		});

	});

	describe('SHA1 info hash tests', () => {

		test('should decode sha1 hex hash', () => {
			const result = decode('magnet:?xt=urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709');
			assert.deepStrictEqual(result.infoHashes, [ 'urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709' ]);
		});

		test('should decode sha1 base32 hash', () => {
			const result = decode('magnet:?xt=urn:sha1:XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5');
			assert.deepStrictEqual(result.infoHashes, [ 'urn:sha1:bc6fa790b7738892c6b415fc76658a976763715d' ]);
		});

		test('should handle sha1 with invalid hash length', () => {
			const result = decode('magnet:?xt=urn:sha1:tooshort');
			assert.deepStrictEqual(result.infoHashes, []);
		});

	});

	describe('MD5 info hash tests', () => {

		test('should decode md5 hex hash', () => {
			const result = decode('magnet:?xt=urn:md5:d41d8cd98f00b204e9800998ecf8427e');
			assert.deepStrictEqual(result.infoHashes, [ 'urn:md5:d41d8cd98f00b204e9800998ecf8427e' ]);
		});

		test('should handle md5 with invalid hash length (40 chars)', () => {
			const result = decode('magnet:?xt=urn:md5:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
			assert.deepStrictEqual(result.infoHashes, []);
		});

		test('should handle md5 with invalid hash length (too short)', () => {
			const result = decode('magnet:?xt=urn:md5:tooshort');
			assert.deepStrictEqual(result.infoHashes, []);
		});

	});

	describe('ED2K info hash tests', () => {

		test('should decode ed2k hex hash', () => {
			const result = decode('magnet:?xt=urn:ed2k:31d6cfe0d16ae931b73c59d7e0c089c0');
			assert.deepStrictEqual(result.infoHashes, [ 'urn:ed2k:31d6cfe0d16ae931b73c59d7e0c089c0' ]);
		});

		test('should handle ed2k with invalid hash length', () => {
			const result = decode('magnet:?xt=urn:ed2k:tooshort');
			assert.deepStrictEqual(result.infoHashes, []);
		});

	});

	describe('BitTorrent v2 info hash (btmh) tests', () => {

		test('should decode btmh hash with multihash prefix', () => {
			// btmh format: 1220 (multihash prefix) + 64 hex chars (SHA-256) = 68 chars total
			const btmhHash = '1220' + 'a'.repeat(64);
			const result = decode(`magnet:?xt=urn:btmh:${btmhHash}`);
			assert.deepStrictEqual(result.infoHashes, [ `urn:btmh:${btmhHash}` ]);
		});

		test('should decode btmh hash with uppercase hex', () => {
			const btmhHash = '1220' + 'A'.repeat(64);
			const result = decode(`magnet:?xt=urn:btmh:${btmhHash}`);
			assert.deepStrictEqual(result.infoHashes, [ `urn:btmh:${btmhHash.toLowerCase()}` ]);
		});

		test('should reject btmh hash with wrong length', () => {
			const result = decode('magnet:?xt=urn:btmh:1220abc');
			assert.deepStrictEqual(result.infoHashes, []);
		});

		test('should reject btmh hash without multihash prefix', () => {
			// 64 chars (valid SHA-256 but missing 1220 prefix)
			const result = decode(`magnet:?xt=urn:btmh:${'a'.repeat(64)}`);
			assert.deepStrictEqual(result.infoHashes, []);
		});

		test('should decode hybrid magnet with both btih and btmh', () => {
			const btih = 'c12fe1c06bba254a9dc9f519b335aa7c1367a88a';
			const btmh = '1220' + 'b'.repeat(64);
			const result = decode(`magnet:?xt=urn:btih:${btih}&xt=urn:btmh:${btmh}`);
			assert.strictEqual(result.infoHashes.length, 2);
			assert.ok(result.infoHashes.includes(`urn:btih:${btih}`));
			assert.ok(result.infoHashes.includes(`urn:btmh:${btmh}`));
		});

	});

	describe('Multiple hash types tests', () => {

		test('should decode magnet link with multiple hash types', () => {
			const result = decode(
				'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a' +
				'&xt=urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709' +
				'&xt=urn:md5:d41d8cd98f00b204e9800998ecf8427e' +
				'&xt=urn:ed2k:31d6cfe0d16ae931b73c59d7e0c089c0',
			);
			assert.deepStrictEqual(result.infoHashes, [
				'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
				'urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709',
				'urn:md5:d41d8cd98f00b204e9800998ecf8427e',
				'urn:ed2k:31d6cfe0d16ae931b73c59d7e0c089c0',
			]);
		});

	});

	describe('Info hash data (structured) tests', () => {

		test('should decode BitTorrent info hash to structured data', () => {
			const result = decode('magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
			assert.strictEqual(result.infoHashData.length, 1);
			assert.deepStrictEqual(result.infoHashData[0], {
				type: 'btih',
				value: 'c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
				urn: 'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
			});
		});

		test('should decode Base32 BitTorrent info hash to structured data', () => {
			const result = decode('magnet:?xt=urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q');
			assert.strictEqual(result.infoHashData.length, 1);
			assert.strictEqual(result.infoHashData[0].type, 'btih');
			assert.strictEqual(result.infoHashData[0].value, '81e177e2cc00943b29fcfc635457f575237293b0');
			assert.strictEqual(result.infoHashData[0].urn, 'urn:btih:81e177e2cc00943b29fcfc635457f575237293b0');
		});

		test('should decode btmh hash to structured data', () => {
			const btmhHash = '1220' + 'a'.repeat(64);
			const result = decode(`magnet:?xt=urn:btmh:${btmhHash}`);
			assert.strictEqual(result.infoHashData.length, 1);
			assert.deepStrictEqual(result.infoHashData[0], {
				type: 'btmh',
				value: btmhHash,
				urn: `urn:btmh:${btmhHash}`,
			});
		});

		test('should decode sha1 hash to structured data', () => {
			const result = decode('magnet:?xt=urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709');
			assert.strictEqual(result.infoHashData.length, 1);
			assert.strictEqual(result.infoHashData[0].type, 'sha1');
			assert.strictEqual(result.infoHashData[0].value, 'da39a3ee5e6b4b0d3255bfef95601890afd80709');
		});

		test('should decode md5 hash to structured data', () => {
			const result = decode('magnet:?xt=urn:md5:d41d8cd98f00b204e9800998ecf8427e');
			assert.strictEqual(result.infoHashData.length, 1);
			assert.strictEqual(result.infoHashData[0].type, 'md5');
			assert.strictEqual(result.infoHashData[0].value, 'd41d8cd98f00b204e9800998ecf8427e');
		});

		test('should decode ed2k hash to structured data', () => {
			const result = decode('magnet:?xt=urn:ed2k:31d6cfe0d16ae931b73c59d7e0c089c0');
			assert.strictEqual(result.infoHashData.length, 1);
			assert.strictEqual(result.infoHashData[0].type, 'ed2k');
			assert.strictEqual(result.infoHashData[0].value, '31d6cfe0d16ae931b73c59d7e0c089c0');
		});

		test('should decode multiple hash types to structured data', () => {
			const result = decode(
				'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a' +
				'&xt=urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709',
			);
			assert.strictEqual(result.infoHashData.length, 2);
			assert.strictEqual(result.infoHashData[0].type, 'btih');
			assert.strictEqual(result.infoHashData[1].type, 'sha1');
		});

		test('should return empty infoHashData for invalid hashes', () => {
			const result = decode('magnet:?xt=urn:btih:tooshort');
			assert.deepStrictEqual(result.infoHashData, []);
		});

		test('should maintain backward compatibility with infoHashes', () => {
			const result = decode('magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
			// Both should contain the same data
			assert.strictEqual(result.infoHashes.length, 1);
			assert.strictEqual(result.infoHashData.length, 1);
			assert.strictEqual(result.infoHashes[0], result.infoHashData[0].urn);
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

	describe('Empty value tests', () => {

		test('should handle empty parameter values', () => {
			const result = decode('magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&dn=&tr=');
			assert.strictEqual(result.displayName, null);
			assert.deepStrictEqual(result.trackers, []);
		});

		test('should handle whitespace-only display name', () => {
			const result = decode('magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&dn=%20%20');
			assert.strictEqual(result.displayName, null);
		});

	});

	test('example test', () => {
		const result = decode('magnet:?dn=test-name_for_magnet-link.tar.gz&xl=100500&xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&tr=http%3A%2F%2Ftracker.example.org%2Fannounce.php%3Fua%3D1111111111&tr=wss%3A%2F%2Ftracker.webtorrent.io&kt=martin+luther+king+mp3&ws=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5&mt=http%3A%2F%2Fweblog.foo%2Fall-my-favorites.rss');
		assert.deepStrictEqual(result, {
			displayName: 'test-name_for_magnet-link.tar.gz',
			length: 100500,
			infoHashes: [ 'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a' ],
			infoHashData: [ {
				type: 'btih',
				value: 'c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
				urn: 'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
			} ],
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

});
