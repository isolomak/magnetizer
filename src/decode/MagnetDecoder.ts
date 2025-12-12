import { IMagnetURI, MAGNET_INFO_HASH_TYPE, MAGNET_PARAMETER } from '../types';
import { base32DecodeToHex } from '../utils/base32';

/**
 * Internal interface used during the decoding process.
 *
 * @description Represents the intermediate state of a decoded magnet URI.
 * Uses Set types for collection properties to automatically handle
 * deduplication during parsing. This interface is converted to the
 * public {@link IMagnetURI} interface when returning results.
 *
 * @internal
 */
interface IMagnetDecodeURI {
	displayName: string | null;
	length: number | null;
	manifest: string | null;
	infoHashes: Set<string>;
	webSeeds: Set<string>;
	acceptableSources: Set<string>;
	sources: Set<string>;
	keywords: Set<string>;
	trackers: Set<string>;
}

/**
 * Decoder class for parsing magnet URI strings into structured data.
 *
 * @description MagnetDecoder parses magnet URI strings and extracts all
 * recognized parameters into a structured {@link IMagnetURI} object. It handles
 * URL decoding of parameter values, automatic deduplication of repeated
 * parameters using Sets, and conversion of base32-encoded BitTorrent info
 * hashes to hexadecimal format.
 *
 * The decoder supports all standard magnet URI parameters including:
 * - dn (display name): Human-readable filename
 * - xl (exact length): File size in bytes
 * - xt (exact topic): Info hash URN (supports btih with hex and base32 formats)
 * - tr (tracker): BitTorrent tracker URLs
 * - ws (web seed): HTTP(S) download URLs
 * - as (acceptable source): Web links to the file
 * - xs (exact source): P2P links by content-hash
 * - kt (keyword topic): Search keywords
 * - mt (manifest topic): Metafile URL
 *
 * @remarks
 * - Invalid or unrecognized parameters are silently ignored
 * - If the input doesn't start with 'magnet:?', an empty result is returned
 * - Base32 info hashes (32 chars) are automatically converted to hex (40 chars)
 * - All string values are URL-decoded using decodeURIComponent
 *
 * @example
 * const decoder = new MagnetDecoder();
 * const result = decoder.decode('magnet:?xt=urn:btih:abc123...&dn=Example+File&tr=udp://tracker.com');
 * console.log(result.displayName); // 'Example File'
 * console.log(result.trackers);    // ['udp://tracker.com']
 *
 * @see {@link IMagnetURI} for the structure of output data
 * @see {@link MagnetEncoder} for the inverse operation
 */
export default class MagnetDecoder {

	/**
	 * Internal state holding the decoded magnet URI data during parsing.
	 * Uses Sets for collection types to handle automatic deduplication.
	 */
	private _decodedMagnetURI: IMagnetDecodeURI;

	/**
	 * Creates a new MagnetDecoder instance with reset internal state.
	 *
	 * @description Initializes the internal decoded URI state to empty/null values.
	 * The decoder is reusable; calling decode() resets the internal state automatically.
	 */
	constructor() {
		this._decodedMagnetURI = MagnetDecoder._reset();
	}

	/**
	 * Decodes a magnet URI string into a structured object.
	 *
	 * @description Parses the provided magnet URI string, extracting all recognized
	 * parameters into an {@link IMagnetURI} object. The internal state is reset at
	 * the start of each call, making the decoder instance safely reusable.
	 *
	 * The decoding process:
	 * 1. Validates the URI starts with 'magnet:?'
	 * 2. Splits the query string by '&' to get individual parameters
	 * 3. Parses each parameter by splitting on '=' into key-value pairs
	 * 4. Routes each parameter to the appropriate handler based on key
	 * 5. Converts internal Sets to Arrays for the final result
	 *
	 * @returns A structured object containing all parsed magnet URI parameters.
	 * Properties not found in the URI will be null (single values) or empty arrays.
	 *
	 * @example
	 * const decoder = new MagnetDecoder();
	 *
	 * // Decode a complete magnet link
	 * const result = decoder.decode('magnet:?dn=File&xt=urn:btih:abc123...');
	 *
	 * // Invalid input returns empty result
	 * const empty = decoder.decode('not-a-magnet-link');
	 * console.log(empty.displayName); // null
	 *
	 * @see {@link IMagnetURI} for the structure of the returned object
	 */
	public decode(magnetURI: string): IMagnetURI {
		this._decodedMagnetURI = MagnetDecoder._reset();

		if (!magnetURI.startsWith('magnet:?')) {
			return this._getResult();
		}

		const parametersList = magnetURI.replace('magnet:?', '').split('&');

		for (const parameter of parametersList) {
			this._decodeParameter(parameter);
		}

		return this._getResult();
	}

