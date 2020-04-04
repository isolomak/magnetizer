
[![NPM](https://nodei.co/npm/magnetizer.png)](https://npmjs.org/package/magnetizer)

![ci](https://github.com/IvanSolomakhin/magnetizer/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/IvanSolomakhin/magnetizer/badge.svg)](https://coveralls.io/github/IvanSolomakhin/magnetizer)
[![NPM Downloads](https://img.shields.io/npm/dt/magnetizer)](https://npmjs.org/package/magnetizer)
[![NPM License](https://img.shields.io/npm/l/magnetizer)](LICENSE)

  Library for decoding and encoding [magnet links](https://en.wikipedia.org/wiki/Magnet_URI_scheme).  
  
  Fast and easy to use.  
  Written in TypeScript.  
  Fully tested with 100% code coverage.  

  
## Installation
| npm | yarn |
|---|---|
| `npm install --save magnetizer` | `yarn add magnetizer` |

## Getting Started

##### Import library
| typescript | javascript |
|---|---|
| ` import magnetizer from 'magnetizer' ` | ` const magnetizer = require('magnetizer') `|

##### Decode magnet link
```
  magnetizer.decode('magnet:?dn=test-name_for_magnet-link.tar.gz&xl=100500&xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&tr=http%3A%2F%2Ftracker.example.org%2Fannounce.php%3Fua%3D1111111111&tr=wss%3A%2F%2Ftracker.webtorrent.io&kt=martin+luther+king+mp3&ws=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5&mt=http%3A%2F%2Fweblog.foo%2Fall-my-favorites.rss');
  
  // {
  //    displayNames: [ 'test-name_for_magnet-link.tar.gz' ],
  //    length: 100500,
  //    infoHashes: [ 'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a' ],
  //    webSeeds: [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ],
  //    acceptableSources: [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ],
  //    sources: [ 'http://cache.example.org/XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5' ],
  //    keywords: [ 'martin', 'luther', 'king', 'mp3' ],
  //    manifest: 'http://weblog.foo/all-my-favorites.rss',
  //    trackers: [
  //      'http://tracker.example.org/announce.php?ua=1111111111',
  //      'wss://tracker.webtorrent.io',
  //    ],
  // }
```

##### Encode magnet link
```
  magnetizer.encode({
    displayNames: [ 'test-name_for_magnet-link.tar.gz' ],
    length: 100500,
    infoHashes: [ 'urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a' ],
    webSeeds: [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ],
    acceptableSources: [ 'http://download.wikimedia.org/mediawiki/1.15/mediawiki-1.15.1.tar.gz' ],
    sources: [ 'http://cache.example.org/XRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5' ],
    keywords: [ 'martin', 'luther', 'king', 'mp3' ],
    manifest: 'http://weblog.foo/all-my-favorites.rss',
    trackers: [
        'http://tracker.example.org/announce.php?ua=1111111111',
        'wss://tracker.webtorrent.io',
    ],
  });
  
  // 'magnet:?dn=test-name_for_magnet-link.tar.gz&xl=100500&xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a&tr=http%3A%2F%2Ftracker.example.org%2Fannounce.php%3Fua%3D1111111111&tr=wss%3A%2F%2Ftracker.webtorrent.io&kt=martin+luther+king+mp3&ws=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&as=http%3A%2F%2Fdownload.wikimedia.org%2Fmediawiki%2F1.15%2Fmediawiki-1.15.1.tar.gz&xs=http%3A%2F%2Fcache.example.org%2FXRX2PEFXOOEJFRVUCX6HMZMKS5TWG4K5&mt=http%3A%2F%2Fweblog.foo%2Fall-my-favorites.rss'
```

## Tests
  ```
  npm test
  ```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
