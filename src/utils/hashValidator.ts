import { MAGNET_INFO_HASH_TYPE } from '../types';

/**
 * Hash type configuration defining valid lengths for each hash type
 */
interface HashTypeConfig {
	hexLength: number;
	base32Length: number | null; // null means base32 not supported
}

/**
 * Configuration map for supported hash types
 */
export const HASH_TYPE_CONFIG: Record<string, HashTypeConfig> = {
	[MAGNET_INFO_HASH_TYPE.BIT_TORRENT_INFO_HASH]: {
		hexLength: 40,
		base32Length: 32,
	},
	[MAGNET_INFO_HASH_TYPE.BIT_TORRENT_V2_INFO_HASH]: {
		hexLength: 68, // multihash: 1220 (4 chars) + SHA-256 (64 chars)
		base32Length: null, // btmh only uses hex
	},
	[MAGNET_INFO_HASH_TYPE.SECURE_HASH_ALGORITHM_1]: {
		hexLength: 40,
		base32Length: 32,
	},
	[MAGNET_INFO_HASH_TYPE.MESSAGE_DIGEST_5]: {
		hexLength: 32,
		base32Length: null,
	},
	[MAGNET_INFO_HASH_TYPE.E_DONKEY_2000]: {
		hexLength: 32,
		base32Length: null,
	},
};

/**
 * Set of supported hash types for processing
 */
export const SUPPORTED_HASH_TYPES = new Set([
	MAGNET_INFO_HASH_TYPE.BIT_TORRENT_INFO_HASH,
	MAGNET_INFO_HASH_TYPE.BIT_TORRENT_V2_INFO_HASH,
	MAGNET_INFO_HASH_TYPE.SECURE_HASH_ALGORITHM_1,
	MAGNET_INFO_HASH_TYPE.MESSAGE_DIGEST_5,
	MAGNET_INFO_HASH_TYPE.E_DONKEY_2000,
]);

/**
 * Checks if a hash type is supported
 */
export function isSupportedHashType(type: string): boolean {
	return SUPPORTED_HASH_TYPES.has(type as MAGNET_INFO_HASH_TYPE);
}

/**
 * Gets the configuration for a hash type
 */
export function getHashTypeConfig(type: string): HashTypeConfig | null {
	return HASH_TYPE_CONFIG[type] || null;
}
