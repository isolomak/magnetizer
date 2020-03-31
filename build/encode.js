"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MagnetEncoder {
    constructor(data) {
        this._data = data;
    }
    encode() {
    }
}
function encode(data) {
    return new MagnetEncoder(data).encode();
}
exports.encode = encode;
exports.default = encode;
