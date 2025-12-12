import * as assert from 'assert';
import { decode, encode } from '../src';

describe('Round-trip tests', () => {

	test('should preserve simple magnet link', () => {
		const original = 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&dn=test';
		const decoded = decode(original);
		const reencoded = encode(decoded);
		const redecoded = decode(reencoded);

		assert.strictEqual(decoded.displayName, redecoded.displayName);
		assert.deepStrictEqual(decoded.infoHashes, redecoded.infoHashes);
	});

	test('should preserve complex magnet link with all fields', () => {
		const data = {
			displayName: 'Test File',
			length: 12345,
			infoHashes: ['c12fe1c06bba254a9dc9f519b335aa7c1367a88a'],
			webSeeds: ['https://example.com/file.torrent'],
			trackers: ['udp://tracker.example.com:80/announce'],
			keywords: ['test', 'file'],
		};

		const encoded = encode(data);
		const decoded = decode(encoded);

		assert.strictEqual(decoded.displayName, data.displayName);
		assert.strictEqual(decoded.length, data.length);
		assert.deepStrictEqual(decoded.infoHashes, data.infoHashes.map(h => `urn:btih:${h}`));
		assert.deepStrictEqual(decoded.webSeeds, data.webSeeds);
		assert.deepStrictEqual(decoded.trackers, data.trackers);
		assert.deepStrictEqual(decoded.keywords, data.keywords);
	});

	test('should preserve base32 hash after round-trip (converted to hex)', () => {
		const original = 'magnet:?xt=urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q';
		const decoded = decode(original);
		const reencoded = encode(decoded);
		const redecoded = decode(reencoded);

		// Base32 gets converted to hex, but should be same hash
		assert.deepStrictEqual(decoded.infoHashes, redecoded.infoHashes);
		assert.strictEqual(redecoded.infoHashes[0], 'urn:btih:81e177e2cc00943b29fcfc635457f575237293b0');
	});

	test('should preserve multiple trackers', () => {
		const data = {
			infoHashes: ['c12fe1c06bba254a9dc9f519b335aa7c1367a88a'],
			trackers: [
				'http://tracker1.example.com/announce',
				'udp://tracker2.example.com:80',
				'wss://tracker3.example.com',
			],
		};

		const encoded = encode(data);
		const decoded = decode(encoded);

		assert.deepStrictEqual(decoded.trackers, data.trackers);
	});

	test('should preserve special characters in display name', () => {
		const data = {
			displayName: 'Test & File (2023) [1080p]',
			infoHashes: ['c12fe1c06bba254a9dc9f519b335aa7c1367a88a'],
		};

		const encoded = encode(data);
		const decoded = decode(encoded);

		assert.strictEqual(decoded.displayName, data.displayName);
	});

});
