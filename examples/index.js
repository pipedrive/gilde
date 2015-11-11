////////////////////////////////////
// hash creation:

var gilde = require('../index').setSecret('node-meeting-november');

var obj = {
	some: 'data',
	to: 'verify',
	important: true,
};

var hash = gilde.create(obj);

console.log(hash); // prints the hash on the command line


////////////////////////////////////
// hash validation:

// immediate validation with a 1 sec timeout:
console.log('immediate validation: ' + gilde.validate(hash, obj, { timeout: 1000 }) + ' (expected true)');
// expected result: true

// 2 secs delayed validation with a 1 sec timeout:
setTimeout(function() {
	console.log('delayed validation: ' + gilde.validate(hash, obj, { timeout: 1000 }) + ' (expected false)');
	// expected result: false
}, 2000);

