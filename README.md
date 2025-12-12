# Magnetizer

![ci](https://github.com/IvanSolomakhin/magnetizer/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/IvanSolomakhin/magnetizer/badge.svg)](https://coveralls.io/github/IvanSolomakhin/magnetizer)
[![npm version](https://img.shields.io/npm/v/magnetizer)](https://npmjs.org/package/magnetizer)
[![NPM Downloads](https://img.shields.io/npm/dt/magnetizer)](https://npmjs.org/package/magnetizer)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![NPM License](https://img.shields.io/npm/l/magnetizer)](LICENSE)

A powerful TypeScript library for decoding and encoding [magnet links](https://en.wikipedia.org/wiki/Magnet_URI_scheme).

## Features

- **Zero dependencies** - Lightweight and self-contained
- **TypeScript-first** - Full type definitions included
- **Dual module support** - Works with both ESM and CommonJS
- **BitTorrent v1 & v2** - Supports both `btih` and `btmh` hash types
- **Multiple hash types** - SHA-1, MD5, eDonkey 2000, and more
- **Base32 & hex support** - Automatic format detection and conversion
- **URL encoding/decoding** - Handles special characters automatically
- **100% test coverage** - Thoroughly tested and reliable

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [decode()](#decodemagneturi-string-imagneturi)
  - [encode()](#encodedata-partialimagneturi-string)
  - [IMagnetURI Interface](#imagneturi-interface)
- [Supported Hash Types](#supported-hash-types)
- [Advanced Usage](#advanced-usage)
- [Compatibility](#compatibility)
- [Development](#development)
- [License](#license)

---

## Installation

```bash
npm install magnetizer
```

```bash
yarn add magnetizer
```

```bash
pnpm add magnetizer
```

---

## Quick Start

```typescript
import { decode, encode } from 'magnetizer';

// Decode a magnet link
const result = decode('magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&dn=example');
console.log(result.displayName);  // 'example'
console.log(result.infoHashes);   // ['urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a']

// Encode a magnet link
const magnetLink = encode({
  displayName: 'example',
  infoHashes: ['c12fe1c06bba254a9dc9f519b335aa7c1367a88a'],
  trackers: ['udp://tracker.example.com:80']
});
console.log(magnetLink);
// 'magnet:?dn=example&xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&tr=udp%3A%2F%2Ftracker.example.com%3A80'
```

---

## API Reference

### `decode(magnetURI: string): IMagnetURI`

Parses a magnet link string into a structured object.

#### Examples

**Basic decoding:**

```typescript
import { decode } from 'magnetizer';

const result = decode('magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');

console.log(result);
// {
//   displayName: null,
//   length: null,
//   infoHashes: ['urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a'],
//   webSeeds: [],
//   acceptableSources: [],
//   sources: [],
//   keywords: [],
//   manifest: null,
//   trackers: []
// }
```

**Decoding with display name and trackers:**

```typescript
const magnetLink = 'magnet:?dn=Ubuntu%2024.04%20LTS&xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&tr=udp%3A%2F%2Ftracker.example.com%3A80&tr=wss%3A%2F%2Ftracker.webtorrent.io';

const result = decode(magnetLink);

console.log(result.displayName);  // 'Ubuntu 24.04 LTS'
console.log(result.trackers);
// [
//   'udp://tracker.example.com:80',
//   'wss://tracker.webtorrent.io'
// ]
```

**Base32 hashes (auto-converted to hex):**

```typescript
// Base32 encoded hash (32 characters)
const result = decode('magnet:?xt=urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q');

console.log(result.infoHashes);
// ['urn:btih:81e177e2cc00943b29fcfc635457f575237293b0']
// Note: Base32 is automatically converted to lowercase hex
```

**Multiple hash types:**

```typescript
const magnetLink = 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&xt=urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709';

const result = decode(magnetLink);

console.log(result.infoHashes);
// [
//   'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
//   'urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709'
// ]
```

**Handling invalid input:**

```typescript
// Empty or invalid strings return default empty object
const result = decode('');
console.log(result.infoHashes);  // []

// Invalid hashes are silently ignored
const result2 = decode('magnet:?xt=urn:btih:invalid');
console.log(result2.infoHashes);  // []

// Non-URN format is ignored
const result3 = decode('magnet:?xt=btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a');
console.log(result3.infoHashes);  // [] (missing 'urn:' prefix)
```

---

### `encode(data: Partial<IMagnetURI>): string`

Builds a magnet link string from a structured object.

#### Examples

**Basic encoding with hash only:**

```typescript
import { encode } from 'magnetizer';

const magnetLink = encode({
  infoHashes: ['c12fe1c06bba254a9dc9f519b335aa7c1367a88a']
});

console.log(magnetLink);
// 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a'
```

**Full object with all fields:**

```typescript
const magnetLink = encode({
  displayName: 'example-file.tar.gz',
  length: 1048576,
  infoHashes: ['c12fe1c06bba254a9dc9f519b335aa7c1367a88a'],
  trackers: [
    'udp://tracker.example.com:80',
    'wss://tracker.webtorrent.io'
  ],
  webSeeds: ['https://example.com/files/example-file.tar.gz'],
  acceptableSources: ['https://mirror.example.com/example-file.tar.gz'],
  sources: ['http://cache.example.com/c12fe1c06bba254a9dc9f519b335aa7c1367a88a'],
  keywords: ['example', 'archive', 'tar'],
  manifest: 'https://example.com/manifest.rss'
});

console.log(magnetLink);
// 'magnet:?dn=example-file.tar.gz&xl=1048576&xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&tr=udp%3A%2F%2Ftracker.example.com%3A80&tr=wss%3A%2F%2Ftracker.webtorrent.io&kt=example+archive+tar&ws=https%3A%2F%2Fexample.com%2Ffiles%2Fexample-file.tar.gz&as=https%3A%2F%2Fmirror.example.com%2Fexample-file.tar.gz&xs=http%3A%2F%2Fcache.example.com%2Fc12fe1c06bba254a9dc9f519b335aa7c1367a88a&mt=https%3A%2F%2Fexample.com%2Fmanifest.rss'
```

**Using Uint8Array/Buffer for hashes:**

```typescript
// From hex string to Uint8Array
const hashBytes = new Uint8Array([
  0xc1, 0x2f, 0xe1, 0xc0, 0x6b, 0xba, 0x25, 0x4a,
  0x9d, 0xc9, 0xf5, 0x19, 0xb3, 0x35, 0xaa, 0x7c,
  0x13, 0x67, 0xa8, 0x8a
]);

const magnetLink = encode({
  infoHashes: [hashBytes]
});

console.log(magnetLink);
// 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a'
```

**Multiple info hashes:**

```typescript
const magnetLink = encode({
  infoHashes: [
    'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
    'urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709',
    'urn:md5:d41d8cd98f00b204e9800998ecf8427e'
  ]
});

console.log(magnetLink);
// 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&xt=urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709&xt=urn:md5:d41d8cd98f00b204e9800998ecf8427e'
```

**Different hash type URNs:**

```typescript
// Plain hex defaults to btih
encode({ infoHashes: ['c12fe1c06bba254a9dc9f519b335aa7c1367a88a'] });
// Result: xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a

// Explicit URN prefix is preserved
encode({ infoHashes: ['urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709'] });
// Result: xt=urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709

encode({ infoHashes: ['urn:ed2k:31d6cfe0d16ae931b73c59d7e0c089c0'] });
// Result: xt=urn:ed2k:31d6cfe0d16ae931b73c59d7e0c089c0
```

---

### `IMagnetURI` Interface

| Property | Type | Magnet Param | Description |
|----------|------|--------------|-------------|
| `displayName` | `string \| null` | `dn` | Human-readable filename |
| `length` | `number \| null` | `xl` | Exact file size in bytes |
| `infoHashes` | `Array<string \| Uint8Array>` | `xt` | URN containing file hash(es) |
| `webSeeds` | `string[]` | `ws` | HTTP/HTTPS download URLs |
| `acceptableSources` | `string[]` | `as` | Alternative web download sources |
| `sources` | `string[]` | `xs` | P2P source links (by content-hash) |
| `keywords` | `string[]` | `kt` | Search keywords |
| `manifest` | `string \| null` | `mt` | Link to metafile (e.g., RSS feed) |
| `trackers` | `string[]` | `tr` | BitTorrent tracker URLs |


## Supported Hash Types

| Hash Type | URN Prefix | Hex Length | Base32 Support | Description |
|-----------|------------|------------|----------------|-------------|
| **BitTorrent v1** | `urn:btih:` | 40 chars | Yes (32 chars) | SHA-1 hash of torrent info dictionary |
| **BitTorrent v2** | `urn:btmh:` | 68 chars | No | Multihash (1220 prefix + SHA-256) |
| **SHA-1** | `urn:sha1:` | 40 chars | Yes (32 chars) | Generic SHA-1 file hash |
| **MD5** | `urn:md5:` | 32 chars | No | MD5 file hash |
| **eDonkey 2000** | `urn:ed2k:` | 32 chars | No | eDonkey/eMule network hash |

### Hash Format Examples

```
BitTorrent v1 (hex):    urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a
BitTorrent v1 (base32): urn:btih:QHQXPYWMACKDWKP47RRVIV7VOURXFE5Q
BitTorrent v2:          urn:btmh:1220caf1e1c30e81cb361b9ee167c4aa411dfc88b7eb23e726d4451376f351009414
SHA-1:                  urn:sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709
MD5:                    urn:md5:d41d8cd98f00b204e9800998ecf8427e
eDonkey 2000:           urn:ed2k:31d6cfe0d16ae931b73c59d7e0c089c0
```

---

## Advanced Usage

### Multiple Info Hashes

Torrents can include multiple hash types for cross-network compatibility:

```typescript
import { decode, encode } from 'magnetizer';

// Decode a magnet link with multiple hashes
const result = decode(
  'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a' +
  '&xt=urn:ed2k:31d6cfe0d16ae931b73c59d7e0c089c0'
);

console.log(result.infoHashes);
// [
//   'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
//   'urn:ed2k:31d6cfe0d16ae931b73c59d7e0c089c0'
// ]
```

### BitTorrent v2 Hybrid Torrents

BitTorrent v2 uses SHA-256 hashes with a multihash prefix. Hybrid torrents include both v1 and v2 hashes:

```typescript
const hybridMagnet = encode({
  displayName: 'hybrid-torrent',
  infoHashes: [
    'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
    'urn:btmh:1220caf1e1c30e81cb361b9ee167c4aa411dfc88b7eb23e726d4451376f351009414'
  ]
});

// Both old and new clients can use this magnet link
```

### Using Uint8Array for Hashes

The encoder accepts binary hash data as `Uint8Array`:

```typescript
// Convert hex string to bytes
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

const hashBytes = hexToBytes('c12fe1c06bba254a9dc9f519b335aa7c1367a88a');

const magnetLink = encode({
  infoHashes: [hashBytes]
});
// Result: 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a'
```

### Round-Trip Preservation

Data is preserved through decode/encode cycles:

```typescript
const original = 'magnet:?dn=test&xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&tr=udp%3A%2F%2Ftracker.example.com%3A80';

const decoded = decode(original);
const reencoded = encode(decoded);

// Note: Parameter order may differ, but data is equivalent
console.log(decode(reencoded));
// Same structured data as decode(original)
```

---

## Compatibility

| Runtime | Support |
|---------|---------|
| **Node.js** | v14+ (ES2020) |
| **Deno** | Full ESM support |
| **Bun** | Native TypeScript support |
| **Browser** | Modern browsers (ES2020) |

### Module Formats

- **ESM**: `import { decode, encode } from 'magnetizer'`
- **CommonJS**: `const { decode, encode } = require('magnetizer')`

---

## Development

```bash
# Clone the repository
git clone https://github.com/isolomak/magnetizer.git
cd magnetizer

# Install dependencies
npm install

# Build (compiles to lib/)
npm run build

# Run tests (100% coverage required)
npm test

# Run linting
npm run lint
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
