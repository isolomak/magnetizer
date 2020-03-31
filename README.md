
[![NPM](https://nodei.co/npm/magnetizer.png)](https://npmjs.org/package/magnetizer)

[![build](https://circleci.com/gh/IvanSolomakhin/magnetizer.svg?style=shield)](https://app.circleci.com/pipelines/github/IvanSolomakhin/magnetizer)
[![codecov](https://codecov.io/gh/IvanSolomakhin/magnetizer/branch/master/graph/badge.svg)](https://codecov.io/gh/IvanSolomakhin/magnetizer)

## Magnetizer
  Library for decoding and encoding [magnet links](https://en.wikipedia.org/wiki/Magnet_URI_scheme).  
  
  Fast and easy to use.  
  Written in TypeScript.  
  Fully tested with 100% code coverage.  
  Without dependencies.  
  
  
## Installation
| npm | yarn |
|---|---|
| `npm install --save magnetizer` | `yarn add magnetizer` |

## Getting Started

##### Import library
| typescript | javascript |
|---|---|
| ` import magnetizer from 'magnetizer' ` | ` const magnetizer = require('magnetizer') `|

##### Parse magnet link
```
  magnetizer.decode('<magnet link>');
```

##### Encode magnet link
```
  magnetizer.encode('<data>');
```

## Tests
  ```
  npm test
  ```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
