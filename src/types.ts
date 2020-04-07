/**
 * https://en.wikipedia.org/wiki/Magnet_URI_scheme
 */

export enum HASH {
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

export interface MagnetURI {
	displayNames?: Array<string>; // a filename to display to the user, for convenience
	length?: number; // size in bytes
	infoHashes?: Array<string>; // URN containing file hash
	webSeeds?: Array<string>; // the payload data served over HTTP(S)
	acceptableSources?: Array<string>; // web link to the file online
	sources?: Array<string>; // P2P link identified by a content-hash
	keywords?: Array<string>; // a more general search, specifying keywords, rather than a particular file
	manifest?: string; // link to the metafile that contains a list of magneto (MAGMA – MAGnet MAnifest)
	trackers?: Array<string>; // tracker URL for BitTorrent downloads
}
