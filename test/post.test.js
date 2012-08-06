var http = require('http');
var mongoose = require('mongoose');
var models = require('../models');
var app = require('../app');

describe('POST', function(){
    before(function(done){
  	models.Location.nextLocationRef = -1;
	
    	models.Location.remove({}, done);
    });

    describe('Create', function(){
	it('should Create a valid location (SD123123)', function(done){
    	    testLocationPost("gridRef=SD123123&location=This is a valid location", function(data) {
    		var response = JSON.parse(data);
    		response.error.should.equal(false);
		response.result.should.equal(true);
  	  	response.ref.should.not.equal(-1);
  	  	
  		models.Location.find({ref: response.ref}, function(err, locs){
  		    if (err) return done(err);
  	      	    
  		    locs.should.have.length(1);
  		    locs[0].ref.should.equal(response.ref);
  		    locs[0].gridRef.should.equal("SD123123");
  		    locs[0].location.should.equal("This is a valid location");
  		    
  		    done();
  		});
    	    });
	});
    });
    
    describe('Create', function(){
	it('ASDASDASD should be an invalid location', function(done){
    	    testLocationPost("gridRef=ASDASDASD&location=This is an invalid location", function(data) {
    		var response = JSON.parse(data);
  	  	response.error.should.equal(true);
  	  	done();
    	    });
	});
    });
    
    describe('Create', function(){
	it('SD123123 should be a duplicate location', function(done){
    	    testLocationPost("gridRef=SD123123&location=This is a duplicate location", function(data) {
    		var response = JSON.parse(data);
  	  	response.error.should.equal(false);
  	  	response.locs.should.have.length(1);
  	  	response.locs[0].gridRef.should.equal("SD123123");
  	  	done();
    	    });
	});
    });
    
    after(function(done) {
  	models.Location.remove({},done);
    });
});

function testLocationPost(params,fn) {
    var req = http.request({
	host: 'localhost',
	path: '/location.json',
	port: app.set('port'),
	method: 'POST',
	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, function(res) {
	res.setEncoding('utf8');
	res.should.have.status(200);
	res.should.be.json;
	res.on('data', fn);
    });
    
    req.on('error', function(e) {
	should.fail('POST failed: ' + e.message);
    });    	
    
    req.write(params);
    req.end();
}