import { IMagnetURI, MAGNET_PARAMETER } from '../types';

export default class MagnetEncoder {

	private _encodedParameters: Array<string>;

	/**
	 * Constructor
	 */
	constructor() {
		this._encodedParameters = [];
	}

	/**
	 * Encode magnet uri
	 */
	public encode(data: Partial<IMagnetURI>): string {
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
	 * Encode display name
	 */
	private _encodeDisplayName(data: Partial<IMagnetURI>): void {
		const displayName = data.displayName?.trim();
		
		if (!displayName) {
			return ;
		}

		this._encodedParameters.push(
			`${MAGNET_PARAMETER.DISPLAY_NAME}=${encodeURIComponent(displayName)}`
		);
	}

	/**
	 * Encode length
	 */
	private _encodeLength(data: Partial<IMagnetURI>): void {
		const length = data.length;

		if (length === null || length === undefined) {
			return ;
		}

		this._encodedParameters.push(
			`${MAGNET_PARAMETER.LENGTH}=${length}`
		);
	}

	/**
	 * Encode info hashes
	 */
	private _encodeInfoHashes(data: Partial<IMagnetURI>): void {
		const encodedHashesSet = new Set<string>();

		for (const infoHash of data.infoHashes || []) {
			const providedInfoHash = Buffer.isBuffer(infoHash)
				? infoHash.toString('hex')
				: infoHash;

			if (!providedInfoHash.startsWith('urn:')) {
				encodedHashesSet.add(
					`${MAGNET_PARAMETER.INFO_HASH}=urn:btih:${providedInfoHash}`
				);
			}
			else {
				encodedHashesSet.add(
					`${MAGNET_PARAMETER.INFO_HASH}=${providedInfoHash}`
				);	
			}
		}

		this._encodedParameters.push(...Array.from(encodedHashesSet));
	}

	/**
	 * Encode trackers
	 */
	private _encodeTrackers(data: Partial<IMagnetURI>): void {
		const encodedTrackersSet = new Set<string>();

		for (const trackerUrl of data.trackers || []) {
			encodedTrackersSet.add(
				`${MAGNET_PARAMETER.TRACKER}=${encodeURIComponent(trackerUrl)}`
			);
		}

		this._encodedParameters.push(...Array.from(encodedTrackersSet));
	}

	/**
	 * Encode keywords
	 */
	private _encodeKeywords(data: Partial<IMagnetURI>): void {
		const encodedKeywords = new Set<string>();

		for (const keyword of data.keywords || []) {
			encodedKeywords.add(
				encodeURIComponent(keyword)	
			);
		}

		if (encodedKeywords.size) {
			this._encodedParameters.push(
				`${MAGNET_PARAMETER.KEYWORD}=${Array.from(encodedKeywords).join('+')}`
			);
		}
	}

	/**
	 * Encode web seeds
	 */
	private _encodeWebSeeds(data: Partial<IMagnetURI>): void {
		const encodedWebSeeds = new Set<string>();

		for (const webSeed of data.webSeeds || []) {
			encodedWebSeeds.add(
				`${MAGNET_PARAMETER.WEB_SEED}=${encodeURIComponent(webSeed)}`
			);
		}

		this._encodedParameters.push(...Array.from(encodedWebSeeds));
	}

	/**
	 * Encode acceptable sources
	 */
	private _encodeAcceptableSources(data: Partial<IMagnetURI>): void {
		const encodedAcceptableSources = new Set<string>();

		for (const source of data.acceptableSources || []) {
			encodedAcceptableSources.add(
				`${MAGNET_PARAMETER.ACCEPTABLE_SOURCE}=${encodeURIComponent(source)}`
			);
		}

		this._encodedParameters.push(...Array.from(encodedAcceptableSources));
	}

	/**
	 * Encode sources
	 */
	private _encodeSources(data: Partial<IMagnetURI>): void {
		const encodedSources = new Set<string>();

		for (const source of data.sources || []) {
			encodedSources.add(
				`${MAGNET_PARAMETER.SOURCE}=${encodeURIComponent(source)}`
			);
		}

		this._encodedParameters.push(...Array.from(encodedSources));
	}

	/**
	 * Encode manifest
	 */
	private _encodeManifest(data: Partial<IMagnetURI>): void {
		const manifest = data.manifest?.trim();

		if (!manifest) {
			return ;
		}

		this._encodedParameters.push(
			`${MAGNET_PARAMETER.MANIFEST}=${encodeURIComponent(manifest)}`
		);
	}

}