	/**
	 * Routes a single parameter to its appropriate handler based on the parameter key.
	 *
	 * @description Splits the parameter string on '=' to extract key and value,
	 * then dispatches to the appropriate private method based on the recognized
	 * magnet parameter type. Unrecognized parameters are silently ignored.
	 *
	 * @remarks Parameters without a key or value (malformed) are skipped.
	 */
	private _decodeParameter(param: string): void {
		const [ key, value ] = param.split('=');

		if (!key || !value) {
			return;
		}

		switch (key) {
			case MAGNET_PARAMETER.DISPLAY_NAME:
				return this._addDisplayName(value);
			case MAGNET_PARAMETER.LENGTH:
				return this._addLength(value);
			case MAGNET_PARAMETER.INFO_HASH:
				return this._addInfoHash(value);
			case MAGNET_PARAMETER.WEB_SEED:
				return this._addWebSeed(value);
			case MAGNET_PARAMETER.ACCEPTABLE_SOURCE:
				return this._addAcceptableSource(value);
			case MAGNET_PARAMETER.SOURCE:
				return this._addSource(value);
			case MAGNET_PARAMETER.KEYWORD:
				return this._addKeywords(value);
			case MAGNET_PARAMETER.MANIFEST:
				return this._addManifest(value);
			case MAGNET_PARAMETER.TRACKER:
				return this._addTracker(value);
			default:
				return;
		}
	}

	/**
	 * Parses and stores the display name (dn) parameter.
	 *
	 * @description URL-decodes the value, replaces '+' characters with spaces
	 * (common encoding for spaces in URLs), and trims whitespace. If the
	 * resulting string is non-empty, it's stored as the display name.
	 *
	 * @remarks Multiple dn parameters in the URI will result in only the
	 * last non-empty value being kept.
	 */
	private _addDisplayName(file: string): void {
		const displayName = decodeURIComponent(file).replace(/\+/g, ' ').trim();
		if (displayName) {
			this._decodedMagnetURI.displayName = displayName;
		}
	}

	/**
	 * Parses and stores the exact length (xl) parameter.
	 *
	 * @description Parses the string value as a base-10 integer representing
	 * the file size in bytes. Only valid numeric values are stored.
	 *
	 * @remarks Multiple xl parameters will result in only the last valid
	 * value being kept. Non-numeric values are silently ignored.
	 */
	private _addLength(length: string): void {
		const parsed = parseInt(length, 10);
		if (!isNaN(parsed)) {
			this._decodedMagnetURI.length = parsed;
		}
	}

	/**
	 * Parses and stores an info hash (xt) parameter.
	 *
	 * @description Parses the URN-formatted info hash and handles BitTorrent
	 * info hashes (btih) specifically. Supports two formats:
	 * - Hex format (40 characters): stored as lowercase hex
	 * - Base32 format (32 characters): converted to lowercase hex using base32DecodeToHex
	 *
	 * The full URN format is preserved in the output (e.g., 'urn:btih:hexhash').
	 *
	 * @remarks
	 * - Only URN-formatted values are processed (must start with 'urn:')
	 * - Only BitTorrent info hashes (btih type) are currently supported
	 * - Other hash types are silently ignored (marked as TODO in types)
	 * - Duplicate hashes are automatically deduplicated via Set
	 */
	private _addInfoHash(urnValue: string): void {
		const [ urn, type, hash ] = urnValue.split(':');

		if (urn !== 'urn') {
			return;
		}

		if (type === MAGNET_INFO_HASH_TYPE.BIT_TORRENT_INFO_HASH) {
			if (hash.length === 40) {
				this._decodedMagnetURI.infoHashes.add(
					`${urn}:${type}:${hash.toLowerCase()}`,
				);
			}
			if (hash.length === 32) {
				this._decodedMagnetURI.infoHashes.add(
					`${urn}:${type}:${base32DecodeToHex(hash)}`,
				);
			}

			return;
		}
	}

