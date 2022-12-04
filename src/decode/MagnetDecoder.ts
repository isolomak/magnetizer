import * as base32 from 'hi-base32';
import { IMagnetURI, MAGNET_INFO_HASH_TYPE, MAGNET_PARAMETER } from '../types';

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

export default class MagnetDecoder {

	private _decodedMagnetURI: IMagnetDecodeURI;

	/**
	 * Constructor
	 */
	constructor() {
		this._decodedMagnetURI = MagnetDecoder._reset();
	}

	/**
	 * Decode magnet uri
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
	 * Decode parameter
	 */
	private _decodeParameter(param: string): void {
		const [ key, value ] = param.split('=');

		if (!key || !value) {
			return ;
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
				return ;
		}
	}

	/**
	 * Add display name
	 */
	private _addDisplayName(file: string): void {
		this._decodedMagnetURI.displayName = decodeURIComponent(file).replace(/\+/g, ' ');
	}

	/**
	 * Add length
	 */
	private _addLength(length: string): void {
		this._decodedMagnetURI.length = parseInt(length, 10);
	}

	/**
	 * Add infoHash
	 */
	private _addInfoHash(urnValue: string): void {
		const [ urn, type, hash ] = urnValue.split(':');

		if (urn !== 'urn') {
			return ;
		}

		if (type === MAGNET_INFO_HASH_TYPE.BIT_TORRENT_INFO_HASH) {
			if (hash.length === 40) {
				this._decodedMagnetURI.infoHashes.add(
					`${urn}:${type}:${hash.toLowerCase()}`
				);
			}
			if (hash.length === 32) {
				this._decodedMagnetURI.infoHashes.add(
					`${urn}:${type}:${Buffer.from(base32.decode.asBytes(hash)).toString('hex')}`
				);
			}
			return ;
		}

	}

	/**
	 * Add tracker
	 */
	private _addTracker(tracker: string): void {
		this._decodedMagnetURI.trackers.add(
			decodeURIComponent(tracker)
		);
	}

	/**
	 * Add keywords
	 */
	private _addKeywords(keywords: string): void {
		const decodedKeywords = decodeURIComponent(keywords).split('+');

		for (const keyword of decodedKeywords) {
			this._decodedMagnetURI.keywords.add(keyword);
		}
	}

	/**
	 * Add web seed
	 */
	private _addWebSeed(webSeed: string): void {
		this._decodedMagnetURI.webSeeds.add(
			decodeURIComponent(webSeed)
		);
	}

	/**
	 * Add acceptable source
	 */
	private _addAcceptableSource(source: string): void {
		this._decodedMagnetURI.acceptableSources.add(
			decodeURIComponent(source)
		);
	}

	/**
	 * Add source
	 */
	private _addSource(source: string): void {
		this._decodedMagnetURI.sources.add(
			decodeURIComponent(source)
		);
	}

	/**
	 * Add manifest
	 */
	private _addManifest(manifest: string): void {
		this._decodedMagnetURI.manifest = decodeURIComponent(manifest);
	}

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
