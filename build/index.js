"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decode_1 = __importDefault(require("./decode"));
exports.decode = decode_1.default;
const encode_1 = __importDefault(require("./encode"));
exports.encode = encode_1.default;
exports.default = { decode: decode_1.default, encode: encode_1.default };
