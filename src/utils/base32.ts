/**
 * RFC 4648 Base32 alphabet lookup table
 * Maps characters A-Z (0-25) and 2-7 (26-31) to their 5-bit values
 */
const BASE32_ALPHABET: Record<string, number> = {
	A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7,
	I: 8, J: 9, K: 10, L: 11, M: 12, N: 13, O: 14, P: 15,
	Q: 16, R: 17, S: 18, T: 19, U: 20, V: 21, W: 22, X: 23,
	Y: 24, Z: 25, 2: 26, 3: 27, 4: 28, 5: 29, 6: 30, 7: 31,
};

/**
 * Decodes a base32 string and returns the result as a hexadecimal string.
 * Each base32 character represents 5 bits.
 */
export function base32DecodeToHex(input: string): string {
	const normalized = input.toUpperCase();
	let bits = '';

	for (const char of normalized) {
		const value = BASE32_ALPHABET[char];
		if (value === undefined) {
			continue;
		}
		bits += value.toString(2).padStart(5, '0');
	}

	let hex = '';
	for (let i = 0; i + 4 <= bits.length; i += 4) {
		hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
	}

	return hex;
}
