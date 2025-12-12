import * as assert from 'assert';
import { base32DecodeToHex } from '../src/utils/base32';

describe('Base32 decode utility tests', () => {

	test('should decode valid base32 string to hex', () => {
		const result = base32DecodeToHex('QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q');
		assert.strictEqual(result, '81e177e2cc00943b29fcfc635457f575237293b0');
	});

	test('should handle lowercase input', () => {
		const result = base32DecodeToHex('qhqxpywmackdwkp47rrviv7vourxfe5q');
		assert.strictEqual(result, '81e177e2cc00943b29fcfc635457f575237293b0');
	});

	test('should skip invalid base32 characters', () => {
		// Characters 0, 1, 8, 9 are not part of RFC 4648 base32 alphabet
		// JBSWY3DPEHPK3PXP is valid base32 for "Hello!"
		const validResult = base32DecodeToHex('JBSWY3DPEHPK3PXP');
		// Same string with invalid chars (0, 1, 8, 9) inserted - should produce same result
		const resultWithInvalid = base32DecodeToHex('J0B1S8W9Y3DPEHPK3PXP');
		assert.strictEqual(validResult, resultWithInvalid);
	});

});
