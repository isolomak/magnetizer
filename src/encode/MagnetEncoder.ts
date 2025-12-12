import { IMagnetURI, MAGNET_PARAMETER } from '../types';

/**
 * Encoder class for building magnet URI strings from structured data.
 *
 * @description MagnetEncoder transforms an {@link IMagnetURI} object into a properly
 * formatted magnet URI string. It handles URL encoding of special characters,
 * automatic deduplication of repeated values using Sets, and correct parameter
 * formatting according to the magnet URI specification.
 *
 * The encoder processes parameters in a specific order: display name, length,
 * info hashes, trackers, keywords, web seeds, acceptable sources, sources,
 * and manifest. Each parameter type is URL-encoded appropriately.
 *
 * @remarks
 * - Empty or null/undefined values are automatically omitted from the output
 * - Duplicate values in arrays are deduplicated using Set operations
 * - Info hashes can be provided as hex strings, URN strings, or Buffer objects
 * - All string values are URL-encoded using encodeURIComponent
 *
 * @example
 * const encoder = new MagnetEncoder();
 * const magnetLink = encoder.encode({
 *   displayName: 'Example File',
 *   infoHashes: ['1234567890abcdef1234567890abcdef12345678'],
 *   trackers: ['udp://tracker.example.com:80']
 * });
 *
 * @see {@link IMagnetURI} for the structure of input data
 * @see {@link MagnetDecoder} for the inverse operation
 */
export default class MagnetEncoder {

	/**
	 * Internal array accumulating encoded parameter strings during the encoding process.
	 * Each element is a complete parameter in the format 'key=value'.
	 */
	private _encodedParameters: Array<string>;

	/**
	 * Creates a new MagnetEncoder instance with an empty parameter list.
	 *
	 * @description Initializes the internal encoded parameters array to an empty state.
	 * The encoder is reusable; calling encode() resets the internal state automatically.
	 */
	constructor() {
		this._encodedParameters = [];
	}

	/**
	 * Encodes a magnet URI data object into a complete magnet link string.
	 *
	 * @description Processes all properties of the provided data object and builds
	 * a magnet URI string. The internal state is reset at the start of each call,
	 * making the encoder instance safely reusable. Parameters are added in a
	 * deterministic order: display name, length, info hashes, trackers, keywords,
	 * web seeds, acceptable sources, sources, and manifest.
	 *
	 * @returns A complete magnet URI string in the format 'magnet:?param1=value1&param2=value2'.
	 * If no valid parameters are provided, returns 'magnet:?' with no parameters.
	 *
	 * @example
	 * const encoder = new MagnetEncoder();
	 *
	 * // Encode with minimal data
	 * encoder.encode({ displayName: 'Test' });
	 * // Returns: 'magnet:?dn=Test'
	 *
	 * // Encoder is reusable
	 * encoder.encode({ infoHashes: ['abc123...'] });
	 * // Returns: 'magnet:?xt=urn:btih:abc123...'
	 *
	 * @see {@link IMagnetURI} for available properties
	 */
	public encode(data: Partial<IMagnetURI>): string {
		// Reset encoded parameters
		this._encodedParameters = [];

		this._encodeDisplayName(data);
		this._encodeLength(data);
		this._encodeInfoHashes(data);
		this._encodeTrackers(data);
		this._encodeKeywords(data);
		this._encodeWebSeeds(data);
		this._encodeAcceptableSources(data);
		this._encodeSources(data);
		this._encodeManifest(data);

		return `magnet:?${this._encodedParameters.join('&')}`;
	}

	/**
	 * Encodes the display name parameter (dn) from the magnet URI data.
	 *
	 * @description Extracts the display name from the data object, trims whitespace,
	 * and adds it to the encoded parameters if non-empty. The value is URL-encoded
	 * using encodeURIComponent to handle special characters.
	 *
	 * @remarks If displayName is null, undefined, or contains only whitespace,
	 * no parameter is added to the output.
	 */
	private _encodeDisplayName(data: Partial<IMagnetURI>): void {
		const displayName = data.displayName?.trim();

		if (!displayName) {
			return;
		}

		this._encodedParameters.push(
			`${MAGNET_PARAMETER.DISPLAY_NAME}=${encodeURIComponent(displayName)}`,
		);
	}

	/**
	 * Encodes the exact length parameter (xl) from the magnet URI data.
	 *
	 * @description Adds the file size in bytes to the encoded parameters if provided.
	 * The length value is output as-is without URL encoding since it's a numeric value.
	 *
	 * @remarks If length is null or undefined, no parameter is added to the output.
	 */
	private _encodeLength(data: Partial<IMagnetURI>): void {
		const length = data.length;

		if (length === null || length === undefined) {
			return;
		}

		this._encodedParameters.push(
			`${MAGNET_PARAMETER.LENGTH}=${length}`,
		);
	}

	/**
	 * Encodes info hash parameters (xt) from the magnet URI data.
	 *
	 * @description Processes the infoHashes array and converts each hash into a
	 * proper URN format. Supports multiple input formats:
	 * - Buffer objects: converted to hex string
	 * - Hex strings without URN prefix: prefixed with 'urn:btih:'
	 * - Full URN strings: used as-is
	 *
	 * Duplicate hashes are automatically removed using a Set.
	 *
	 * @remarks Each unique info hash generates a separate 'xt' parameter in the output.
	 * If infoHashes is undefined or empty, no parameters are added.
	 */
	private _encodeInfoHashes(data: Partial<IMagnetURI>): void {
		const encodedHashesSet = new Set<string>();

		for (const infoHash of data.infoHashes || []) {
			const providedInfoHash = Buffer.isBuffer(infoHash)
				? infoHash.toString('hex')
				: infoHash;

			if (!providedInfoHash.startsWith('urn:')) {
				encodedHashesSet.add(
					`${MAGNET_PARAMETER.INFO_HASH}=urn:btih:${providedInfoHash}`,
				);
			}
			else {
				encodedHashesSet.add(
					`${MAGNET_PARAMETER.INFO_HASH}=${providedInfoHash}`,
				);
			}
		}

		this._encodedParameters.push(...Array.from(encodedHashesSet));
	}

