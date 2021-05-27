# @heppokofrontend/flat-deep

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE) [![Published on NPM](https://img.shields.io/npm/v/@heppokofrontend/flat-deep.svg)](https://www.npmjs.com/package/@heppokofrontend/flat-deep) ![test workflow](https://github.com/heppokofrontend/flat-deep/actions/workflows/ci.yml/badge.svg)
 [![](https://data.jsdelivr.com/v1/package/npm/@heppokofrontend/flat-deep/badge)](https://www.jsdelivr.com/package/npm/@heppokofrontend/flat-deep) [![Maintainability](https://api.codeclimate.com/v1/badges/bacf4dcc44135e8ef5ec/maintainability)](https://codeclimate.com/github/heppokofrontend/flat-deep/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/bacf4dcc44135e8ef5ec/test_coverage)](https://codeclimate.com/github/heppokofrontend/flat-deep/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/npm/@heppokofrontend/flat-deep/badge.svg)](https://snyk.io/test/npm/@heppokofrontend/flat-deep)
 [![@heppokofrontend/flat-deep](https://snyk.io/advisor/npm-package/@heppokofrontend/flat-deep/badge.svg)](https://snyk.io/advisor/npm-package/@heppokofrontend/flat-deep)


The `flatDeep()` method creates a new array with all sub-iterables elements concatenated into it recursively up.

## Usage

Installation:

```shell
npm install --save @heppokofrontend/flat-deep
```

Example: 

```javascript
import { flatDeep } from '@heppokofrontend/flat-deep';

const arr = [
  0,
  'hoge',
  [
    1,
    2,
    [
      4,
      5,
    ],
  ],
  6,
];

console.log(flatDeep(arr)); // > [0, 'hoge', 1, 2, 3, 4, 5, 6]
```

## Syntax

```ts
flatDeep(iterable, options);
```

### Parameters

#### `iterable`

The iterable object to be flattened.

For Example:

- Array
- Set
- Map
- NodeList
- HTMLCollection

#### `options`

|property|type|default|required|description|
|---|:-:|:-:|:-:|---|
|`stringIgnore`|`boolean`|`true`|none|Whether to ignore the string type.|
|`circularReferenceToJson`|`boolean`|`false`|none|If a circular reference is found, convert it to JSON without ignoring it. The circular reference will be replaced by the string `[Circular]` (see [fast-safe-stringify](https://www.npmjs.com/package/fast-safe-stringify)).|

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
