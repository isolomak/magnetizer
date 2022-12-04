
export enum MAGNET_INFO_HASH_TYPE {
	TIGER_TREE_HASH = 'tree', // TODO
	SECURE_HASH_ALGORITHM_1 = 'sha1', // TODO
	BIT_PRINT = 'bitprint', // TODO
	E_DONKEY_2000 = 'ed2k', // TODO
	ADVANCED_INTELLIGENT_CORRUPTION_HANDLER = 'aich', // TODO
	KAZAA_HASH = 'kzhash', // TODO
	BIT_TORRENT_INFO_HASH = 'btih',
	MESSAGE_DIGEST_5 = 'md5', // TODO
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
	 */
	infoHashes: Array<string | Buffer>;
	/** 
	 * the payload data served over HTTP(S)
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
