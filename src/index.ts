import MagnetDecoder from './decode/MagnetDecoder';
import MagnetEncoder from './encode/MagnetEncoder';
import { IMagnetURI } from './types';

export * from './types';
export { decode, encode };

function decode(magnetURI: string): IMagnetURI {
	const magnetDecoder = new MagnetDecoder();
	return magnetDecoder.decode(magnetURI);
}

function encode(data: Partial<IMagnetURI>): string {
	const magnetEncoder = new MagnetEncoder();
	return magnetEncoder.encode(data);
}
