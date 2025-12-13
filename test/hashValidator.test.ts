import * as assert from 'assert';
import {
	HASH_TYPE_CONFIG,
	SUPPORTED_HASH_TYPES,
	isSupportedHashType,
	getHashTypeConfig,
} from '../src/utils/hashValidator';
import { MAGNET_INFO_HASH_TYPE } from '../src/types';

describe('Hash Validator tests', () => {

	describe('HASH_TYPE_CONFIG', () => {

		test('should have correct config for btih', () => {
			assert.strictEqual(HASH_TYPE_CONFIG['btih'].hexLength, 40);
			assert.strictEqual(HASH_TYPE_CONFIG['btih'].base32Length, 32);
		});

		test('should have correct config for sha1', () => {
			assert.strictEqual(HASH_TYPE_CONFIG['sha1'].hexLength, 40);
			assert.strictEqual(HASH_TYPE_CONFIG['sha1'].base32Length, 32);
		});

		test('should have correct config for md5', () => {
			assert.strictEqual(HASH_TYPE_CONFIG['md5'].hexLength, 32);
			assert.strictEqual(HASH_TYPE_CONFIG['md5'].base32Length, null);
		});

		test('should have correct config for ed2k', () => {
			assert.strictEqual(HASH_TYPE_CONFIG['ed2k'].hexLength, 32);
			assert.strictEqual(HASH_TYPE_CONFIG['ed2k'].base32Length, null);
		});

		test('should have correct config for btmh (BitTorrent v2)', () => {
			assert.strictEqual(HASH_TYPE_CONFIG['btmh'].hexLength, 68);
			assert.strictEqual(HASH_TYPE_CONFIG['btmh'].base32Length, null);
		});

	});

	describe('SUPPORTED_HASH_TYPES', () => {

		test('should contain btih', () => {
			assert.strictEqual(SUPPORTED_HASH_TYPES.has(MAGNET_INFO_HASH_TYPE.BIT_TORRENT_INFO_HASH), true);
		});

		test('should contain sha1', () => {
			assert.strictEqual(SUPPORTED_HASH_TYPES.has(MAGNET_INFO_HASH_TYPE.SECURE_HASH_ALGORITHM_1), true);
		});

		test('should contain md5', () => {
			assert.strictEqual(SUPPORTED_HASH_TYPES.has(MAGNET_INFO_HASH_TYPE.MESSAGE_DIGEST_5), true);
		});

		test('should contain ed2k', () => {
			assert.strictEqual(SUPPORTED_HASH_TYPES.has(MAGNET_INFO_HASH_TYPE.E_DONKEY_2000), true);
		});

		test('should contain btmh (BitTorrent v2)', () => {
			assert.strictEqual(SUPPORTED_HASH_TYPES.has(MAGNET_INFO_HASH_TYPE.BIT_TORRENT_V2_INFO_HASH), true);
		});

		test('should have exactly 6 supported types', () => {
			assert.strictEqual(SUPPORTED_HASH_TYPES.size, 6);
		});

	});

	describe('isSupportedHashType', () => {

		test('should return true for btih', () => {
			assert.strictEqual(isSupportedHashType('btih'), true);
		});

		test('should return true for sha1', () => {
			assert.strictEqual(isSupportedHashType('sha1'), true);
		});

		test('should return true for md5', () => {
			assert.strictEqual(isSupportedHashType('md5'), true);
		});

		test('should return true for ed2k', () => {
			assert.strictEqual(isSupportedHashType('ed2k'), true);
		});

		test('should return true for btmh', () => {
			assert.strictEqual(isSupportedHashType('btmh'), true);
		});

		test('should return false for unsupported types', () => {
			assert.strictEqual(isSupportedHashType('tree'), false);
			assert.strictEqual(isSupportedHashType('bitprint'), false);
			assert.strictEqual(isSupportedHashType('aich'), false);
			assert.strictEqual(isSupportedHashType('kzhash'), false);
			assert.strictEqual(isSupportedHashType('unknown'), false);
		});

	});

	describe('getHashTypeConfig', () => {

		test('should return correct config for btih', () => {
			const config = getHashTypeConfig('btih');
			assert.strictEqual(config?.hexLength, 40);
			assert.strictEqual(config?.base32Length, 32);
		});

		test('should return correct config for sha1', () => {
			const config = getHashTypeConfig('sha1');
			assert.strictEqual(config?.hexLength, 40);
			assert.strictEqual(config?.base32Length, 32);
		});

		test('should return correct config for md5', () => {
			const config = getHashTypeConfig('md5');
			assert.strictEqual(config?.hexLength, 32);
			assert.strictEqual(config?.base32Length, null);
		});

		test('should return correct config for ed2k', () => {
			const config = getHashTypeConfig('ed2k');
			assert.strictEqual(config?.hexLength, 32);
			assert.strictEqual(config?.base32Length, null);
		});

		test('should return correct config for btmh (BitTorrent v2)', () => {
			const config = getHashTypeConfig('btmh');
			assert.strictEqual(config?.hexLength, 68);
			assert.strictEqual(config?.base32Length, null);
		});

		test('should return null for unsupported types', () => {
			assert.strictEqual(getHashTypeConfig('tree'), null);
			assert.strictEqual(getHashTypeConfig('unknown'), null);
		});

	});

});