	/**
	 * Parses and stores a tracker (tr) parameter.
	 *
	 * @description URL-decodes the tracker URL and adds it to the trackers set.
	 * Duplicate tracker URLs are automatically deduplicated.
	 *
	 * @remarks Tracker URLs typically use UDP or HTTP protocols
	 * (e.g., 'udp://tracker.example.com:80/announce').
	 */
	private _addTracker(tracker: string): void {
		this._decodedMagnetURI.trackers.add(
			decodeURIComponent(tracker),
		);
	}

	/**
	 * Parses and stores keywords (kt) parameter.
	 *
	 * @description URL-decodes the keywords string and splits on '+' characters
	 * to extract individual keywords. Each keyword is added to the keywords set.
	 *
	 * @remarks Keywords in magnet URIs are '+'-separated within a single kt parameter,
	 * unlike other array parameters which use multiple separate parameters.
	 * Duplicate keywords are automatically deduplicated.
	 */
	private _addKeywords(keywords: string): void {
		const decodedKeywords = decodeURIComponent(keywords).split('+');

		for (const keyword of decodedKeywords) {
			this._decodedMagnetURI.keywords.add(keyword);
		}
	}

	/**
	 * Parses and stores a web seed (ws) parameter.
	 *
	 * @description URL-decodes the web seed URL and adds it to the webSeeds set.
	 * Web seeds are HTTP(S) URLs where the file payload can be downloaded directly.
	 *
	 * @remarks Duplicate web seed URLs are automatically deduplicated.
	 */
	private _addWebSeed(webSeed: string): void {
		this._decodedMagnetURI.webSeeds.add(
			decodeURIComponent(webSeed),
		);
	}

	/**
	 * Parses and stores an acceptable source (as) parameter.
	 *
	 * @description URL-decodes the source URL and adds it to the acceptableSources set.
	 * Acceptable sources are web links to the file online.
	 *
	 * @remarks Duplicate URLs are automatically deduplicated.
	 */
	private _addAcceptableSource(source: string): void {
		this._decodedMagnetURI.acceptableSources.add(
			decodeURIComponent(source),
		);
	}

	/**
	 * Parses and stores an exact source (xs) parameter.
	 *
	 * @description URL-decodes the source URL and adds it to the sources set.
	 * Exact sources are P2P links identified by content-hash.
	 *
	 * @remarks Duplicate URLs are automatically deduplicated.
	 */
	private _addSource(source: string): void {
		this._decodedMagnetURI.sources.add(
			decodeURIComponent(source),
		);
	}

	/**
	 * Parses and stores the manifest (mt) parameter.
	 *
	 * @description URL-decodes the manifest URL and stores it. The manifest
	 * is a link to a metafile containing a list of magneto (MAGMA - MAGnet MAnifest).
	 *
	 * @remarks Multiple mt parameters will result in only the last value being kept.
	 */
	private _addManifest(manifest: string): void {
		this._decodedMagnetURI.manifest = decodeURIComponent(manifest);
	}

	/**
	 * Creates a fresh internal state object with all values reset.
	 *
	 * @description Factory method that returns a new {@link IMagnetDecodeURI} object
	 * with all single-value properties set to null and all collection properties
	 * initialized as empty Sets.
	 *
	 * @returns A new reset internal state object.
	 */
	private static _reset(): IMagnetDecodeURI {
		return {
			displayName: null,
			length: null,
			infoHashes: new Set(),
			webSeeds: new Set(),
			acceptableSources: new Set(),
			sources: new Set(),
			keywords: new Set(),
			manifest: null,
			trackers: new Set(),
		};
	}

	/**
	 * Converts the internal decoded state to the public result format.
	 *
	 * @description Transforms the internal {@link IMagnetDecodeURI} state (which uses
	 * Sets for deduplication) into the public {@link IMagnetURI} interface (which uses
	 * Arrays). All Set properties are converted to Arrays using Array.from().
	 *
	 * @returns The final decoded magnet URI as an {@link IMagnetURI} object.
	 */
	private _getResult(): IMagnetURI {
		return {
			displayName: this._decodedMagnetURI.displayName,
			length: this._decodedMagnetURI.length,
			manifest: this._decodedMagnetURI.manifest,
			infoHashes: Array.from(this._decodedMagnetURI.infoHashes),
			webSeeds: Array.from(this._decodedMagnetURI.webSeeds),
			acceptableSources: Array.from(this._decodedMagnetURI.acceptableSources),
			sources: Array.from(this._decodedMagnetURI.sources),
			keywords: Array.from(this._decodedMagnetURI.keywords),
			trackers: Array.from(this._decodedMagnetURI.trackers),
		};
	}

}