	/**
	 * Encodes tracker URL parameters (tr) from the magnet URI data.
	 *
	 * @description Processes the trackers array and URL-encodes each tracker URL.
	 * Duplicate tracker URLs are automatically removed using a Set.
	 *
	 * @remarks Each unique tracker generates a separate 'tr' parameter in the output.
	 * Tracker URLs are fully URL-encoded to handle special characters in the URLs.
	 * If trackers is undefined or empty, no parameters are added.
	 */
	private _encodeTrackers(data: Partial<IMagnetURI>): void {
		const encodedTrackersSet = new Set<string>();

		for (const trackerUrl of data.trackers || []) {
			encodedTrackersSet.add(
				`${MAGNET_PARAMETER.TRACKER}=${encodeURIComponent(trackerUrl)}`,
			);
		}

		this._encodedParameters.push(...Array.from(encodedTrackersSet));
	}

	/**
	 * Encodes the keyword parameter (kt) from the magnet URI data.
	 *
	 * @description Processes the keywords array and combines all keywords into a
	 * single parameter value separated by '+' characters. Each keyword is individually
	 * URL-encoded before joining. Duplicate keywords are removed using a Set.
	 *
	 * @remarks Unlike other array parameters, keywords are combined into a single
	 * 'kt' parameter with '+' separators rather than multiple separate parameters.
	 * If keywords is undefined or empty, no parameter is added.
	 */
	private _encodeKeywords(data: Partial<IMagnetURI>): void {
		const encodedKeywords = new Set<string>();

		for (const keyword of data.keywords || []) {
			encodedKeywords.add(
				encodeURIComponent(keyword),
			);
		}

		if (encodedKeywords.size) {
			this._encodedParameters.push(
				`${MAGNET_PARAMETER.KEYWORD}=${Array.from(encodedKeywords).join('+')}`,
			);
		}
	}

	/**
	 * Encodes web seed URL parameters (ws) from the magnet URI data.
	 *
	 * @description Processes the webSeeds array and URL-encodes each web seed URL.
	 * Web seeds are HTTP(S) URLs where the file payload can be downloaded directly.
	 * Duplicate URLs are automatically removed using a Set.
	 *
	 * @remarks Each unique web seed generates a separate 'ws' parameter in the output.
	 * If webSeeds is undefined or empty, no parameters are added.
	 */
	private _encodeWebSeeds(data: Partial<IMagnetURI>): void {
		const encodedWebSeeds = new Set<string>();

		for (const webSeed of data.webSeeds || []) {
			encodedWebSeeds.add(
				`${MAGNET_PARAMETER.WEB_SEED}=${encodeURIComponent(webSeed)}`,
			);
		}

		this._encodedParameters.push(...Array.from(encodedWebSeeds));
	}

	/**
	 * Encodes acceptable source URL parameters (as) from the magnet URI data.
	 *
	 * @description Processes the acceptableSources array and URL-encodes each source URL.
	 * Acceptable sources are web links to the file online. Duplicate URLs are
	 * automatically removed using a Set.
	 *
	 * @remarks Each unique acceptable source generates a separate 'as' parameter.
	 * If acceptableSources is undefined or empty, no parameters are added.
	 */
	private _encodeAcceptableSources(data: Partial<IMagnetURI>): void {
		const encodedAcceptableSources = new Set<string>();

		for (const source of data.acceptableSources || []) {
			encodedAcceptableSources.add(
				`${MAGNET_PARAMETER.ACCEPTABLE_SOURCE}=${encodeURIComponent(source)}`,
			);
		}

		this._encodedParameters.push(...Array.from(encodedAcceptableSources));
	}

	/**
	 * Encodes exact source URL parameters (xs) from the magnet URI data.
	 *
	 * @description Processes the sources array and URL-encodes each source URL.
	 * Sources are P2P links identified by content-hash. Duplicate URLs are
	 * automatically removed using a Set.
	 *
	 * @remarks Each unique source generates a separate 'xs' parameter in the output.
	 * If sources is undefined or empty, no parameters are added.
	 */
	private _encodeSources(data: Partial<IMagnetURI>): void {
		const encodedSources = new Set<string>();

		for (const source of data.sources || []) {
			encodedSources.add(
				`${MAGNET_PARAMETER.SOURCE}=${encodeURIComponent(source)}`,
			);
		}

		this._encodedParameters.push(...Array.from(encodedSources));
	}

	/**
	 * Encodes the manifest parameter (mt) from the magnet URI data.
	 *
	 * @description Extracts the manifest URL from the data object, trims whitespace,
	 * and adds it to the encoded parameters if non-empty. The manifest is a link
	 * to a metafile containing a list of magneto (MAGMA - MAGnet MAnifest).
	 *
	 * @remarks If manifest is null, undefined, or contains only whitespace,
	 * no parameter is added to the output. The value is URL-encoded.
	 */
	private _encodeManifest(data: Partial<IMagnetURI>): void {
		const manifest = data.manifest?.trim();

		if (!manifest) {
			return;
		}

		this._encodedParameters.push(
			`${MAGNET_PARAMETER.MANIFEST}=${encodeURIComponent(manifest)}`,
		);
	}

}
