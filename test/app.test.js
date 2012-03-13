var app = require('../app')
	,	assert = require('assert');

describe("app",function(done){
	it('should inherit from event emitter', function(done){
		app.on('foo', done);
    app.emit('foo');
  });
});