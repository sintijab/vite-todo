// setupTests.ts
if (typeof global.TextEncoder === 'undefined') {
	global.TextEncoder = require('util').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
	global.TextDecoder = require('util').TextDecoder;
}

global.Request = require('cross-fetch').Request;