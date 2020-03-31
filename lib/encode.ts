class MagnetEncoder {

	// @ts-ignore
	private _data: object;

	constructor(data: object) {
		this._data = data;
	}

	public encode() {

	}

}

export function encode(data: object) {
	return new MagnetEncoder(data).encode();
}
export default encode;
