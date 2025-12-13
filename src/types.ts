
export enum MAGNET_INFO_HASH_TYPE {
	TIGER_TREE_HASH = 'tree:tiger',
	SECURE_HASH_ALGORITHM_1 = 'sha1',
	BIT_PRINT = 'bitprint', // TODO
	E_DONKEY_2000 = 'ed2k',
	ADVANCED_INTELLIGENT_CORRUPTION_HANDLER = 'aich', // TODO
	KAZAA_HASH = 'kzhash', // TODO
	BIT_TORRENT_INFO_HASH = 'btih',
	BIT_TORRENT_V2_INFO_HASH = 'btmh',
	MESSAGE_DIGEST_5 = 'md5',
}

/**
 * Represents a structured info hash with parsed components.
 * Provides easy access to hash type, raw value, and full URN.
 */
export interface IInfoHashData {
	/**
	 * The hash type identifier (e.g., 'btih', 'btmh', 'sha1', 'md5', 'ed2k')
	 */
	type: MAGNET_INFO_HASH_TYPE | string;
	/**
	 * The raw hexadecimal hash value (lowercase, without URN prefix)
	 */
	value: string;
	/**
	 * The complete URN string (e.g., 'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a')
	 */
	urn: string;
}

export enum MAGNET_PARAMETER {
	DISPLAY_NAME = 'dn',
	LENGTH = 'xl',
	INFO_HASH = 'xt',
	WEB_SEED = 'ws',
	ACCEPTABLE_SOURCE = 'as',
	SOURCE = 'xs',
	KEYWORD = 'kt',
	MANIFEST = 'mt',
	TRACKER = 'tr',
}

/**
 * Magnet URI scheme  
 * wiki https://en.wikipedia.org/wiki/Magnet_URI_scheme
 */
export interface IMagnetURI {
	/**
	 * A filename to display to the user, for convenience
	 */
	displayName: string | null;
	/**
	 * Size in bytes
	 */
	length: number | null;
	/**
	 * URN containing file hash
	 * @deprecated Use infoHashData instead. Will be removed in v4.0.0.
	 */
	infoHashes: Array<string | Uint8Array>;
	/**
	 * Structured info hash data with parsed type, value, and URN.
	 * Provides direct access to hash components without string parsing.
	 */
	infoHashData: Array<IInfoHashData>;
	/**
	 * The payload data served over HTTP(S)
	 */
	webSeeds: Array<string>;
	/** 
	 * Web link to the file online
	 */
	acceptableSources: Array<string>;
	/** 
	 * P2P link identified by a content-hash
	 */
	sources: Array<string>;
	/** 
	 * A more general search, specifying keywords, rather than a particular file
	 */
	keywords: Array<string>;
	/** 
	 * Link to the metafile that contains a list of magneto (MAGMA – MAGnet MAnifest)
	 */
	manifest: string | null;
	/** 
	 * Tracker URL for BitTorrent downloads
	 */
	trackers: Array<string>;
}
