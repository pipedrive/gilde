var assert = require('assert'),
	sinon = require('sinon');

describe('hasher', function() {
	it('should throw up if default shared secret is used', function(done) {
		var Gilde = require('../'),
			gilde = new Gilde(),
			data = { some: 'random data' };

		try {
			var hash = gilde.create(data);
		} catch(e) {
			// We expect an error.
			assert(e.toString().match(/You must set a shared secret before creating hashes!/ig));
			done();
			return;
		}

		assert(false);
	});

	it('should create valid hashes', function() {
		var Gilde = require('../'),
			gilde = new Gilde(),
			data = { some: 'random data' },
			hash = gilde.setSecret('secret1').create(data);

		assert(hash.match(/^[a-z0-9]{64},[0-9]+$/));
	});

	it('should validate hash within default timeout', function() {
		var Gilde = require('../'),
			gilde = new Gilde(),
			data = { some: 'random data' },
			clock = sinon.useFakeTimers(),
			hash = gilde.setSecret('secret1').create(data);
		
		assert(gilde.validate(hash, data));
	});

	it('should not validate hash after default timeout', function() {
		var Gilde = require('../'),
			gilde = new Gilde(),
			data = { some: 'random data' },
			clock = sinon.useFakeTimers(),
			hash = gilde.setSecret('secret1').create(data);

		clock.tick(2500);

		assert(!gilde.validate(hash, data));
	});

	it('should validate hash after 2,5sec given a 5sec timeout', function() {
		var Gilde = require('../'),
			gilde = new Gilde(),
			data = { some: 'random data' },
			clock = sinon.useFakeTimers(),
			hash = gilde.setSecret('secret1').create(data);

		clock.tick(2500);

		assert(gilde.validate(hash, data, { timeout: 5000 }));
	});

	it('should not validate hash after 5,5sec given a 5sec timeout', function() {
		var Gilde = require('../'),
			gilde = new Gilde(),
			data = { some: 'random data' },
			clock = sinon.useFakeTimers(),
			hash = gilde.setSecret('secret1').create(data);

		clock.tick(5500);

		assert(!gilde.validate(hash, data, { timeout: 5000 }));
	});

	it('should support swapping shared secret strings on the fly', function() {
		var Gilde = require('../'),
			gilde = new Gilde(),
			data = { some: 'random data' },
			clock = sinon.useFakeTimers();
		
		gilde.setSecret('secret1');

		var hash1 = gilde.create(data);
		var hash2 = gilde.create(data);

		gilde.setSecret('secret2');

		var hash3 = gilde.create(data);

		assert(hash1 === hash2);
		assert(hash1 !== hash3);
		assert(hash2 !== hash3);
	});

	it('should throw up on non-string shared secrets', function(done) {
		var Gilde = require('../'),
			gilde = new Gilde(),
			data = { some: 'random data' },
			clock = sinon.useFakeTimers();
		
		try {
			gilde.setSecret(123);
		} catch(e) {
			// We expect an error.
			assert(e.toString().match(/Only strings should be passed in as shared secrets!/ig));
			done();
			return;
		}

		assert(false);
	});

	it('should throw up on empty string as shared secrets', function(done) {
		var Gilde = require('../'),
			gilde = new Gilde(),
			data = { some: 'random data' },
			clock = sinon.useFakeTimers();
		
		try {
			gilde.setSecret('');
		} catch(e) {
			// We expect an error.
			assert(e.toString().match(/Shared secret cannot be an empty string!/ig));
			done();
			return;
		}

		assert(false);
	});
});
