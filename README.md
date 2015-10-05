# gilde

Time-based hash checksum creation/validation library.

[![npm version](https://badge.fury.io/js/gilde.svg)](http://badge.fury.io/js/gilde) [![Build status](https://travis-ci.org/pipedrive/gilde.svg)](https://travis-ci.org/pipedrive/gilde)

## Use cases

Use Gilde to create and validate shared secret and time based hashes derived from any JSON-serializable data.


## Usage

```
npm install gilde
```

### Create a hash

```javascript
var gilde = require('gilde').setSecret('Thirteen stone columns inside a pyramid.');

var data = {
	some: 'awesome data'
};

var hash = gilde.create(data);
```

This will create a time and shared secret based derived hash, based on the given data. Then, in another part of your system, you can validate the given data against the given hash, using the following syntax.

### Validate a hash

```javascript
var result = gilde.validate(hash, data);
// returns either true or false
```

This will return a boolean value of the validation result. Furthermore, you can pass a third argument with options, such as `timeout` which will control how old timestamps are still considered valid.

## How it works

### Creating the hashes

![hashing diagram](https://github.com/pipedrive/gilde/raw/master/assets/diagram1.png "Hashing diagram")

The shared secret, JSON serialized data and the current UNIX timestamp in milliseconds are hashed together using the SHA256 algorhythm into `hashA`. The derived `hashA` is then hashed again together with the same UNIX timestamp using the SHA256 algorhythm into `hashB`. The resulting `hashB` is joined with the same timestamp and returned from the function as a single string, e.g. `57b91ea40b4bc28baa4ff782e661c5a6a12db97a3f60f4bd272ff32d9d77d8ed,1444044349222`.

The result of calling `gilde.create()` thus returns a string that contains the derived hash and the timestamp used in the hashing process. Revealing the timestamp in a non-hashed format is acceptable and required, since this is used for validation on the other end, and timeouts are used to invalidate any hashes marked as older than a configurable threshold.

### Validating the hashes

When validating the hashes, `gilde.validate()` requires you to supply the resulting created hash and the underlying data in question. It will then try to recreate the hash using the supplied timestamp and will produce a positive result if both the hash can be recreated (meaning the shared secret is the same and data matches) and time threshold is not exceeded (e.g. hash is validated within N milliseconds after it was first created).

## Licence

MIT.
