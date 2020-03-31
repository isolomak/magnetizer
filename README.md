
[![NPM](https://nodei.co/npm/magnet-parser.png)](https://npmjs.org/package/magnet-parser)

[![build](https://circleci.com/gh/IvanSolomakhin/magnet-parser.svg?style=shield)](https://app.circleci.com/pipelines/github/IvanSolomakhin/magnet-parser)
[![codecov](https://codecov.io/gh/IvanSolomakhin/magnet-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/IvanSolomakhin/magnet-parser)

## Magnet-parser
  Library for parsing and encoding [magnet links](https://en.wikipedia.org/wiki/Magnet_URI_scheme).  
  
  Fast and easy to use.  
  Written in TypeScript.  
  Fully tested with 100% code coverage.  
  Without dependencies.  
  
  
## Installation
| npm | yarn |
|---|---|
| `npm install --save magnet-parser` | `yarn add magnet-parser` |

## Getting Started

##### Import library
| typescript | javascript |
|---|---|
| ` import magnetParser from 'bencodec' ` | ` const magnetParser = require('magnet-parser') `|

##### Parse magnet link
```
  magnetParser.parse('<magnet link>');
```

##### Encode magnet link
```
  magnetParser.encode('<data>');
```

## Tests
  ```
  npm test
  ```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
