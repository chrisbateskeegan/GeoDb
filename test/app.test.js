var app = require('../app.js');
var assert = require('assert');

describe("app",function(done){
    it('should inherit from event emitter', function(done){
	app.on('foo', done);
	app.
emit('foo');
    });
});