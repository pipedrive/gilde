var crypto = require('crypto'),
	NO_SECRET = 'notasecret',
	secret = NO_SECRET,
	separator = ',';

exports.setSecret = function(newSecret) {
	if (typeof newSecret !== 'string') {
		throw new Error('Only strings should be passed in as shared secrets!');
	}
	if (newSecret === '') {
		throw new Error('Shared secret cannot be an empty string!');
	}
	secret = newSecret;
	return this;
};

exports.create = function(data, timestamp) {
	if (secret === NO_SECRET) {
		throw new Error('You must set a shared secret before creating hashes!');
	}
	var shasum = crypto.createHash('sha256'),
		shasum2 = crypto.createHash('sha256');

	if (typeof timestamp !== 'number') {
		timestamp = new Date().getTime();
	}

	shasum.update(secret + separator + JSON.stringify(data) + separator + timestamp);

	var var1 = shasum.digest('hex') + separator + timestamp;
	shasum2.update(var1);

	return shasum2.digest('hex') + separator + timestamp;
};

exports.validate = function(hash, data, opts) {
	var defaults = {
			timeout: 2000
		},
		options = {
			timeout: opts && opts.timeout ? opts.timeout : defaults.timeout
		},
		timestamp = parseInt(hash.split(separator).pop(), 10),
		now = new Date().getTime();

	if (options.timeout > 0 && now - timestamp < options.timeout) {
		return exports.create(data, timestamp) === hash;
	}

	return false;
};