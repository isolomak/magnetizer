import { MagnetURI } from './types';
import MagnetDecoder from './decode/MagnetDecoder';
import MagnetEncoder from './encode/MagnetEncoder';

function decode(magnetURI: string) {
	return new MagnetDecoder().decode(magnetURI);
}

function encode(data: MagnetURI) {
	return new MagnetEncoder(data).encode();
}

export { decode, encode };
export default { decode, encode };
