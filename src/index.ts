/**
 * @module magnetizer
 * @description A TypeScript library for decoding and encoding magnet URIs.
 * Provides functionality to parse magnet link strings into structured objects
 * and build magnet link strings from structured data. Supports BitTorrent
 * info hashes (btih) in both hex (40 character) and base32 (32 character) formats.
 * @see {@link https://en.wikipedia.org/wiki/Magnet_URI_scheme} for magnet URI specification
 */

import MagnetDecoder from './decode/MagnetDecoder';
import MagnetEncoder from './encode/MagnetEncoder';
import { IMagnetURI } from './types';

export * from './types';
export { decode, encode };

/**
 * Decodes a magnet URI string into a structured object containing all
 * parsed magnet link parameters. Handles URL decoding, base32-to-hex
 * conversion for BitTorrent info hashes, and extraction of all standard
 * magnet URI parameters including trackers, web seeds, and keywords.
 *
 * @description Parses the provided magnet URI string and extracts all
 * recognized parameters into an {@link IMagnetURI} object. Invalid or
 * malformed parameters are silently ignored. If the input string does
 * not start with 'magnet:?', an empty result object is returned.
 *
 * @returns A structured object containing all parsed magnet URI parameters.
 * Properties that were not found in the URI will be null (for single values)
 * or empty arrays (for collection values).
 *
 * @example
 * // Basic usage with a simple magnet link
 * const result = decode('magnet:?xt=urn:btih:1234567890abcdef1234567890abcdef12345678&dn=Example+File');
 * console.log(result.displayName); // 'Example File'
 * console.log(result.infoHashes);  // ['urn:btih:1234567890abcdef1234567890abcdef12345678']
 *
 * @example
 * // Decoding a magnet link with multiple trackers
 * const result = decode('magnet:?xt=urn:btih:abc123...&tr=udp://tracker1.com&tr=udp://tracker2.com');
 * console.log(result.trackers); // ['udp://tracker1.com', 'udp://tracker2.com']
 *
 * @see {@link IMagnetURI} for the structure of the returned object
 * @see {@link encode} for the inverse operation
 */
function decode(magnetURI: string): IMagnetURI {
	const magnetDecoder = new MagnetDecoder();
	return magnetDecoder.decode(magnetURI);
}

/**
 * Encodes a structured magnet URI object into a valid magnet link string.
 * Handles URL encoding of values, deduplication of repeated parameters,
 * and proper formatting according to the magnet URI specification.
 *
 * @description Builds a magnet URI string from the provided data object.
 * All provided properties are encoded into their corresponding magnet
 * URI parameters. Empty or null values are omitted from the output.
 * Duplicate values in arrays are automatically deduplicated. Info hashes
 * can be provided as hex strings, URN strings, or Buffer objects.
 *
 * @returns A properly formatted magnet URI string starting with 'magnet:?'
 * followed by URL-encoded parameters joined with '&'.
 *
 * @example
 * // Basic usage with display name and info hash
 * const magnetLink = encode({
 *   displayName: 'Example File',
 *   infoHashes: ['1234567890abcdef1234567890abcdef12345678']
 * });
 * // Returns: 'magnet:?dn=Example%20File&xt=urn:btih:1234567890abcdef1234567890abcdef12345678'
 *
 * @example
 * // Encoding with multiple trackers and keywords
 * const magnetLink = encode({
 *   displayName: 'My File',
 *   infoHashes: ['urn:btih:abc123...'],
 *   trackers: ['udp://tracker1.com', 'udp://tracker2.com'],
 *   keywords: ['keyword1', 'keyword2']
 * });
 *
 * @see {@link IMagnetURI} for the structure of the input object
 * @see {@link decode} for the inverse operation
 */
function encode(data: Partial<IMagnetURI>): string {
	const magnetEncoder = new MagnetEncoder();
	return magnetEncoder.encode(data);
}
