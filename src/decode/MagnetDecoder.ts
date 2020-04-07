import * as base32 from 'hi-base32';
import { HASH, MAGNET_PARAMETER, MagnetURI } from '../types';

/*
	TODO: The standard also allows for multiple parameters of the same type to be used by appending ".1", ".2", etc. to the parameter name,
	 e.g.: magnet:?xt.1=urn:sha1:YNCKHTQCWBTRNJIV4WNAE52SJUQCZO5C&xt.2=urn:sha1:TXGCZQTH26NL6OUQAJJPFALHG2LTGBC7
 */

export default class MagnetDecoder {

	private static _splitMagnetURI(magnetURI: string): Array<string>  {
		return magnetURI.replace('magnet:?', '').split('&');
	}

	private readonly _decodedMagnetURI: MagnetURI;

	constructor() {
		this._decodedMagnetURI = { };
	}

	public decode(magnetURI: string): MagnetURI {
		if (!magnetURI.startsWith('magnet:?')) {
			return this._decodedMagnetURI;
		}

		const parametersList = MagnetDecoder._splitMagnetURI(magnetURI);

		for (const parameter of parametersList) {
			this._decodeParameter(parameter);
		}

		return this._decodedMagnetURI;
	}

	private _decodeParameter(param: string) {
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

	private _addDisplayName(file: string) {
		this._decodedMagnetURI.displayNames = this._decodedMagnetURI.displayNames || [];
		this._decodedMagnetURI.displayNames.push(
			decodeURIComponent(file).replace(/\+/g, ' ')
		);
	}

	private _addLength(length: string) {
		this._decodedMagnetURI.length = parseInt(length, 10);
	}

	private _addInfoHash(urnValue: string) {
		this._decodedMagnetURI.infoHashes = this._decodedMagnetURI.infoHashes || [];

		const [ urn, type, hash ] = urnValue.split(':');

		if (urn !== 'urn') {
			return ;
		}

		if (type === HASH.BIT_TORRENT_INFO_HASH) {
			if (hash.length === 40) {
				this._decodedMagnetURI.infoHashes.push(
					`${urn}:${type}:${hash.toLowerCase()}`
				);
			}
			if (hash.length === 32) {
				this._decodedMagnetURI.infoHashes.push(
					`${urn}:${type}:${Buffer.from(base32.decode.asBytes(hash)).toString('hex')}`
				);
			}
			return ;
		}

	}

	private _addTracker(tracker: string) {
		this._decodedMagnetURI.trackers = this._decodedMagnetURI.trackers || [];
		this._decodedMagnetURI.trackers.push(
			decodeURIComponent(tracker)
		);
	}

	private _addKeywords(keywords: string) {
		this._decodedMagnetURI.keywords = decodeURIComponent(keywords).split('+');
	}

	private _addWebSeed(webSeed: string) {
		this._decodedMagnetURI.webSeeds = this._decodedMagnetURI.webSeeds || [];
		this._decodedMagnetURI.webSeeds.push(
			decodeURIComponent(webSeed)
		);
	}

	private _addAcceptableSource(source: string) {
		this._decodedMagnetURI.acceptableSources = this._decodedMagnetURI.acceptableSources || [];
		this._decodedMagnetURI.acceptableSources.push(
			decodeURIComponent(source)
		);
	}

	private _addSource(source: string) {
		this._decodedMagnetURI.sources = this._decodedMagnetURI.sources || [];
		this._decodedMagnetURI.sources.push(
			decodeURIComponent(source)
		);
	}

	private _addManifest(manifest: string) {
		this._decodedMagnetURI.manifest = decodeURIComponent(manifest);
	}

}
