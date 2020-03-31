class MagnetDecoder {

	private _link: Buffer;

	constructor(link: string | Buffer) {
		this._link = typeof link === 'string'
			? Buffer.from(link)
			: link;
	}

	public decode() {

	}
}

export function decode(data: string | Buffer) {
	return new MagnetDecoder(data).decode();
}
export default parse;


// // magnet uri (as a utf8 string)
// parseTorrent('magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36')
// // { xt: 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
// //   infoHash: 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36' }
//
// // magnet uri with torrent name
// parseTorrent('magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&dn=Leaves%20of%20Grass%20by%20Walt%20Whitman.epub')
// // { xt: 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
// //   dn: 'Leaves of Grass by Walt Whitman.epub',
// //   infoHash: 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
// //   name: 'Leaves of Grass by Walt Whitman.epub' }
//
// // magnet uri with trackers
// parseTorrent('magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&tr=http%3A%2F%2Ftracker.example.com%2Fannounce')
// // { xt: 'urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
// //   tr: 'http://tracker.example.com/announce',
// //   infoHash: 'd2474e86c95b19b8bcfdb92bc12c9d44667cfa36',
// //   announce: [ 'http://tracker.example.com/announce' ] }
